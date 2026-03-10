"use client";

import { Trash2, Inbox } from "lucide-react";
import { useLeadsStore } from "@/stores/leadsStore";
import { formatCurrency } from "@/lib/estimate";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function LeadsTable() {
  const { leads, deleteLead } = useLeadsStore();

  const handleDelete = (id: string) => {
    if (!window.confirm("Remove this lead?")) return;
    deleteLead(id);
  };

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground gap-3">
        <Inbox className="h-10 w-10 opacity-40" />
        <p className="text-sm">No leads yet. Estimates submitted by visitors will appear here.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border overflow-auto shadow-sm bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead className="whitespace-nowrap">Date</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="hidden md:table-cell">Email</TableHead>
            <TableHead className="hidden lg:table-cell">Phone</TableHead>
            <TableHead className="hidden xl:table-cell">Address</TableHead>
            <TableHead className="whitespace-nowrap">Estimate</TableHead>
            <TableHead className="hidden sm:table-cell">Tier</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead.id} className="hover:bg-muted/20">
              <TableCell className="text-sm whitespace-nowrap text-muted-foreground">
                {new Date(lead.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell className="font-medium text-sm">{lead.name}</TableCell>
              <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                {lead.email}
              </TableCell>
              <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                {lead.phone}
              </TableCell>
              <TableCell className="hidden xl:table-cell text-sm text-muted-foreground max-w-[200px] truncate">
                {lead.address}
              </TableCell>
              <TableCell className="text-sm whitespace-nowrap">
                {formatCurrency(lead.estimateLow)}
                <span className="text-muted-foreground mx-1">–</span>
                {formatCurrency(lead.estimateHigh)}
              </TableCell>
              <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                {lead.tierName}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Delete lead"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => handleDelete(lead.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
