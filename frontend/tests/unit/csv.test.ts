import { describe, it, expect } from "vitest";
import { leadsToCSV } from "@/lib/csv";
import { Lead, PitchLevel, RoofAge, RoofMaterial, DamageLevel } from "@/types";

const mockLead: Lead = {
  id: "1",
  createdAt: "2026-01-15T12:00:00.000Z",
  name: "John Smith",
  email: "john@example.com",
  phone: "555-123-4567",
  address: "123 Main St, Columbus, OH 43215",
  footprintSqft: 1800,
  roofSqft: 2250,
  pitchLevel: PitchLevel.MEDIUM,
  details: {
    roofAge: RoofAge.TEN_TO_TWENTY,
    material: RoofMaterial.ASPHALT,
    damage: DamageLevel.NONE,
  },
  estimateLow: 9000,
  estimateHigh: 12000,
  tierName: "Standard",
};

describe("leadsToCSV", () => {
  it("includes a header row as the first line", () => {
    const csv = leadsToCSV([mockLead]);
    const lines = csv.split("\n");
    expect(lines[0]).toContain("Name");
    expect(lines[0]).toContain("Email");
    expect(lines[0]).toContain("Address");
    expect(lines[0]).toContain("Estimate Low");
  });

  it("produces correct number of lines for given leads", () => {
    const csv = leadsToCSV([mockLead]);
    const lines = csv.split("\n");
    expect(lines).toHaveLength(2); // header + 1 data row
  });

  it("includes lead data in the correct columns", () => {
    const csv = leadsToCSV([mockLead]);
    expect(csv).toContain("John Smith");
    expect(csv).toContain("john@example.com");
    expect(csv).toContain("Standard");
  });

  it("wraps values containing commas in double quotes", () => {
    const leadWithComma: Lead = {
      ...mockLead,
      address: "123 Main St, Columbus, OH",
    };
    const csv = leadsToCSV([leadWithComma]);
    expect(csv).toContain('"123 Main St, Columbus, OH"');
  });

  it("returns only a header row for empty leads array", () => {
    const csv = leadsToCSV([]);
    const lines = csv.split("\n");
    expect(lines).toHaveLength(1);
    expect(lines[0]).toContain("Name");
  });

  it("formats currency values for estimate fields", () => {
    const csv = leadsToCSV([mockLead]);
    expect(csv).toContain("$9,000");
    expect(csv).toContain("$12,000");
  });
});
