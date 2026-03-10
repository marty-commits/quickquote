import { PitchLevel, Settings } from "@/types";

export interface PitchOption {
  level: PitchLevel;
  label: string;
  description: string;
  pitchRange: string;
  multiplier: number;
}

export const PITCH_OPTIONS: PitchOption[] = [
  {
    level: PitchLevel.LOW,
    label: "Gentle Slope",
    description: "Flat or nearly flat roof",
    pitchRange: "2/12 – 4/12",
    multiplier: 1.0541,
  },
  {
    level: PitchLevel.MEDIUM,
    label: "Moderate Pitch",
    description: "Most common residential roof",
    pitchRange: "4/12 – 8/12",
    multiplier: 1.1577,
  },
  {
    level: PitchLevel.STEEP,
    label: "Steep Pitch",
    description: "Very steep, dramatic angle",
    pitchRange: "8/12+",
    multiplier: 1.4142,
  },
];

export const DEFAULT_SETTINGS: Settings = {
  pricePerSquare: 450,
  belowPct: 10,
  abovePct: 15,
  tiers: [{ id: "standard", name: "Standard" }],
  financing: {
    enabled: false,
    annualRatePct: 8.9,
    terms: [60, 120, 180],
  },
  branding: {
    companyName: "Easy Roof Estimate",
    tagline: "Get your free estimate in minutes",
    logo: "",
  },
};

export const DEFAULT_FOOTPRINT_SQFT = 1500;
