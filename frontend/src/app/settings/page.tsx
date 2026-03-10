import { PricingSection } from "@/components/settings/PricingSection";
import { FinancingSection } from "@/components/settings/FinancingSection";
import { BrandingSection } from "@/components/settings/BrandingSection";

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-primary">Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Configure pricing, financing, and branding for your estimator.
        </p>
      </div>
      <PricingSection />
      <FinancingSection />
      <BrandingSection />
    </div>
  );
}
