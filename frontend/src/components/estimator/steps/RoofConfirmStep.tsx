"use client";

import { useEffect, useState } from "react";
import { Ruler, AlertCircle } from "lucide-react";
import { useEstimatorStore } from "@/stores/estimatorStore";
import { MapView } from "@/components/estimator/MapView";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DEFAULT_FOOTPRINT_SQFT } from "@/lib/constants";
import { GeoJSONPolygon } from "@/types";

export function RoofConfirmStep() {
  const { coordinates, setFootprint, nextStep, prevStep } = useEstimatorStore();
  const [loading, setLoading] = useState(true);
  const [polygon, setPolygon] = useState<GeoJSONPolygon | null>(null);
  const [sqft, setSqft] = useState<number>(DEFAULT_FOOTPRINT_SQFT);
  const [noData, setNoData] = useState(false);

  useEffect(() => {
    if (!coordinates) return;

    const controller = new AbortController();

    fetch(
      `/api/footprint?lat=${coordinates.lat}&lng=${coordinates.lng}`,
      { signal: controller.signal }
    )
      .then((r) => r.json())
      .then((data) => {
        if (data.polygon && data.areaSqft) {
          setPolygon(data.polygon);
          setSqft(data.areaSqft);
        } else {
          setNoData(true);
          setSqft(DEFAULT_FOOTPRINT_SQFT);
        }
      })
      .catch(() => {
        setNoData(true);
        setSqft(DEFAULT_FOOTPRINT_SQFT);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [coordinates]);

  const handleContinue = () => {
    setFootprint(polygon, sqft);
    nextStep();
  };

  if (!coordinates) return null;

  return (
    <div className="space-y-5">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-primary">Your Roof</h2>
        <p className="text-sm text-muted-foreground">
          We detected your home from satellite imagery.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="w-full h-72 rounded-xl" />
          <Skeleton className="w-48 h-8 rounded-lg mx-auto" />
        </div>
      ) : (
        <>
          <MapView center={coordinates} zoom={19} polygon={polygon} />

          {noData ? (
            <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                We could not detect your exact roof outline. We will use a typical home size of{" "}
                <strong>{DEFAULT_FOOTPRINT_SQFT.toLocaleString()} sq ft</strong> for your estimate.
              </span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Ruler className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-blue-700 text-sm">
                Detected roof area: {sqft.toLocaleString()} sq ft
              </span>
            </div>
          )}
        </>
      )}

      <div className="flex gap-3 pt-2">
        <Button
          variant="outline"
          onClick={prevStep}
          className="flex-1"
          disabled={loading}
        >
          Back
        </Button>
        <Button
          onClick={handleContinue}
          className="flex-1 bg-cta hover:bg-cta-hover text-white"
          disabled={loading}
        >
          Looks right, continue
        </Button>
      </div>
    </div>
  );
}
