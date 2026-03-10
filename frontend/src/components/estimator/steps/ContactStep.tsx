"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Mail, Phone } from "lucide-react";
import { useEstimatorStore } from "@/stores/estimatorStore";
import { useLeadsStore } from "@/stores/leadsStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lead } from "@/types";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a valid phone number"),
});

type FormData = z.infer<typeof schema>;

export function ContactStep() {
  const store = useEstimatorStore();
  const { addLead } = useLeadsStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    const tierEst = store.estimate?.tiers[0];
    const lead: Lead = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: store.address,
      footprintSqft: store.footprintSqft,
      roofSqft: store.estimate?.roofSqft ?? store.footprintSqft * store.pitchMultiplier,
      pitchLevel: store.pitchLevel!,
      details: store.details,
      estimateLow: tierEst?.low ?? 0,
      estimateHigh: tierEst?.high ?? 0,
      tierName: tierEst?.tier.name ?? "Standard",
    };

    store.setContact(data);
    addLead(lead);
    store.nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-primary">Get your free professional quote</h2>
        <p className="text-sm text-muted-foreground">
          A roofing expert will reach out within 24 hours with a detailed estimate.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="name"
              placeholder="Jane Smith"
              className="pl-9"
              {...register("name")}
            />
          </div>
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Email address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="jane@example.com"
              className="pl-9"
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              placeholder="(555) 123-4567"
              className="pl-9"
              {...register("phone")}
            />
          </div>
          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={store.prevStep}
          className="flex-1"
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-cta hover:bg-cta-hover text-white font-semibold"
          disabled={isSubmitting}
        >
          Submit
        </Button>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        No spam. Your contact info is only shared with the roofing professional handling your quote.
      </p>
    </form>
  );
}
