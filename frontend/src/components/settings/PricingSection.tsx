"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useSettingsStore } from "@/stores/settingsStore";
import { Tier } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function PricingSection() {
  const { settings, setPricePerSquare, setBelowPct, setAbovePct, setTiers } =
    useSettingsStore();
  const { pricePerSquare, belowPct, abovePct, tiers } = settings;

  const addTier = () => {
    if (tiers.length >= 3) return;
    setTiers([
      ...tiers,
      { id: crypto.randomUUID(), name: `Option ${tiers.length + 1}` },
    ]);
  };

  const removeTier = (id: string) => {
    if (tiers.length <= 1) return;
    setTiers(tiers.filter((t) => t.id !== id));
  };

  const updateTierName = (id: string, name: string) => {
    setTiers(tiers.map((t) => (t.id === id ? { ...t, name } : t)));
  };

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h2 className="text-base font-semibold text-primary">Pricing</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Set your base price per roofing square (100 sq ft).
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="pricePerSquare">Price per square ($)</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
            <Input
              id="pricePerSquare"
              type="number"
              min={0}
              step={10}
              value={pricePerSquare}
              onChange={(e) => setPricePerSquare(Number(e.target.value))}
              className="pl-7"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="belowPct">Range below (%)</Label>
          <div className="relative">
            <Input
              id="belowPct"
              type="number"
              min={0}
              max={50}
              step={1}
              value={belowPct}
              onChange={(e) => setBelowPct(Number(e.target.value))}
              className="pr-7"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="abovePct">Range above (%)</Label>
          <div className="relative">
            <Input
              id="abovePct"
              type="number"
              min={0}
              max={50}
              step={1}
              value={abovePct}
              onChange={(e) => setAbovePct(Number(e.target.value))}
              className="pr-7"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Estimate tiers (Good / Better / Best)</Label>
          {tiers.length < 3 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addTier}
              className="gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              Add tier
            </Button>
          )}
        </div>
        <div className="space-y-2">
          {tiers.map((tier) => (
            <div key={tier.id} className="flex gap-2">
              <Input
                value={tier.name}
                onChange={(e) => updateTierName(tier.id, e.target.value)}
                placeholder="Tier name"
              />
              {tiers.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTier(tier.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
