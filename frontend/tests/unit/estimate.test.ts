import { describe, it, expect } from "vitest";
import { calcEstimate, calcMonthlyPayment } from "@/lib/estimate";
import { Tier } from "@/types";

const tier: Tier = { id: "standard", name: "Standard" };
const noFinancing = { enabled: false, annualRatePct: 8.9, terms: [60] };
const withFinancing = { enabled: true, annualRatePct: 6.0, terms: [120] };

describe("calcEstimate", () => {
  it("calculates roofSqft from footprint and pitch multiplier", () => {
    const result = calcEstimate(2000, 1.25, 450, 10, 15, [tier], noFinancing);
    expect(result.roofSqft).toBe(2500);
  });

  it("calculates correct mid estimate", () => {
    // footprint=2000, pitch=1.25 → roofSqft=2500, squares=25
    // base = 25 * 450 = 11250
    // low = 11250 * 0.9 = 10125
    // high = 11250 * 1.15 = 12937.5
    // mid = (10125 + 12937.5) / 2 = 11531.25
    const result = calcEstimate(2000, 1.25, 450, 10, 15, [tier], noFinancing);
    expect(result.tiers[0].low).toBeCloseTo(10125);
    expect(result.tiers[0].high).toBeCloseTo(12937.5);
    expect(result.tiers[0].mid).toBeCloseTo(11531.25);
  });

  it("applies below and above percentages correctly", () => {
    const result = calcEstimate(1000, 1.0, 500, 5, 20, [tier], noFinancing);
    // roofSqft=1000, squares=10, base=5000
    // low = 5000 * 0.95 = 4750, high = 5000 * 1.20 = 6000
    expect(result.tiers[0].low).toBeCloseTo(4750);
    expect(result.tiers[0].high).toBeCloseTo(6000);
  });

  it("adds 10% per additional tier", () => {
    const tiers: Tier[] = [
      { id: "good", name: "Good" },
      { id: "better", name: "Better" },
      { id: "best", name: "Best" },
    ];
    const result = calcEstimate(1000, 1.0, 400, 0, 0, tiers, noFinancing);
    // base = 10 squares * 400 = 4000, no range → low=high=mid=4000
    expect(result.tiers[0].mid).toBeCloseTo(4000);
    expect(result.tiers[1].mid).toBeCloseTo(4400);
    expect(result.tiers[2].mid).toBeCloseTo(4800);
  });

  it("includes monthly payment when financing enabled", () => {
    const result = calcEstimate(1000, 1.0, 400, 0, 0, [tier], withFinancing);
    expect(result.tiers[0].monthlyPayment).toBeDefined();
    expect(result.tiers[0].monthlyPayment).toBeGreaterThan(0);
  });

  it("omits monthly payment when financing disabled", () => {
    const result = calcEstimate(1000, 1.0, 400, 0, 0, [tier], noFinancing);
    expect(result.tiers[0].monthlyPayment).toBeUndefined();
  });
});

describe("calcMonthlyPayment", () => {
  it("returns principal/term for 0% rate", () => {
    expect(calcMonthlyPayment(12000, 0, 120)).toBeCloseTo(100);
  });

  it("calculates standard amortization", () => {
    // $10,000 at 6% APR for 120 months ≈ $111.02/month
    expect(calcMonthlyPayment(10000, 6.0, 120)).toBeCloseTo(111.02, 1);
  });

  it("returns a positive number", () => {
    expect(calcMonthlyPayment(5000, 8.9, 60)).toBeGreaterThan(0);
  });
});
