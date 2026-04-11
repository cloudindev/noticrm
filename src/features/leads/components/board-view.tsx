"use client";

import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { PIPELINE_STAGES } from "../constants";
import { SerializedLead } from "./leads-client";
import { Building, Calendar, DollarSign, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useRouter } from "next/navigation";

// Utility to give each stage a distinct subtle color
const stageColors: Record<string, string> = {
  PROSPECTING: "bg-blue-500",
  QUALIFIED: "bg-purple-500",
  PROPOSAL: "bg-orange-500",
  NEGOTIATION: "bg-pink-500",
  CLOSED: "bg-green-500",
};

const stageNames: Record<string, string> = {
  PROSPECTING: "Prospección",
  QUALIFIED: "Cualificada",
  PROPOSAL: "Propuesta enviada",
  NEGOTIATION: "Negociación",
  CLOSED: "Cerrada",
};

interface BoardViewProps {
  leads: SerializedLead[];
  onDragEnd: (result: any) => void;
  tenantSlug: string;
}

export function BoardView({ leads, onDragEnd, tenantSlug }: BoardViewProps) {
  const router = useRouter();
  
  // Important hack for strictly dropping hydration errors with react-beautiful-dnd
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return null;

  const grouped = PIPELINE_STAGES.map((stage) => ({
    id: stage,
    title: stageNames[stage],
    items: leads.filter((l) => l.status === stage),
  }));

  return (
    <div className="h-full w-full overflow-x-auto overflow-y-hidden bg-muted/10 p-6 flex gap-6">
      <DragDropContext onDragEnd={onDragEnd}>
        {grouped.map((col) => (
          <div key={col.id} className="flex flex-col w-[320px] shrink-0 h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${stageColors[col.id] || "bg-gray-400"}`} />
                <h3 className="font-semibold text-sm">{col.title}</h3>
                <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded ml-1">
                  {col.items.length}
                </span>
              </div>
            </div>

            <Droppable droppableId={col.id}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`flex-1 overflow-y-auto rounded-lg transition-colors p-1.5 -mx-1.5 ${
                    snapshot.isDraggingOver ? "bg-muted/50" : ""
                  }`}
                >
                  {col.items.map((lead, index) => (
                    <Draggable key={lead.id} draggableId={lead.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => router.push(`/${tenantSlug}/leads/${lead.id}`)}
                          className={`mb-3 flex flex-col gap-3 rounded-xl bg-background p-4 shadow-sm border border-border/40 transition-shadow hover:shadow-md cursor-pointer ${
                            snapshot.isDragging ? "shadow-lg ring-1 ring-primary/20" : ""
                          }`}
                          style={{
                            ...provided.draggableProps.style,
                          }}
                        >
                          <div className="flex items-start justify-between gap-2">
                             <div className="flex items-center gap-2 text-xs text-muted-foreground">
                               {lead.companyLogoUrl ? (
                                 <img src={lead.companyLogoUrl} className="w-4 h-4 rounded-sm object-cover" alt="" />
                               ) : (
                                 <Building size={14} />
                               )}
                               <span className="font-medium text-foreground">{lead.companyName || "Sin empresa"}</span>
                             </div>
                             {lead.value && (
                               <div className="font-semibold text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                 ${lead.value.toLocaleString()}
                               </div>
                             )}
                          </div>
                          
                          <div className="font-semibold text-sm leading-tight text-foreground">
                            {lead.name}
                          </div>

                          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                            {lead.dueDate && (
                              <div className="flex items-center gap-1.5">
                                <Calendar size={13} />
                                {format(new Date(lead.dueDate), "MMM d, yyyy", { locale: es })}
                              </div>
                            )}
                            {lead.notes && (
                              <div className="flex items-center gap-1.5 ml-auto">
                                <MessageSquare size={13} />
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </DragDropContext>
    </div>
  );
}
