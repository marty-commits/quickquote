"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { DollarSign } from "lucide-react";
import { useEstimatorStore } from "@/stores/estimatorStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { calcEstimate, formatCurrency } from "@/lib/estimate";
import { MapView } from "@/components/estimator/MapView";
import { Button } from "@/components/ui/button";

export function EstimateStep() {
  const { footprintSqft, pitchMultiplier, coordinates, polygon, setEstimate, estimate, nextStep, prevStep } =
    useEstimatorStore();
  const { settings } = useSettingsStore();

  useEffect(() => {
    const result = calcEstimate(
      footprintSqft,
      pitchMultiplier,
      settings.pricePerSquare,
      settings.belowPct,
      settings.abovePct,
      settings.tiers,
      settings.financing
    );
    setEstimate(result);
  }, [footprintSqft, pitchMultiplier, settings, setEstimate]);

  if (!estimate) return null;

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-xl font-bold text-primary">Your Roof Estimate</h2>
      </div>

      {coordinates && (
        <div className="space-y-2">
          <MapView center={coordinates} zoom={19} polygon={polygon} />
          <div className="text-center text-sm text-muted-foreground">
            Based on{" "}
            <span className="font-semibold text-foreground">
              {Math.round(estimate.roofSqft).toLocaleString()} sq ft
            </span>{" "}
            of roof surface
          </div>
        </div>
      )}

      <div className="space-y-3">
        {estimate.tiers.map((tierEst, i) => (
          <motion.div
            key={tierEst.tier.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl border-2 border-border p-5 shadow-sm"
          >
            {estimate.tiers.length > 1 && (
              <div className="text-xs font-semibold text-secondary uppercase tracking-wide mb-2">
                {tierEst.tier.name}
              </div>
            )}

            <div className="flex items-end justify-between">
              <div>
                <div className="text-3xl font-bold text-primary">
                  {formatCurrency(tierEst.low)}
                  <span className="text-lg font-normal text-muted-foreground mx-1">–</span>
                  {formatCurrency(tierEst.high)}
                </div>
                <div className="text-sm text-muted-foreground mt-0.5">
                  Estimated replacement cost
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-cta opacity-70" />
            </div>

            {tierEst.monthlyPayment && (
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  As low as{" "}
                  <span className="font-semibold text-foreground">
                    {formatCurrency(tierEst.monthlyPayment)}/mo
                  </span>{" "}
                  with financing
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="space-y-2">
        <Button
          onClick={nextStep}
          className="w-full h-12 text-base bg-cta hover:bg-cta-hover text-white font-semibold shadow-md"
        >
          Get a Free Professional Quote
        </Button>
        <Button variant="ghost" onClick={prevStep} className="w-full text-muted-foreground">
          Back
        </Button>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        This is a preliminary estimate. A professional assessment may vary based on local factors, materials, and site conditions.
      </p>
    </div>
  );
}
