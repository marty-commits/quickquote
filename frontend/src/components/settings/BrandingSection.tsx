"use client";

import { useRef, useState } from "react";
import { Upload, AlertTriangle } from "lucide-react";
import { useSettingsStore } from "@/stores/settingsStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MAX_LOGO_SIZE = 200 * 1024; // 200KB

export function BrandingSection() {
  const { settings, setBranding } = useSettingsStore();
  const { branding } = settings;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoWarning, setLogoWarning] = useState(false);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoWarning(file.size > MAX_LOGO_SIZE);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string;
      setBranding({ logo: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setBranding({ logo: "" });
    setLogoWarning(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Card className="p-6 space-y-5">
      <div>
        <h2 className="text-base font-semibold text-primary">Branding</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Customize how your company appears in the estimator.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="companyName">Company name</Label>
          <Input
            id="companyName"
            value={branding.companyName}
            onChange={(e) => setBranding({ companyName: e.target.value })}
            placeholder="Your Company Name"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="tagline">Tagline</Label>
          <Input
            id="tagline"
            value={branding.tagline}
            onChange={(e) => setBranding({ tagline: e.target.value })}
            placeholder="Roofing you can trust"
          />
        </div>

        <div className="space-y-2">
          <Label>Company logo</Label>
          {branding.logo ? (
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={branding.logo}
                alt="Company logo"
                className="h-16 w-auto max-w-[200px] object-contain border border-border rounded-lg p-2"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={removeLogo}
                className="text-destructive border-destructive hover:bg-destructive/10"
              >
                Remove
              </Button>
            </div>
          ) : (
            <div
              className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-secondary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-6 w-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Click to upload logo (PNG, JPG, SVG)
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLogoUpload}
          />

          {logoWarning && (
            <div className="flex items-center gap-2 text-amber-700 text-sm">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              Logo is over 200KB which may affect performance.
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
