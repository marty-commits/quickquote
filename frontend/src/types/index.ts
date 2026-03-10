export enum PitchLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  STEEP = "STEEP",
}

export enum RoofMaterial {
  ASPHALT = "Asphalt Shingles",
  METAL = "Metal",
  TILE = "Tile",
  CEDAR = "Cedar",
}

export enum RoofAge {
  UNDER_5 = "Under 5 years",
  FIVE_TO_TEN = "5–10 years",
  TEN_TO_TWENTY = "10–20 years",
  OVER_TWENTY = "20+ years",
}

export enum DamageLevel {
  NONE = "None",
  MINOR = "Minor",
  SIGNIFICANT = "Significant",
}

export interface Tier {
  id: string;
  name: string;
}

export interface TierEstimate {
  tier: Tier;
  low: number;
  mid: number;
  high: number;
  monthlyPayment?: number;
}

export interface EstimateResult {
  roofSqft: number;
  tiers: TierEstimate[];
}

export interface FinancingSettings {
  enabled: boolean;
  annualRatePct: number;
  terms: number[];
}

export interface BrandingSettings {
  companyName: string;
  tagline: string;
  logo: string;
}

export interface Settings {
  pricePerSquare: number;
  belowPct: number;
  abovePct: number;
  tiers: Tier[];
  financing: FinancingSettings;
  branding: BrandingSettings;
}

export interface LeadDetails {
  roofAge?: RoofAge;
  material?: RoofMaterial;
  damage?: DamageLevel;
}

export interface Lead {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  footprintSqft: number;
  roofSqft: number;
  pitchLevel: PitchLevel;
  details: LeadDetails;
  estimateLow: number;
  estimateHigh: number;
  tierName: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface FootprintResponse {
  polygon: GeoJSONPolygon | null;
  areaSqft: number | null;
}

export interface GeoJSONPolygon {
  type: "Polygon";
  coordinates: number[][][];
}

export interface EstimatorState {
  step: EstimatorStep;
  address: string;
  coordinates: Coordinates | null;
  polygon: GeoJSONPolygon | null;
  footprintSqft: number;
  pitchLevel: PitchLevel | null;
  pitchMultiplier: number;
  details: LeadDetails;
  estimate: EstimateResult | null;
  contact: { name: string; email: string; phone: string } | null;
}

export enum EstimatorStep {
  ADDRESS = 0,
  PITCH = 1,
  DETAILS = 2,
  ESTIMATE = 3,
  CONTACT = 4,
  THANK_YOU = 5,
}
