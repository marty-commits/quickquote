"use client";

import { useEffect } from "react";
import { useSettingsStore } from "@/stores/settingsStore";
import { useLeadsStore } from "@/stores/leadsStore";

export function StoreHydration() {
  useEffect(() => {
    useSettingsStore.persist.rehydrate();
    useLeadsStore.persist.rehydrate();
  }, []);

  return null;
}
