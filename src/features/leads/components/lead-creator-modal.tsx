"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { createLead } from "../actions";
import { toast } from "sonner";
import { Target, Loader2, Building, User, Check, ChevronsUpDown, Calendar as CalendarIcon, DollarSign } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";

interface LeadCreatorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantSlug: string;
  companies: { id: string; name: string; logoUrl?: string | null }[];
  people: { id: string; name: string; lastName: string | null; companyId: string | null }[];
}

export function LeadCreatorModal({ open, onOpenChange, tenantSlug, companies, people }: LeadCreatorModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [companyComboboxOpen, setCompanyComboboxOpen] = useState(false);
  const [personComboboxOpen, setPersonComboboxOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>();
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!open) {
      setIsSubmitting(false);
      setSelectedCompanyId(null);
      setSelectedPersonId(null);
      setDate(undefined);
      if (formRef.current) formRef.current.reset();
    }
  }, [open]);

  // Filter people based on selected company if applicable
  const availablePeople = selectedCompanyId 
    ? people.filter(p => !p.companyId || p.companyId === selectedCompanyId)
    : people;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    if (selectedCompanyId) formData.append("companyId", selectedCompanyId);
    if (selectedPersonId) formData.append("personId", selectedPersonId);
    if (date) formData.append("dueDate", date.toISOString());

    const { error } = await createLead(tenantSlug, formData);

    if (error) {
      toast.error(error);
    } else {
      toast.success("Oportunidad creada con éxito");
      onOpenChange(false);
    }

    setIsSubmitting(false);
  }

  const selectedCompany = companies.find((c) => c.id === selectedCompanyId);
  const selectedPerson = people.find((p) => p.id === selectedPersonId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-w-2xl p-0 overflow-hidden bg-background">
        <DialogHeader className="px-8 py-5 border-b border-border/40 bg-muted/20">
          <DialogTitle className="text-lg font-semibold flex items-center gap-2">
            <Target className="text-muted-foreground w-5 h-5" />
            Nueva Oportunidad
          </DialogTitle>
        </DialogHeader>

        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col max-h-[85vh]">
          <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
            
            <div className="space-y-1.5">
              <Label htmlFor="name">Nombre de la Oportunidad <span className="text-red-500">*</span></Label>
              <Input id="name" name="name" placeholder="Ej. Renovación de software" required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-1.5">
                <Label>Empresa Cliente</Label>
                <Popover open={companyComboboxOpen} onOpenChange={setCompanyComboboxOpen}>
                  <PopoverTrigger 
                    className={cn(buttonVariants({ variant: "outline" }), "w-full justify-between hover:bg-muted/50")}
                  >
                    {selectedCompany ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-muted flex items-center justify-center overflow-hidden shrink-0 border border-border/40 shadow-sm">
                          {selectedCompany.logoUrl ? (
                            <img src={selectedCompany.logoUrl} alt={selectedCompany.name} className="w-full h-full object-cover" />
                          ) : (
                            <Building size={10} className="text-muted-foreground" />
                          )}
                        </div>
                        <span className="truncate">{selectedCompany.name}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground font-normal">No especificado</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Buscar empresa..." />
                      <CommandList>
                        <CommandEmpty>No se encontraron empresas.</CommandEmpty>
                        <CommandGroup>
                          {companies.map((company) => (
                            <CommandItem
                              key={company.id}
                              value={company.name}
                              onSelect={() => {
                                setSelectedCompanyId(company.id === selectedCompanyId ? null : company.id);
                                setCompanyComboboxOpen(false);
                              }}
                            >
                              <Check className={cn("mr-2 h-4 w-4", selectedCompanyId === company.id ? "opacity-100" : "opacity-0")} />
                              <span className="truncate">{company.name}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-1.5">
                <Label>Contacto Principal</Label>
                <Popover open={personComboboxOpen} onOpenChange={setPersonComboboxOpen}>
                  <PopoverTrigger 
                    className={cn(buttonVariants({ variant: "outline" }), "w-full justify-between hover:bg-muted/50")}
                  >
                    {selectedPerson ? (
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-muted-foreground" />
                        <span className="truncate">{selectedPerson.name} {selectedPerson.lastName}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground font-normal">No especificado</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Buscar persona..." />
                      <CommandList>
                        <CommandEmpty>No se encontraron contactos.</CommandEmpty>
                        <CommandGroup>
                          {availablePeople.map((person) => (
                            <CommandItem
                              key={person.id}
                              value={`${person.name} ${person.lastName}`}
                              onSelect={() => {
                                setSelectedPersonId(person.id === selectedPersonId ? null : person.id);
                                setPersonComboboxOpen(false);
                              }}
                            >
                              <Check className={cn("mr-2 h-4 w-4", selectedPersonId === person.id ? "opacity-100" : "opacity-0")} />
                              <span className="truncate">{person.name} {person.lastName}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="value">Presupuesto / Valor (<span className="text-xs">€</span>)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="value" name="value" type="number" step="0.01" placeholder="5000" className="pl-9" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Fecha de Cierre Estimada</Label>
                <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
                  <PopoverTrigger className={cn(buttonVariants({ variant: "outline" }), "w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(d) => { setDate(d); setDatePopoverOpen(false); }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <Label htmlFor="notes">Notas Internas</Label>
              <textarea 
                id="notes" 
                name="notes" 
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                placeholder="Detalla contexto inicial, necesidades del cliente, competidores involucrados, etc."
              />
            </div>

          </div>

          <DialogFooter className="px-8 py-5 border-t border-border/40 bg-muted/10 shrink-0">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting} className="min-w-[130px]">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Crear Oportunidad"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
