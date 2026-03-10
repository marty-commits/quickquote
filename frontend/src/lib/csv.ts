import { Lead } from "@/types";
import { formatCurrency } from "./estimate";

function csvCell(value: string | number | undefined): string {
  const str = value === undefined || value === null ? "" : String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function leadsToCSV(leads: Lead[]): string {
  const headers = [
    "Date",
    "Name",
    "Email",
    "Phone",
    "Address",
    "Roof Sqft",
    "Estimate Low",
    "Estimate High",
    "Tier",
    "Pitch",
    "Roof Age",
    "Material",
    "Damage",
  ];

  const rows = leads.map((lead) => [
    new Date(lead.createdAt).toLocaleDateString(),
    lead.name,
    lead.email,
    lead.phone,
    lead.address,
    Math.round(lead.roofSqft),
    formatCurrency(lead.estimateLow),
    formatCurrency(lead.estimateHigh),
    lead.tierName,
    lead.pitchLevel,
    lead.details.roofAge ?? "",
    lead.details.material ?? "",
    lead.details.damage ?? "",
  ]);

  const lines = [headers, ...rows].map((row) =>
    row.map(csvCell).join(",")
  );
  return lines.join("\n");
}
