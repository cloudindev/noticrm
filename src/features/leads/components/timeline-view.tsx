"use client";

import React from "react";
import { SerializedLead } from "./leads-client";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Building, Target } from "lucide-react";
import { useRouter } from "next/navigation";

interface TimelineViewProps {
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

export function TimelineView({ leads, tenantSlug }: TimelineViewProps) {
  const router = useRouter();

  // Sort chronologically
  const sortedLeads = [...leads].sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  // Group by "Month Year"
  const groupedLeads: Record<string, SerializedLead[]> = {};
  
  sortedLeads.forEach(lead => {
    const key = lead.dueDate 
      ? format(new Date(lead.dueDate), "MMMM yyyy", { locale: es })
      : "Sin fecha definida";
    
    if (!groupedLeads[key]) {
      groupedLeads[key] = [];
    }
    groupedLeads[key].push(lead);
  });

  return (
    <div className="h-full w-full bg-background overflow-auto p-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {Object.entries(groupedLeads).map(([month, monthLeads]) => (
          <div key={month} className="relative">
            <h3 className="sticky top-0 z-10 bg-background/95 backdrop-blur py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground border-b border-border/40 mb-4">
              {month}
            </h3>
            
            <div className="space-y-3">
              {monthLeads.map((lead) => (
                <div 
                  key={lead.id}
                  onClick={() => router.push(`/${tenantSlug}/leads/${lead.id}`)}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border/40 bg-card hover:bg-muted/30 hover:border-border/80 transition-all cursor-pointer shadow-sm hover:shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600 shadow-sm border border-orange-200/50 shrink-0">
                      <Target size={18} />
                    </div>
                    <div>
                      <div className="font-semibold text-sm group-hover:text-primary transition-colors">{lead.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        {lead.companyName ? (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            {lead.companyLogoUrl ? (
                              <img src={lead.companyLogoUrl} className="w-3.5 h-3.5 rounded-[3px] object-cover" alt="" />
                            ) : (
                              <Building size={12} />
                            )}
                            <span>{lead.companyName}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">Sin empresa</span>
                        )}
                        <span className="text-muted-foreground">•</span>
                        <div className="inline-flex items-center px-1.5 rounded bg-muted border border-border/40 text-[10px] font-medium text-muted-foreground uppercase">
                          {stageNames[lead.status] || lead.status}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 sm:mt-0 flex flex-col sm:items-end gap-1 shrink-0">
                    <span className="text-sm font-medium">
                      {lead.value ? `$${lead.value.toLocaleString()}` : "-"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {lead.dueDate ? format(new Date(lead.dueDate), "d 'de' MMMM", { locale: es }) : "Sin fecha"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {leads.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            No hay hitos en el timeline.
          </div>
        )}

      </div>
    </div>
  );
}
