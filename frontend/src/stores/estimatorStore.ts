"use client";

import { create } from "zustand";
import {
  EstimatorState,
  EstimatorStep,
  PitchLevel,
  LeadDetails,
  EstimateResult,
  Coordinates,
  GeoJSONPolygon,
} from "@/types";
import { DEFAULT_FOOTPRINT_SQFT } from "@/lib/constants";

const INITIAL_STATE: EstimatorState = {
  step: EstimatorStep.ADDRESS,
  address: "",
  coordinates: null,
  polygon: null,
  footprintSqft: DEFAULT_FOOTPRINT_SQFT,
  pitchLevel: null,
  pitchMultiplier: 1.25,
  details: {},
  estimate: null,
  contact: null,
};

interface EstimatorStore extends EstimatorState {
  setStep: (step: EstimatorStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  setAddress: (address: string, coordinates: Coordinates) => void;
  setFootprint: (polygon: GeoJSONPolygon | null, sqft: number) => void;
  setPitch: (level: PitchLevel, multiplier: number) => void;
  setDetails: (details: LeadDetails) => void;
  setEstimate: (estimate: EstimateResult) => void;
  setContact: (contact: { name: string; email: string; phone: string }) => void;
  reset: () => void;
}

export const useEstimatorStore = create<EstimatorStore>()((set) => ({
  ...INITIAL_STATE,
  setStep: (step) => set({ step }),
  nextStep: () =>
    set((s) => ({
      step: Math.min(s.step + 1, EstimatorStep.THANK_YOU) as EstimatorStep,
    })),
  prevStep: () =>
    set((s) => ({
      step: Math.max(s.step - 1, EstimatorStep.ADDRESS) as EstimatorStep,
    })),
  setAddress: (address, coordinates) => set({ address, coordinates }),
  setFootprint: (polygon, footprintSqft) => set({ polygon, footprintSqft }),
  setPitch: (pitchLevel, pitchMultiplier) => set({ pitchLevel, pitchMultiplier }),
  setDetails: (details) => set({ details }),
  setEstimate: (estimate) => set({ estimate }),
  setContact: (contact) => set({ contact }),
  reset: () => set(INITIAL_STATE),
}));
