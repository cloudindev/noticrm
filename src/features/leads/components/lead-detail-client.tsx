"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PIPELINE_STAGES, updateLeadStage } from "../actions";
import { ArrowLeft, Building, Target, Check, Calendar, DollarSign, LayoutDashboard, Flag, Mail, Phone, Clock, Plus, MessageSquare, User } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface LeadDetailClientProps {
  lead: any;
  tasks: any[];
  tenantSlug: string;
}

const stageNames: Record<string, string> = {
  PROSPECTING: "Prospección",
  QUALIFIED: "Cualificada",
  PROPOSAL: "Propuesta enviada",
  NEGOTIATION: "Negociación",
  CLOSED: "Cerrada",
};

export function LeadDetailClient({ lead, tasks, tenantSlug }: LeadDetailClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [currentStage, setCurrentStage] = useState(lead.status);

  // Find index of current stage to calculate progressed nodes
  const currentIndex = PIPELINE_STAGES.indexOf(currentStage);

  const handleStageChange = async (newStage: string) => {
    setCurrentStage(newStage);
    const { error } = await updateLeadStage(tenantSlug, lead.id, newStage);
    if (error) {
      toast.error(error);
    } else {
      toast.success("Fase de oportunidad actualizada");
    }
  };

  const advanceStage = () => {
    if (currentIndex < PIPELINE_STAGES.length - 1) {
      handleStageChange(PIPELINE_STAGES[currentIndex + 1]);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full w-full bg-background overflow-hidden relative">
      
      {/* Main Content (Left) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="px-8 py-6 border-b border-border/40 shrink-0 sticky top-0 bg-background/95 backdrop-blur z-20">
          
          <Button variant="ghost" size="sm" className="mb-4 text-muted-foreground -ml-2" onClick={() => router.push(`/${tenantSlug}/leads`)}>
             <ArrowLeft size={16} className="mr-2" />
             Volver a Oportunidades
          </Button>
          
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
            {lead.name}
            {currentStage === "CLOSED" && (
                <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-700 uppercase">
                  Lograda
                </div>
            )}
          </h1>
          
          {/* Tabs */}
          <div className="flex items-center gap-6 mt-6 border-b border-border/40">
            <button 
              onClick={() => setActiveTab("overview")}
              className={cn("pb-2.5 text-sm font-medium transition-colors relative", activeTab === "overview" ? "text-primary" : "text-muted-foreground hover:text-foreground")}
            >
              General
              {activeTab === "overview" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
            </button>
            <button 
              onClick={() => setActiveTab("tasks")}
              className={cn("pb-2.5 text-sm font-medium transition-colors relative", activeTab === "tasks" ? "text-primary" : "text-muted-foreground hover:text-foreground")}
            >
              Tareas <span className="opacity-70 text-xs ml-1">({tasks.length})</span>
              {activeTab === "tasks" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
            </button>
            <button 
              onClick={() => setActiveTab("notes")}
              className={cn("pb-2.5 text-sm font-medium transition-colors relative", activeTab === "notes" ? "text-primary" : "text-muted-foreground hover:text-foreground")}
            >
              Notas
              {activeTab === "notes" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />}
            </button>
          </div>
        </div>

        <div className="p-8 space-y-10">
           
          {activeTab === "overview" && (
            <>
              {/* STAGE PIPELINE */}
              <div className="bg-muted/10 border border-border/60 rounded-xl p-5">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-semibold text-sm">Fase del Embudo</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 shadow-sm"
                    onClick={advanceStage}
                    disabled={currentIndex === PIPELINE_STAGES.length - 1}
                  >
                    Avanzar de Fase
                  </Button>
                </div>
                
                <div className="flex relative">
                  {/* Background track line */}
                  <div className="absolute top-[18px] left-0 right-0 h-[2px] bg-border/40 -z-10" />
                  
                  {PIPELINE_STAGES.map((stage, idx) => {
                    const isActive = stage === currentStage;
                    const isPassed = idx < currentIndex;
                    return (
                      <div key={stage} className="flex-1 flex flex-col items-center group relative mt-1" onClick={() => handleStageChange(stage)}>
                        <button className={cn(
                          "w-[26px] h-[26px] rounded-full border-2 bg-background flex items-center justify-center transition-all shadow-sm z-10 cursor-pointer",
                          isPassed || isActive ? "border-[#2f6bff]" : "border-border/60",
                          isPassed && "bg-[#2f6bff]",
                          isActive && "border-4" // thick border if active
                        )}>
                          {isPassed && <Check size={12} className="text-white" strokeWidth={3} />}
                        </button>
                        <span className={cn(
                          "text-[11px] uppercase tracking-wider font-semibold mt-3 transition-colors text-center max-w-[100px]",
                          (isPassed || isActive) ? "text-[#2f6bff]" : "text-muted-foreground"
                        )}>
                          {stageNames[stage]}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* DETAILS GRID */}
              <div className="space-y-6">
                <h3 className="text-base font-bold tracking-tight">Detalles de Oportunidad</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-6">
                  
                  {/* Detail Item */}
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs text-muted-foreground uppercase font-semibold">Valor Estimado</span>
                    <span className="text-sm font-medium flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                        <DollarSign size={12} />
                      </div>
                      ${lead.value?.toLocaleString() || "0"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs text-muted-foreground uppercase font-semibold">Cierre Previsto</span>
                    <span className="text-sm font-medium flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                        <Calendar size={12} />
                      </div>
                      {lead.dueDate ? format(new Date(lead.dueDate), "dd MMM, yyyy", { locale: es }) : "Sin definir"}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs text-muted-foreground uppercase font-semibold">Categoría</span>
                    <span className="text-sm font-medium flex items-center gap-1.5">
                       <LayoutDashboard size={14} className="text-muted-foreground" />
                       Inbound
                    </span>
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs text-muted-foreground uppercase font-semibold">Probabilidad</span>
                    <span className="text-sm font-medium flex items-center gap-1.5">
                       <Flag size={14} className="text-muted-foreground" />
                       {Math.min(100, Math.max(10, currentIndex * 25))}%
                    </span>
                  </div>

                </div>
              </div>

              {/* TIMELINE / ACTIVITY */}
              <div className="space-y-6 pt-6 border-t border-border/40">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold tracking-tight">Actividad</h3>
                  <Button variant="outline" size="sm" className="h-8 shadow-sm gap-2">
                    <Plus size={14} /> Nueva Nota
                  </Button>
                </div>
                
                <div className="relative pl-6 space-y-8 before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border/40 before:to-transparent">
                  
                  {/* Fake Genesis Log */}
                  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                     <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-background bg-blue-100 text-blue-600 shadow shrink-0 z-10 -ml-3 md:ml-auto md:mr-auto">
                        <Target size={12} />
                     </div>
                     <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] pl-3 md:px-4">
                        <div className="flex flex-col text-sm border border-border/40 rounded-xl p-4 bg-muted/10 shadow-sm">
                           <span className="font-semibold mb-1">Oportunidad Creada</span>
                           <span className="text-muted-foreground mb-2">Se abríó esta oportunidad en el sistema.</span>
                           <time className="text-xs text-muted-foreground flex items-center gap-1.5 font-mono"><Clock size={12} /> {format(new Date(lead.createdAt), "dd MMM yyyy HH:mm", { locale: es })}</time>
                        </div>
                     </div>
                  </div>

                  {tasks.map(task => (
                    <div key={task.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                       <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-background bg-orange-100 text-orange-600 shadow shrink-0 z-10 -ml-3 md:ml-auto md:mr-auto">
                          <Check size={12} />
                       </div>
                       <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] md:px-4">
                          <div className="flex flex-col text-sm border border-border/40 rounded-xl p-4 bg-muted/10 shadow-sm">
                             <div className="flex justify-between items-start mb-1">
                               <span className="font-semibold">Tarea Creada: {task.title}</span>
                               <span className="px-1.5 py-0.5 bg-muted rounded text-[10px] uppercase font-bold text-muted-foreground">{task.status}</span>
                             </div>
                             <span className="text-muted-foreground mb-2">Asignado a: {task.assigneeName || "Nadie"}</span>
                             <time className="text-xs text-muted-foreground flex items-center gap-1.5 font-mono"><Clock size={12} /> {format(new Date(task.createdAt), "dd MMM yyyy HH:mm", { locale: es })}</time>
                          </div>
                       </div>
                    </div>
                  ))}

                </div>
              </div>
            </>
          )}

          {activeTab === "tasks" && (
            <div className="bg-muted/10 border border-border/60 rounded-xl p-8 flex flex-col items-center justify-center text-center">
              <Check className="h-8 w-8 text-muted-foreground mb-3" />
              <h3 className="font-semibold">Sin tareas</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm">No hay tareas pendientes asignadas específicamente para esta oportunidad.</p>
              <Button size="sm" className="mt-4">
                 Añadir Tarea
              </Button>
            </div>
          )}

          {activeTab === "notes" && (
            <div className="space-y-4">
              <div className="border border-border/60 rounded-xl p-4 bg-background shadow-sm focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                <textarea 
                  className="w-full bg-transparent resize-none outline-none text-sm min-h-[60px]"
                  placeholder={`Redacta una nota sobre ${lead.name}...`}
                />
                <div className="flex justify-between mt-2 pt-2 border-t border-border/30">
                  <div className="flex items-center gap-2"></div>
                  <Button size="sm" className="h-7 text-xs rounded-md px-3">
                    Guardar Nota
                  </Button>
                </div>
              </div>

              {lead.notes && (
                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted/40 shrink-0 border border-border/40">
                    <MessageSquare size={14} className="text-muted-foreground" />
                  </div>
                  <div className="flex flex-col text-sm border border-border/40 rounded-xl p-4 bg-muted/10 shadow-sm w-full">
                     <span className="font-semibold mb-1">Nota Inicial</span>
                     <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{lead.notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Right Sidebar (Company & Contacts) */}
      <div className="w-full lg:w-[320px] shrink-0 border-l border-border/40 bg-muted/10 overflow-y-auto">
        
        {/* CONTACTS SECTION */}
        <div className="p-5 border-b border-border/40">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm tracking-tight text-foreground flex items-center gap-1.5"><User size={14}/> Contactos</h3>
            <Button variant="ghost" size="icon" className="h-6 w-6"><Plus size={14} /></Button>
          </div>

          <div className="space-y-3">
            {lead.company?.people?.map((person: any) => (
              <div key={person.id} className={cn("border rounded-xl p-3 bg-background relative overflow-hidden", person.isPrimary ? "border-[#2f6bff]/50 shadow-sm line-indicator" : "border-border/60")}>
                {person.isPrimary && <div className="absolute top-0 left-0 bg-[#2f6bff]/10 w-full h-1" />}
                
                <div className="flex justify-between items-start mb-2">
                  <span className={cn("text-[10px] uppercase font-bold tracking-widest", person.isPrimary ? "text-[#2f6bff]" : "text-muted-foreground")}>
                    {person.isPrimary ? "Primary Contact" : "Influencer"}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold shrink-0">
                    {person.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="font-semibold text-sm">{person.name} {person.lastName}</span>
                    <span className="text-[11px] text-muted-foreground">{person.jobTitle || "Contact"}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  {person.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail size={12} /> <span className="truncate">{person.email}</span>
                    </div>
                  )}
                  {person.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone size={12} /> <span>{person.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {(!lead.company || (!lead.company.people || lead.company.people.length === 0)) && (
               <div className="border border-dashed border-border/60 rounded-xl p-4 text-center text-xs text-muted-foreground bg-background">
                 No hay contactos asignados.
               </div>
            )}
          </div>
        </div>

        {/* COMPANY SECTION */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm tracking-tight text-foreground flex items-center gap-1.5"><Building size={14}/> Empresa</h3>
          </div>

          {lead.company ? (
            <div className="border border-border/60 rounded-xl p-4 bg-background">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/50 bg-secondary shrink-0 overflow-hidden">
                  {lead.company.logoUrl ? (
                    <img src={lead.company.logoUrl} className="w-full h-full object-cover" alt="" />
                  ) : (
                    <Building size={16} className="text-secondary-foreground" />
                  )}
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="font-semibold text-sm">{lead.company.name}</span>
                  <span className="text-[11px] text-muted-foreground">{lead.company.sector || "General"}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs mb-1">
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground font-medium uppercase tracking-wider text-[10px]">Industria</span>
                  <span className="font-medium truncate">{lead.company.sector || "-"}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground font-medium uppercase tracking-wider text-[10px]">Ubicación</span>
                  <span className="font-medium truncate">{lead.company.addressCity || lead.company.addressCountry || "-"}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-border/60 rounded-xl p-4 text-center text-xs text-muted-foreground bg-background">
              No hay empresa vinculada a esta oportunidad.
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
