import { LeadsTable } from "@/components/reporting/LeadsTable";
import { ExportButton } from "@/components/reporting/ExportButton";

export default function ReportingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary">Leads</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Customer estimates submitted through the estimator.
          </p>
        </div>
        <ExportButton />
      </div>
      <LeadsTable />
    </div>
  );
}
