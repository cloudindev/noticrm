"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { createPerson } from "../actions";
import { toast } from "sonner";
import { User, Mail, Phone, Loader2, Building, Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface PersonCreatorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantSlug: string;
  companies: { id: string; name: string; logoUrl?: string | null }[];
  onSuccess?: () => void;
}

export function PersonCreatorModal({ 
  open, 
  onOpenChange, 
  tenantSlug, 
  companies, 
  onSuccess 
}: PersonCreatorModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [companyComboboxOpen, setCompanyComboboxOpen] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!open) {
      setIsSubmitting(false);
      setSelectedCompanyId(null);
      if (formRef.current) formRef.current.reset();
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    if (selectedCompanyId) {
      formData.append("companyId", selectedCompanyId);
    }

    if (!formData.get("name")) {
      toast.error("El nombre es obligatorio");
      setIsSubmitting(false);
      return;
    }

    const { error, personId } = await createPerson(tenantSlug, formData);

    if (error) {
      toast.error(error);
    } else {
      toast.success("Persona creada con éxito");
      onOpenChange(false);
      if (onSuccess) onSuccess();
    }

    setIsSubmitting(false);
  }

  const selectedCompany = companies.find((c) => c.id === selectedCompanyId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-w-2xl p-0 overflow-hidden bg-background">
        <DialogHeader className="px-8 py-5 border-b border-border/40 bg-muted/20">
          <DialogTitle className="text-lg font-semibold flex items-center gap-2">
            <User className="text-muted-foreground w-5 h-5" />
            Nueva Persona
          </DialogTitle>
        </DialogHeader>

        <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col max-h-[85vh]">
          <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
            
            {/* Person Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="name">Nombre <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="name" name="name" placeholder="Juan" required className="pl-9" />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="lastName">Apellidos</Label>
                <Input id="lastName" name="lastName" placeholder="Pérez" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="jobTitle">Cargo</Label>
                <Input id="jobTitle" name="jobTitle" placeholder="Ej. Director General" />
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="email" name="email" type="email" placeholder="juan@ejemplo.com" className="pl-9" />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <Label htmlFor="phone">Teléfono</Label>
                <div className="relative">
                  <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="phone" name="phone" placeholder="+34 600 000 000" className="pl-9" />
                </div>
              </div>
            </div>

            {/* Company Link */}
            <div className="space-y-3 pt-6 border-t border-border/40">
              <div>
                <Label className="text-sm font-semibold">Asignar a Empresa</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Vincule a esta persona con una empresa existente (opcional).</p>
              </div>
              
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
                    <span className="text-muted-foreground font-normal">Buscar empresa...</span>
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
                              setSelectedCompanyId(
                                company.id === selectedCompanyId ? null : company.id
                              );
                              setCompanyComboboxOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedCompanyId === company.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 rounded bg-muted flex items-center justify-center overflow-hidden shrink-0 border border-border/40 shadow-sm">
                                {company.logoUrl ? (
                                  <img src={company.logoUrl} alt={company.name} className="w-full h-full object-cover" />
                                ) : (
                                  <Building size={10} className="text-muted-foreground" />
                                )}
                              </div>
                              <span className="truncate">{company.name}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

          </div>

          <DialogFooter className="px-8 py-5 border-t border-border/40 bg-muted/10 shrink-0">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting} className="min-w-[130px] bg-[#2f6bff] hover:bg-[#1a55e8] text-white">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Crear Persona"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
