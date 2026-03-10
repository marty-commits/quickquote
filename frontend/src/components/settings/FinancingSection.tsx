"use client";

import { useSettingsStore } from "@/stores/settingsStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";

const TERM_OPTIONS = [36, 60, 120, 180, 240];

export function FinancingSection() {
  const { settings, setFinancing } = useSettingsStore();
  const { financing } = settings;

  const toggleTerm = (term: number) => {
    const terms = financing.terms.includes(term)
      ? financing.terms.filter((t) => t !== term)
      : [...financing.terms, term].sort((a, b) => a - b);
    setFinancing({ terms });
  };

  return (
    <Card className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-primary">Financing</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Show monthly payment options on the estimate.
          </p>
        </div>
        <Switch
          checked={financing.enabled}
          onCheckedChange={(checked) => setFinancing({ enabled: checked })}
        />
      </div>

      {financing.enabled && (
        <div className="space-y-4 pt-2 border-t border-border">
          <div className="space-y-1.5">
            <Label htmlFor="annualRate">Annual interest rate (%)</Label>
            <div className="relative max-w-xs">
              <Input
                id="annualRate"
                type="number"
                min={0}
                max={30}
                step={0.1}
                value={financing.annualRatePct}
                onChange={(e) => setFinancing({ annualRatePct: Number(e.target.value) })}
                className="pr-7"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Loan term options (months)</Label>
            <div className="flex flex-wrap gap-2">
              {TERM_OPTIONS.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => toggleTerm(term)}
                  className={`px-3 py-1.5 rounded-md border text-sm transition-colors ${
                    financing.terms.includes(term)
                      ? "bg-primary text-white border-primary"
                      : "bg-white border-border hover:border-secondary"
                  }`}
                >
                  {term} mo
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
