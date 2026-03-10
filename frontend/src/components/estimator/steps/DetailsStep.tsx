"use client";

import { useState } from "react";
import { useEstimatorStore } from "@/stores/estimatorStore";
import { RoofAge, RoofMaterial, DamageLevel } from "@/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const AGE_OPTIONS: { value: RoofAge; label: string }[] = [
  { value: RoofAge.UNDER_5, label: "Under 5 yrs" },
  { value: RoofAge.FIVE_TO_TEN, label: "5–10 yrs" },
  { value: RoofAge.TEN_TO_TWENTY, label: "10–20 yrs" },
  { value: RoofAge.OVER_TWENTY, label: "20+ yrs" },
];

// Place roof material images at /public/materials/*.jpg to replace gradient fallbacks
const MATERIAL_OPTIONS: { value: RoofMaterial; label: string; image: string; fallback: string }[] = [
  {
    value: RoofMaterial.ASPHALT,
    label: "Asphalt Shingles",
    image: "/materials/asphalt.jpg",
    fallback: "linear-gradient(135deg, #374151 0%, #1f2937 100%)",
  },
  {
    value: RoofMaterial.METAL,
    label: "Metal",
    image: "/materials/metal.jpg",
    fallback: "linear-gradient(135deg, #9ca3af 0%, #4b5563 100%)",
  },
  {
    value: RoofMaterial.TILE,
    label: "Tile",
    image: "/materials/tile.jpg",
    fallback: "linear-gradient(135deg, #c2410c 0%, #7c2d12 100%)",
  },
  {
    value: RoofMaterial.CEDAR,
    label: "Cedar",
    image: "/materials/cedar.jpg",
    fallback: "linear-gradient(135deg, #92400e 0%, #451a03 100%)",
  },
];

const DAMAGE_OPTIONS: { value: DamageLevel; label: string }[] = [
  { value: DamageLevel.NONE, label: "None" },
  { value: DamageLevel.MINOR, label: "Minor" },
  { value: DamageLevel.SIGNIFICANT, label: "Significant" },
];

export function DetailsStep() {
  const { details, setDetails, nextStep, prevStep } = useEstimatorStore();

  const [roofAge, setRoofAge] = useState<RoofAge | undefined>(details.roofAge);
  const [material, setMaterial] = useState<RoofMaterial | undefined>(details.material);
  const [damage, setDamage] = useState<DamageLevel | undefined>(details.damage);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const handleContinue = () => {
    setDetails({ roofAge, material, damage });
    nextStep();
  };

  const handleSkip = () => {
    setDetails({});
    nextStep();
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-primary">A few more details</h2>
        <p className="text-sm text-muted-foreground">
          Optional — helps us provide a more accurate estimate.
        </p>
      </div>

      <div className="space-y-5">
        {/* Roof Age */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Current roof age</p>
          <div className="grid grid-cols-4 gap-2">
            {AGE_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setRoofAge(roofAge === value ? undefined : value)}
                className={cn(
                  "py-2.5 px-1 rounded-lg border text-sm font-medium transition-all",
                  roofAge === value
                    ? "border-primary bg-primary text-white shadow-sm"
                    : "border-input bg-white text-foreground hover:border-primary/50 hover:bg-accent"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Roofing Material */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Current roofing material</p>
          <div className="grid grid-cols-2 gap-2">
            {MATERIAL_OPTIONS.map(({ value, label, image, fallback }) => {
              const hasError = imgErrors[value];
              const selected = material === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setMaterial(material === value ? undefined : value)}
                  className={cn(
                    "relative h-20 rounded-xl overflow-hidden border-2 transition-all",
                    selected ? "border-white ring-2 ring-primary shadow-lg scale-[1.02]" : "border-transparent hover:border-white/50"
                  )}
                  style={{
                    background: hasError ? fallback : undefined,
                  }}
                >
                  {!hasError && (
                    <img
                      src={image}
                      alt={label}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={() => setImgErrors((e) => ({ ...e, [value]: true }))}
                    />
                  )}
                  {/* Dark overlay */}
                  <div className={cn(
                    "absolute inset-0 transition-opacity",
                    selected ? "bg-black/30" : "bg-black/45"
                  )} />
                  <span className="relative z-10 flex items-center justify-center h-full text-sm font-semibold text-white drop-shadow-md">
                    {label}
                  </span>
                  {selected && (
                    <span className="absolute top-1.5 right-1.5 z-10 flex items-center justify-center w-5 h-5 rounded-full bg-primary border-2 border-white">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Existing Damage */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">Existing damage</p>
          <div className="grid grid-cols-3 gap-2">
            {DAMAGE_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setDamage(damage === value ? undefined : value)}
                className={cn(
                  "py-2.5 rounded-lg border text-sm font-medium transition-all",
                  damage === value
                    ? "border-primary bg-primary text-white shadow-sm"
                    : "border-input bg-white text-foreground hover:border-primary/50 hover:bg-accent"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
          Back
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={handleSkip}
          className="flex-1 text-muted-foreground"
        >
          Skip
        </Button>
        <Button
          type="button"
          onClick={handleContinue}
          className="flex-1 bg-cta hover:bg-cta-hover text-white"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
