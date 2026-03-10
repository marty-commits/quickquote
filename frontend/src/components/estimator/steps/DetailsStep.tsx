"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEstimatorStore } from "@/stores/estimatorStore";
import { RoofAge, RoofMaterial, DamageLevel } from "@/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const schema = z.object({
  roofAge: z.nativeEnum(RoofAge).optional(),
  material: z.nativeEnum(RoofMaterial).optional(),
  damage: z.nativeEnum(DamageLevel).optional(),
});

type FormData = z.infer<typeof schema>;

export function DetailsStep() {
  const { details, setDetails, nextStep, prevStep } = useEstimatorStore();

  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: details,
  });

  const onSubmit = (data: FormData) => {
    setDetails(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-primary">A few more details</h2>
        <p className="text-sm text-muted-foreground">
          Optional — helps us provide a more accurate estimate.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="roofAge">Current roof age</Label>
          <select
            id="roofAge"
            {...register("roofAge")}
            className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Select age (optional)</option>
            {Object.values(RoofAge).map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="material">Current roofing material</Label>
          <select
            id="material"
            {...register("material")}
            className="w-full border border-input rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Select material (optional)</option>
            {Object.values(RoofMaterial).map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label>Existing damage</Label>
          <div className="grid grid-cols-3 gap-2">
            {Object.values(DamageLevel).map((v) => (
              <label
                key={v}
                className="flex items-center gap-2 p-3 border border-input rounded-lg cursor-pointer hover:bg-accent transition-colors text-sm"
              >
                <input
                  type="radio"
                  value={v}
                  {...register("damage")}
                  className="accent-primary"
                />
                {v}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
          Back
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => { setDetails({}); nextStep(); }}
          className="flex-1 text-muted-foreground"
        >
          Skip
        </Button>
        <Button type="submit" className="flex-1 bg-cta hover:bg-cta-hover text-white">
          Continue
        </Button>
      </div>
    </form>
  );
}
