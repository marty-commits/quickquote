"use client";

import { useEffect, useRef, useState } from "react";
import { useMapsLibrary, Map, useMap } from "@vis.gl/react-google-maps";
import { Search, Ruler } from "lucide-react";
import { useEstimatorStore } from "@/stores/estimatorStore";
import { Button } from "@/components/ui/button";
import { DEFAULT_FOOTPRINT_SQFT } from "@/lib/constants";
import { GeoJSONPolygon, Coordinates } from "@/types";

// Handles camera animation and polygon overlay — must be a child of <Map>
function MapController({
  coordinates,
  polygon,
}: {
  coordinates: Coordinates | null;
  polygon: GeoJSONPolygon | null;
}) {
  const map = useMap();
  const prevCoords = useRef<Coordinates | null>(null);

  useEffect(() => {
    if (!map || !coordinates) return;
    if (
      prevCoords.current?.lat === coordinates.lat &&
      prevCoords.current?.lng === coordinates.lng
    )
      return;
    prevCoords.current = coordinates;

    map.setMapTypeId("satellite");
    map.panTo(coordinates);

    const steps = [5, 9, 13, 16, 19];
    const delay = 350;
    const timers = steps.map((zoom, i) =>
      setTimeout(() => map.setZoom(zoom), (i + 1) * delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [map, coordinates]);

  useEffect(() => {
    if (!map) return;
    map.data.forEach((f) => map.data.remove(f));
    if (!polygon) return;
    map.data.addGeoJson({ type: "Feature", geometry: polygon, properties: {} });
    map.data.setStyle({
      fillColor: "#60A5FA",
      fillOpacity: 0.4,
      strokeColor: "#1D4ED8",
      strokeWeight: 2,
    });
  }, [map, polygon]);

  return null;
}

export function AddressStep() {
  const placesLib = useMapsLibrary("places");
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [ready, setReady] = useState(false);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [polygon, setPolygon] = useState<GeoJSONPolygon | null>(null);
  const [sqft, setSqft] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const { setAddress, setFootprint, nextStep } = useEstimatorStore();

  useEffect(() => {
    if (!placesLib || !inputRef.current) return;

    autocompleteRef.current = new placesLib.Autocomplete(inputRef.current, {
      types: ["address"],
      fields: ["formatted_address", "geometry"],
    });

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current?.getPlace();
      if (!place?.geometry?.location || !place.formatted_address) return;

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const coords = { lat, lng };

      setAddress(place.formatted_address, coords);
      setCoordinates(coords);
      setPolygon(null);
      setSqft(null);
      setLoading(true);

      fetch(`/api/footprint?lat=${lat}&lng=${lng}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.polygon && data.areaSqft) {
            setPolygon(data.polygon);
            setSqft(data.areaSqft);
          } else {
            setSqft(DEFAULT_FOOTPRINT_SQFT);
          }
        })
        .catch(() => setSqft(DEFAULT_FOOTPRINT_SQFT))
        .finally(() => setLoading(false));
    });

    setReady(true);
  }, [placesLib, setAddress]);

  const handleContinue = () => {
    setFootprint(polygon, sqft ?? DEFAULT_FOOTPRINT_SQFT);
    nextStep();
  };

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">
          Get Your Free Roof Estimate
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter your address to see your roof and get an instant estimate.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
        <input
          ref={inputRef}
          type="text"
          placeholder={ready ? "Enter your home address..." : "Loading maps..."}
          disabled={!ready}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full pl-9 pr-4 py-3 border border-input rounded-lg text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-60 disabled:cursor-not-allowed"
        />
      </div>

      <div className="w-full h-72 rounded-xl overflow-hidden shadow-md">
        <Map
          defaultCenter={{ lat: 54, lng: -97 }}
          defaultZoom={3}
          mapTypeId="satellite"
          disableDefaultUI
          gestureHandling="none"
          style={{ width: "100%", height: "100%" }}
        >
          <MapController coordinates={coordinates} polygon={polygon} />
        </Map>
      </div>

      {coordinates && (
        loading ? (
          <div className="flex items-center justify-center gap-2 py-1 text-sm text-muted-foreground">
            <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            Detecting roof outline...
          </div>
        ) : sqft !== null ? (
          <div className="space-y-3">
            <div className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
              <Ruler className="h-4 w-4 text-blue-600 shrink-0" />
              <span className="text-sm font-medium text-blue-700">
                {sqft.toLocaleString()} sq ft detected
                {!polygon && " (estimated)"}
              </span>
            </div>
            <Button
              onClick={handleContinue}
              className="w-full bg-cta hover:bg-cta-hover text-white font-semibold"
            >
              Continue
            </Button>
          </div>
        ) : null
      )}

      {!coordinates && (
        <p className="text-xs text-center text-muted-foreground">
          Your information is kept private and only used to generate your estimate.
        </p>
      )}
    </div>
  );
}
