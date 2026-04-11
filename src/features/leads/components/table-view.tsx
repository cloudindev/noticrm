"use client";

import React from "react";
import { SerializedLead } from "./leads-client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Building, Target } from "lucide-react";
import { useRouter } from "next/navigation";

interface TableViewProps {
  leads: SerializedLead[];
  tenantSlug: string;
}

const stageNames: Record<string, string> = {
  PROSPECTING: "Prospección",
  QUALIFIED: "Cualificada",
  PROPOSAL: "Propuesta enviada",
  NEGOTIATION: "Negociación",
  CLOSED: "Cerrada",
};

export function TableView({ leads, tenantSlug }: TableViewProps) {
  const router = useRouter();

  return (
    <div className="h-full w-full bg-background overflow-auto">
      <Table>
        <TableHeader className="bg-muted/10 sticky top-0 z-10 border-b border-border/40">
          <TableRow className="border-none hover:bg-transparent">
            <TableHead className="w-[300px] h-9 text-xs font-semibold pl-6">OPORTUNIDAD</TableHead>
            <TableHead className="h-9 text-xs font-semibold">EMPRESA</TableHead>
            <TableHead className="h-9 text-xs font-semibold">FASE</TableHead>
            <TableHead className="h-9 text-xs font-semibold">VALOR</TableHead>
            <TableHead className="h-9 text-xs font-semibold">CIERRE PREVISTO</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow 
              key={lead.id} 
              className="cursor-pointer border-border/30 hover:bg-muted/30 transition-colors"
              onClick={() => router.push(`/${tenantSlug}/leads/${lead.id}`)}
            >
              <TableCell className="font-medium pl-6 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-100 text-orange-600 shadow-sm border border-orange-200/50">
                    <Target size={14} />
                  </div>
                  <span className="font-semibold text-[13px]">{lead.name}</span>
                </div>
              </TableCell>
              
              <TableCell className="py-3">
                {lead.companyName ? (
                   <div className="flex items-center gap-2">
                     <div className="h-5 w-5 rounded border border-border/50 bg-muted/50 flex items-center justify-center overflow-hidden">
                        {lead.companyLogoUrl ? (
                          <img src={lead.companyLogoUrl} className="h-full w-full object-cover" alt="" />
                        ) : (
                          <Building size={10} className="text-muted-foreground" />
                        )}
                     </div>
                     <span className="text-xs">{lead.companyName}</span>
                   </div>
                ) : <span className="text-xs text-muted-foreground">-</span>}
              </TableCell>

              <TableCell className="py-3">
                <div className="inline-flex items-center px-2 py-1 rounded bg-muted/50 border border-border/40 text-[11px] font-medium text-muted-foreground">
                  {stageNames[lead.status] || lead.status}
                </div>
              </TableCell>

              <TableCell className="py-3">
                <span className="text-[13px] font-medium text-muted-foreground">
                  {lead.value ? `$${lead.value.toLocaleString()}` : "-"}
                </span>
              </TableCell>
              
              <TableCell className="py-3 pr-6">
                <span className="text-[13px] text-muted-foreground">
                  {lead.dueDate ? format(new Date(lead.dueDate), "MMM d, yyyy", { locale: es }) : "-"}
                </span>
              </TableCell>
            </TableRow>
          ))}
          
          {leads.length === 0 && (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                No hay oportunidades registradas.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
