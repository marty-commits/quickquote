"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Lead } from "@/types";

interface LeadsStore {
  leads: Lead[];
  addLead: (lead: Lead) => void;
  deleteLead: (id: string) => void;
  clearLeads: () => void;
}

export const useLeadsStore = create<LeadsStore>()(
  persist(
    (set) => ({
      leads: [],
      addLead: (lead) => set((s) => ({ leads: [lead, ...s.leads] })),
      deleteLead: (id) =>
        set((s) => ({ leads: s.leads.filter((l) => l.id !== id) })),
      clearLeads: () => set({ leads: [] }),
    }),
    {
      name: "ere-leads",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : ({} as Storage)
      ),
      skipHydration: true,
    }
  )
);
