"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Target, Plus, Search, Filter, LayoutGrid, List, Clock } from "lucide-react";
import { updateLeadStage, PIPELINE_STAGES } from "../actions";
import { LeadCreatorModal } from "./lead-creator-modal";
import { BoardView } from "./board-view";
import { TableView } from "./table-view";
import { TimelineView } from "./timeline-view";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type ViewMode = "board" | "table" | "timeline";

export interface SerializedLead {
  id: string;
  name: string;
  status: string;
  value: number | null;
  notes: string | null;
  dueDate: string | null;
  companyId: string | null;
  companyName: string | null;
  companyLogoUrl: string | null;
  personName: string | null;
  createdAt: string;
}

interface LeadsClientProps {
  initialLeads: SerializedLead[];
  tenantSlug: string;
  companies: { id: string; name: string; logoUrl?: string | null }[];
  people: { id: string; name: string; lastName: string | null; companyId: string | null }[];
}

export function LeadsClient({ initialLeads, tenantSlug, companies, people }: LeadsClientProps) {
  const [leads, setLeads] = useState<SerializedLead[]>(initialLeads);
  const [viewMode, setViewMode] = useState<ViewMode>("board");
  const [searchTerm, setSearchTerm] = useState("");
  const [creatorOpen, setCreatorOpen] = useState(false);

  // Sync state if props change (revalidation)
  React.useEffect(() => {
    setLeads(initialLeads);
  }, [initialLeads]);

  const filteredLeads = leads.filter((l) => {
    const term = searchTerm.toLowerCase();
    return (
      l.name.toLowerCase().includes(term) ||
      (l.companyName && l.companyName.toLowerCase().includes(term)) ||
      (l.personName && l.personName.toLowerCase().includes(term))
    );
  });

  const handleDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const newStage = destination.droppableId;
    
    // Optimistic UI Update
    setLeads(prev => prev.map(l => l.id === draggableId ? { ...l, status: newStage } : l));

    const res = await updateLeadStage(tenantSlug, draggableId, newStage);
    if (res.error) {
      toast.error(res.error);
      // Revert on error
      setLeads(initialLeads);
    }
  };

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/40 px-6 py-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#f26522] text-white shadow-sm">
            <Target size={14} strokeWidth={2.5} />
          </div>
          <h1 className="text-sm font-semibold tracking-tight">Oportunidades</h1>
        </div>
        

        <div className="flex items-center gap-3">
          {/* View Toggles */}
          <div className="flex items-center bg-muted/30 p-1 rounded-md border border-border/40">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("board")}
              className={cn("h-7 px-2.5 text-xs rounded-sm", viewMode === "board" ? "bg-background shadow-sm font-medium" : "text-muted-foreground")}
            >
              <LayoutGrid size={13} className="mr-1.5" />
              Tablero
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("table")}
              className={cn("h-7 px-2.5 text-xs rounded-sm", viewMode === "table" ? "bg-background shadow-sm font-medium" : "text-muted-foreground")}
            >
              <List size={13} className="mr-1.5" />
              Tabla
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode("timeline")}
              className={cn("h-7 px-2.5 text-xs rounded-sm", viewMode === "timeline" ? "bg-background shadow-sm font-medium" : "text-muted-foreground")}
            >
              <Clock size={13} className="mr-1.5" />
              Timeline
            </Button>
          </div>

          <Button 
            size="sm" 
            className="h-8 shadow-sm"
            onClick={() => setCreatorOpen(true)}
          >
            <Plus size={16} className="mr-1.5" />
            Nueva Oportunidad
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between px-6 py-3 border-b border-border/20">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar oportunidades..." 
            className="h-8 pl-8 text-sm shadow-sm bg-background" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm" className="gap-2 h-8 bg-background text-xs font-semibold shadow-sm">
          <Filter size={14} />
          Filtros
        </Button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative bg-muted/10">
        {viewMode === "board" && (
          <BoardView leads={filteredLeads} onDragEnd={handleDragEnd} tenantSlug={tenantSlug} />
        )}
        {viewMode === "table" && (
          <TableView leads={filteredLeads} tenantSlug={tenantSlug} />
        )}
        {viewMode === "timeline" && (
          <TimelineView leads={filteredLeads} tenantSlug={tenantSlug} />
        )}
      </div>

      <LeadCreatorModal 
        open={creatorOpen} 
        onOpenChange={setCreatorOpen}
        tenantSlug={tenantSlug}
        companies={companies}
        people={people}
      />
    </div>
  );
}
