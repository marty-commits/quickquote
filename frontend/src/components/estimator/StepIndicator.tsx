"use client";

import { EstimatorStep } from "@/types";
import { cn } from "@/lib/utils";

const TOTAL_STEPS = 6; // ADDRESS through CONTACT (not THANK_YOU)

interface Props {
  step: EstimatorStep;
}

export function StepIndicator({ step }: Props) {
  if (step >= EstimatorStep.THANK_YOU) return null;

  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => (
        <div
          key={i}
          className={cn(
            "rounded-full transition-all duration-300",
            i === step
              ? "w-3 h-3 bg-primary"
              : i < step
              ? "w-2 h-2 bg-secondary"
              : "w-2 h-2 bg-border"
          )}
        />
      ))}
    </div>
  );
}
