"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEstimatorStore } from "@/stores/estimatorStore";
import { EstimatorStep } from "@/types";
import { StepIndicator } from "./StepIndicator";
import { AddressStep } from "./steps/AddressStep";
import { PitchStep } from "./steps/PitchStep";
import { DetailsStep } from "./steps/DetailsStep";
import { EstimateStep } from "./steps/EstimateStep";
import { ContactStep } from "./steps/ContactStep";
import { ThankYouStep } from "./steps/ThankYouStep";

const stepComponents: Record<EstimatorStep, React.ComponentType> = {
  [EstimatorStep.ADDRESS]: AddressStep,
  [EstimatorStep.PITCH]: PitchStep,
  [EstimatorStep.DETAILS]: DetailsStep,
  [EstimatorStep.ESTIMATE]: EstimateStep,
  [EstimatorStep.CONTACT]: ContactStep,
  [EstimatorStep.THANK_YOU]: ThankYouStep,
};

const variants = {
  initial: { x: 60, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -60, opacity: 0 },
};

export function EstimatorWizard() {
  const { step } = useEstimatorStore();
  const StepComponent = stepComponents[step];

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-8">
      <StepIndicator step={step} />

      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.22, ease: "easeInOut" }}
          >
            <StepComponent />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
