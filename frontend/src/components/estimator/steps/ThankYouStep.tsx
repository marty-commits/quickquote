"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useEstimatorStore } from "@/stores/estimatorStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { Button } from "@/components/ui/button";

export function ThankYouStep() {
  const { reset } = useEstimatorStore();
  const { settings } = useSettingsStore();
  const { companyName, tagline, logo } = settings.branding;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center text-center space-y-6 py-4"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center"
      >
        <CheckCircle2 className="h-10 w-10 text-green-600" />
      </motion.div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-primary">You are all set!</h2>
        <p className="text-muted-foreground">
          We will be in touch within 24 hours with your detailed, professional quote.
        </p>
      </div>

      {logo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo} alt={companyName} className="h-12 object-contain" />
      )}

      <div className="space-y-1">
        <div className="font-semibold text-primary text-lg">{companyName}</div>
        {tagline && (
          <div className="text-sm text-muted-foreground">{tagline}</div>
        )}
      </div>

      <Button
        variant="outline"
        onClick={reset}
        className="mt-4"
      >
        Start a new estimate
      </Button>
    </motion.div>
  );
}
