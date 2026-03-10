"use client";

import { useEffect, useRef, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { MapPin, Search } from "lucide-react";
import { useEstimatorStore } from "@/stores/estimatorStore";
import { Button } from "@/components/ui/button";

export function AddressStep() {
  const placesLib = useMapsLibrary("places");
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [ready, setReady] = useState(false);
  const { setAddress, nextStep } = useEstimatorStore();

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
      setAddress(place.formatted_address, { lat, lng });
      nextStep();
    });

    setReady(true);
  }, [placesLib, setAddress, nextStep]);

  return (
    <div className="flex flex-col items-center text-center space-y-6">
      <div className="space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-2">
          <MapPin className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">
          Get Your Free Roof Estimate
        </h1>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Enter your home address to see your roof and get an instant price estimate.
        </p>
      </div>

      <div className="w-full max-w-md space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
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
        {inputValue && (
          <p className="text-xs text-muted-foreground">
            Select your address from the dropdown to continue.
          </p>
        )}
      </div>

      <div className="text-xs text-muted-foreground max-w-xs">
        Your information is kept private and only used to generate your estimate.
      </div>
    </div>
  );
}
