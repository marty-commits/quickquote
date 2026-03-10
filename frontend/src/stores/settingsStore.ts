"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Settings, Tier } from "@/types";
import { DEFAULT_SETTINGS } from "@/lib/constants";

interface SettingsStore {
  settings: Settings;
  setPricePerSquare: (value: number) => void;
  setBelowPct: (value: number) => void;
  setAbovePct: (value: number) => void;
  setTiers: (tiers: Tier[]) => void;
  setFinancing: (financing: Partial<Settings["financing"]>) => void;
  setBranding: (branding: Partial<Settings["branding"]>) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      setPricePerSquare: (value) =>
        set((s) => ({
          settings: { ...s.settings, pricePerSquare: value },
        })),
      setBelowPct: (value) =>
        set((s) => ({ settings: { ...s.settings, belowPct: value } })),
      setAbovePct: (value) =>
        set((s) => ({ settings: { ...s.settings, abovePct: value } })),
      setTiers: (tiers) =>
        set((s) => ({ settings: { ...s.settings, tiers } })),
      setFinancing: (financing) =>
        set((s) => ({
          settings: {
            ...s.settings,
            financing: { ...s.settings.financing, ...financing },
          },
        })),
      setBranding: (branding) =>
        set((s) => ({
          settings: {
            ...s.settings,
            branding: { ...s.settings.branding, ...branding },
          },
        })),
      resetSettings: () => set({ settings: DEFAULT_SETTINGS }),
    }),
    {
      name: "ere-settings",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : ({} as Storage)
      ),
      skipHydration: true,
    }
  )
);
