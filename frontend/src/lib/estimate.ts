import { EstimateResult, FinancingSettings, Tier, TierEstimate } from "@/types";

export function calcEstimate(
  footprintSqft: number,
  pitchMultiplier: number,
  pricePerSquare: number,
  belowPct: number,
  abovePct: number,
  tiers: Tier[],
  financing: FinancingSettings
): EstimateResult {
  const roofSqft = footprintSqft * pitchMultiplier;
  const squares = roofSqft / 100;
  const base = squares * pricePerSquare;
  const low = base * (1 - belowPct / 100);
  const high = base * (1 + abovePct / 100);
  const mid = (low + high) / 2;

  const tierEstimates: TierEstimate[] = tiers.map((tier, i) => {
    // Each successive tier adds 10% to the base estimate
    const tierFactor = 1 + i * 0.1;
    const tLow = low * tierFactor;
    const tMid = mid * tierFactor;
    const tHigh = high * tierFactor;

    let monthlyPayment: number | undefined;
    if (financing.enabled && financing.terms.length > 0) {
      const term = financing.terms[0];
      monthlyPayment = calcMonthlyPayment(tMid, financing.annualRatePct, term);
    }

    return { tier, low: tLow, mid: tMid, high: tHigh, monthlyPayment };
  });

  return { roofSqft, tiers: tierEstimates };
}

export function calcMonthlyPayment(
  principal: number,
  annualRatePct: number,
  termMonths: number
): number {
  const monthlyRate = annualRatePct / 100 / 12;
  if (monthlyRate === 0) return principal / termMonths;
  const payment =
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths))) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);
  return Math.round(payment * 100) / 100;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
