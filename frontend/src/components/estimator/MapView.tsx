"use client";

import { useEffect } from "react";
import { Map, useMap } from "@vis.gl/react-google-maps";
import { GeoJSONPolygon } from "@/types";

interface Props {
  center: { lat: number; lng: number };
  zoom?: number;
  polygon?: GeoJSONPolygon | null;
}

function PolygonOverlay({ polygon }: { polygon: GeoJSONPolygon }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // Clear existing data layer features
    map.data.forEach((feature) => map.data.remove(feature));

    map.data.addGeoJson({
      type: "Feature",
      geometry: polygon,
      properties: {},
    });

    map.data.setStyle({
      fillColor: "#60A5FA",
      fillOpacity: 0.4,
      strokeColor: "#1D4ED8",
      strokeWeight: 2,
    });

    return () => {
      map.data.forEach((feature) => map.data.remove(feature));
    };
  }, [map, polygon]);

  return null;
}

export function MapView({ center, zoom = 19, polygon }: Props) {
  return (
    <div className="w-full h-64 sm:h-80 rounded-xl overflow-hidden shadow-md">
      <Map
        defaultCenter={center}
        defaultZoom={zoom}
        center={center}
        zoom={zoom}
        mapTypeId="satellite"
        tilt={0}
        disableDefaultUI
        gestureHandling="none"
        style={{ width: "100%", height: "100%" }}
      >
        {polygon && <PolygonOverlay polygon={polygon} />}
      </Map>
    </div>
  );
}
