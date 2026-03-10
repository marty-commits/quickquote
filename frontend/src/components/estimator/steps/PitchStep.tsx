"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useEstimatorStore } from "@/stores/estimatorStore";
import { PITCH_OPTIONS } from "@/lib/constants";
import { PitchLevel } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function PitchIcon({ level }: { level: PitchLevel }) {
  const angles: Record<PitchLevel, string> = {
    [PitchLevel.LOW]: "M10 40 L50 30 L90 40",
    [PitchLevel.MEDIUM]: "M10 45 L50 15 L90 45",
    [PitchLevel.STEEP]: "M10 48 L50 5 L90 48",
  };
  return (
    <svg viewBox="0 0 100 55" className="w-16 h-10" aria-hidden="true">
      <polyline
        points={angles[level].replace(/M|L/g, "").replace(/(\d+) (\d+)/g, "$1,$2 ").trim()}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RoofSVG({ level }: { level: PitchLevel }) {
  if (level === PitchLevel.LOW) {
    return (
      <svg viewBox="0 0 100 55" className="w-16 h-10" aria-hidden="true">
        <polyline points="10,40 50,30 90,40" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="10" y1="40" x2="90" y2="40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }
  if (level === PitchLevel.MEDIUM) {
    return (
      <svg viewBox="0 0 100 55" className="w-16 h-10" aria-hidden="true">
        <polyline points="10,45 50,15 90,45" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="10" y1="45" x2="90" y2="45" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 100 55" className="w-16 h-10" aria-hidden="true">
      <polyline points="10,48 50,5 90,48" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="10" y1="48" x2="90" y2="48" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function PitchStep() {
  const { pitchLevel, setPitch, nextStep, prevStep } = useEstimatorStore();
  const [selected, setSelected] = useState<PitchLevel | null>(pitchLevel);
  const [advancing, setAdvancing] = useState(false);

  const handleSelect = (level: PitchLevel, multiplier: number) => {
    if (advancing) return;
    setSelected(level);
    setPitch(level, multiplier);
    setAdvancing(true);
    setTimeout(() => {
      nextStep();
    }, 400);
  };

  return (
    <div className="space-y-5">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-primary">What is your roof pitch?</h2>
        <p className="text-sm text-muted-foreground">
          Select the option that best matches your roof angle.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {PITCH_OPTIONS.map((option) => {
          const isSelected = selected === option.level;
          return (
            <motion.button
              key={option.level}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => handleSelect(option.level, option.multiplier)}
              className={cn(
                "relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all text-left",
                isSelected
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border bg-white hover:border-secondary hover:shadow-sm"
              )}
            >
              {isSelected && (
                <CheckCircle2 className="absolute top-3 right-3 h-5 w-5 text-primary" />
              )}
              <div className={cn("transition-colors", isSelected ? "text-primary" : "text-secondary")}>
                <RoofSVG level={option.level} />
              </div>
              <div className="text-center">
                <div className="font-semibold text-sm text-foreground">{option.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{option.description}</div>
                <div className="text-xs text-muted-foreground mt-1 font-mono">{option.pitchRange}</div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <Button variant="outline" onClick={prevStep} className="w-full">
        Back
      </Button>
    </div>
  );
}
