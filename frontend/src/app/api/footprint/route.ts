import { NextRequest, NextResponse } from "next/server";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import turfArea from "@turf/area";
import { point, polygon as turfPolygon } from "@turf/helpers";

const SQM_TO_SQFT = 10.7639;
const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

interface OsmNode {
  type: "node";
  id: number;
  lat: number;
  lon: number;
}

interface OsmWay {
  type: "way";
  id: number;
  nodes: number[];
  geometry?: { lat: number; lon: number }[];
  tags?: Record<string, string>;
}

type OsmElement = OsmNode | OsmWay;

interface OverpassResponse {
  elements: OsmElement[];
}

function wayToPolygonCoords(
  way: OsmWay,
  nodeMap: Map<number, OsmNode>
): number[][] | null {
  let coords: number[][];

  if (way.geometry && way.geometry.length > 0) {
    coords = way.geometry.map((g) => [g.lon, g.lat]);
  } else {
    const nodes = way.nodes
      .map((id) => nodeMap.get(id))
      .filter((n): n is OsmNode => n !== undefined);
    if (nodes.length < 3) return null;
    coords = nodes.map((n) => [n.lon, n.lat]);
  }

  // Close the ring if not already closed
  if (
    coords.length > 0 &&
    (coords[0][0] !== coords[coords.length - 1][0] ||
      coords[0][1] !== coords[coords.length - 1][1])
  ) {
    coords.push(coords[0]);
  }

  return coords.length >= 4 ? coords : null;
}


function distanceSq(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  return (lat1 - lat2) ** 2 + (lng1 - lng2) ** 2;
}

function wayCentroid(way: OsmWay, nodeMap: Map<number, OsmNode>): { lat: number; lng: number } | null {
  let coords: { lat: number; lng: number }[];

  if (way.geometry && way.geometry.length > 0) {
    coords = way.geometry.map((g) => ({ lat: g.lat, lng: g.lon }));
  } else {
    coords = way.nodes
      .map((id) => nodeMap.get(id))
      .filter((n): n is OsmNode => n !== undefined)
      .map((n) => ({ lat: n.lat, lng: n.lon }));
  }

  if (coords.length === 0) return null;
  const lat = coords.reduce((s, c) => s + c.lat, 0) / coords.length;
  const lng = coords.reduce((s, c) => s + c.lng, 0) / coords.length;
  return { lat, lng };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const latStr = searchParams.get("lat");
  const lngStr = searchParams.get("lng");

  if (!latStr || !lngStr) {
    return NextResponse.json(
      { error: "lat and lng are required" },
      { status: 400 }
    );
  }

  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json(
      { error: "lat and lng must be valid numbers" },
      { status: 400 }
    );
  }

  const query = `[out:json][timeout:10];way[building](around:80,${lat},${lng});(._;>;);out geom;`;

  let data: OverpassResponse;
  try {
    const res = await fetch(
      `${OVERPASS_URL}?data=${encodeURIComponent(query)}`,
      {
        signal: AbortSignal.timeout(12000),
        headers: { "User-Agent": "EasyRoofEstimate/1.0" },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { polygon: null, areaSqft: null },
        { status: 503 }
      );
    }

    data = await res.json();
  } catch {
    return NextResponse.json(
      { polygon: null, areaSqft: null },
      { status: 503 }
    );
  }

  const ways = data.elements.filter((e): e is OsmWay => e.type === "way");
  const nodes = data.elements.filter((e): e is OsmNode => e.type === "node");

  if (ways.length === 0) {
    return NextResponse.json({ polygon: null, areaSqft: null });
  }

  const nodeMap = new Map<number, OsmNode>(nodes.map((n) => [n.id, n]));

  // First try to find a building that contains the query point (most accurate)
  const queryPoint = point([lng, lat]);
  let bestWay: OsmWay | null = null;

  for (const way of ways) {
    const coords = wayToPolygonCoords(way, nodeMap);
    if (!coords || coords.length < 4) continue;
    try {
      if (booleanPointInPolygon(queryPoint, turfPolygon([coords]))) {
        bestWay = way;
        break;
      }
    } catch {
      // malformed polygon — skip
    }
  }

  // Fall back to closest centroid if no containing polygon found
  if (!bestWay) {
    let bestDist = Infinity;
    for (const way of ways) {
      const centroid = wayCentroid(way, nodeMap);
      if (!centroid) continue;
      const d = distanceSq(lat, lng, centroid.lat, centroid.lng);
      if (d < bestDist) {
        bestDist = d;
        bestWay = way;
      }
    }
  }

  if (!bestWay) {
    return NextResponse.json({ polygon: null, areaSqft: null });
  }

  const coords = wayToPolygonCoords(bestWay, nodeMap);
  if (!coords) {
    return NextResponse.json({ polygon: null, areaSqft: null });
  }

  const areaSqm = turfArea(turfPolygon([coords]));
  const areaSqft = Math.round(areaSqm * SQM_TO_SQFT);

  const polygon = {
    type: "Polygon" as const,
    coordinates: [coords],
  };

  return NextResponse.json({ polygon, areaSqft });
}
