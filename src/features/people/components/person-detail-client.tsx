"use client";

import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Trash2, Mail, Phone, Briefcase, User, Building, Check, ChevronsUpDown } from "lucide-react";
import { updatePerson, deletePerson } from "../actions";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface CompanySelectData {
  id: string;
  name: string;
  logoUrl?: string | null;
}

interface PersonData {
  id: string;
  name: string;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  jobTitle?: string | null;
  companyId?: string | null;
  companyName?: string | null;
  companyLogoUrl?: string | null;
  notes?: string | null;
}

interface PersonDetailClientProps {
  person: PersonData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantSlug: string;
  companies: CompanySelectData[];
  onPersonUpdated: () => void;
  onPersonDeleted: () => void;
}

export function PersonDetailClient({ 
  person, 
  open, 
  onOpenChange, 
  tenantSlug, 
  companies,
  onPersonUpdated, 
  onPersonDeleted 
}: PersonDetailClientProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Local State
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  
  const [companyComboboxOpen, setCompanyComboboxOpen] = useState(false);

  useEffect(() => {
    if (person && open) {
      setName(person.name || "");
      setLastName(person.lastName || "");
      setEmail(person.email || "");
      setPhone(person.phone || "");
      setJobTitle(person.jobTitle || "");
      setNotes(person.notes || "");
      setSelectedCompanyId(person.companyId || null);
      setConfirmDelete(false);
    }
  }, [person, open]);

  if (!person) return null;

  async function handleSave() {
    setIsSaving(true);
    const formData = new FormData();
    formData.append("name", name);
    if (lastName) formData.append("lastName", lastName);
    if (email) formData.append("email", email);
    if (phone) formData.append("phone", phone);
    if (jobTitle) formData.append("jobTitle", jobTitle);
    if (notes) formData.append("notes", notes);
    if (selectedCompanyId) formData.append("companyId", selectedCompanyId);

    const { error } = await updatePerson(tenantSlug, person!.id, formData);
    
    if (error) {
      toast.error(error);
    } else {
      toast.success("Persona actualizada con éxito");
      onPersonUpdated();
      onOpenChange(false);
    }
    setIsSaving(false);
  }

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    
    setIsDeleting(true);
    const { error } = await deletePerson(tenantSlug, person!.id);
    if (error) {
      toast.error(error);
      setIsDeleting(false);
      setConfirmDelete(false);
    } else {
      toast.success("Persona eliminada");
      onPersonDeleted();
      onOpenChange(false);
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  }

  const selectedCompany = companies.find((c) => c.id === selectedCompanyId);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl max-w-xl p-0 flex flex-col bg-background border-l border-border/40">
        <SheetHeader className="px-6 py-5 border-b border-border/40 bg-muted/10 shrink-0">
          <SheetTitle className="text-xl font-semibold flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2f6bff]/10 text-[#2f6bff] font-semibold text-lg ring-1 ring-[#2f6bff]/20">
               {name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span>{name} {lastName}</span>
              {jobTitle && <span className="text-xs text-muted-foreground font-normal">{jobTitle}</span>}
            </div>
          </SheetTitle>
          <SheetDescription className="sr-only">Detalles de la persona</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2 md:col-span-1">
              <Label htmlFor="detail-name">Nombre</Label>
              <div className="relative">
                <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="detail-name" value={name} onChange={e => setName(e.target.value)} className="pl-9" />
              </div>
            </div>
            <div className="space-y-1.5 col-span-2 md:col-span-1">
              <Label htmlFor="detail-lastName">Apellidos</Label>
              <Input id="detail-lastName" value={lastName} onChange={e => setLastName(e.target.value)} />
            </div>

            <div className="space-y-1.5 col-span-2">
              <Label htmlFor="detail-jobTitle">Cargo</Label>
              <div className="relative">
                <Briefcase className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="detail-jobTitle" value={jobTitle} onChange={e => setJobTitle(e.target.value)} className="pl-9" />
              </div>
            </div>

            <div className="space-y-1.5 col-span-2 md:col-span-1">
              <Label htmlFor="detail-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="detail-email" value={email} onChange={e => setEmail(e.target.value)} className="pl-9" />
              </div>
            </div>
            
            <div className="space-y-1.5 col-span-2 md:col-span-1">
              <Label htmlFor="detail-phone">Teléfono</Label>
              <div className="relative">
                <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="detail-phone" value={phone} onChange={e => setPhone(e.target.value)} className="pl-9" />
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-border/40">
            <div>
              <Label className="text-sm font-semibold">Empresa Asociada</Label>
              <p className="text-xs text-muted-foreground mt-0.5">Vincule a esta persona con una empresa.</p>
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

          {/* Danger Zone */}
          <div className="pt-8 mb-4">
             <div className="border border-red-500/20 bg-red-500/5 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-1">Zona de Peligro</h4>
                <p className="text-xs text-muted-foreground mb-4">La eliminación de la persona es irreversible y borrará el historial asociado a este cliente particular.</p>
                <Button 
                  type="button"
                  variant={confirmDelete ? "destructive" : "outline"} 
                  size="sm" 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className={!confirmDelete ? "border-red-500/30 text-red-600 hover:bg-red-500/10" : "bg-red-600"}
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                  {confirmDelete ? "Haz clic para confirmar" : "Eliminar persona"}
                </Button>
             </div>
          </div>
        </div>

        <SheetFooter className="px-6 py-4 border-t border-border/40 bg-muted/10 shrink-0 flex items-center justify-end gap-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave} disabled={isSaving || !name.trim()} className="bg-[#2f6bff] hover:bg-[#1a55e8] text-white min-w-[120px]">
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar Detalles"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
