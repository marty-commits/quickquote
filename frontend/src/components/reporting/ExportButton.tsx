"use client";

import { Download } from "lucide-react";
import { useLeadsStore } from "@/stores/leadsStore";
import { leadsToCSV } from "@/lib/csv";
import { Button } from "@/components/ui/button";

export function ExportButton() {
  const { leads } = useLeadsStore();

  const handleExport = () => {
    if (leads.length === 0) return;

    const csv = leadsToCSV(leads);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      disabled={leads.length === 0}
      className="gap-2"
    >
      <Download className="h-4 w-4" />
      Export CSV
    </Button>
  );
}
