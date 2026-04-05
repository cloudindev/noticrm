"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Building2, 
  User as UserIcon, 
  MapPin, 
  FileText,
  Building,
  Mail,
  Phone,
  Globe,
  Loader2
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createCompany } from '../actions';
import { toast } from 'sonner';

interface CompanyCreatorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantSlug: string;
  onSuccess?: () => void;
}

const PROVINCES = [
  "Álava", "Albacete", "Alicante", "Almería", "Asturias", "Ávila", "Badajoz", "Barcelona", "Burgos", "Cáceres", 
  "Cádiz", "Cantabria", "Castellón", "Ciudad Real", "Córdoba", "A Coruña", "Cuenca", "Girona", "Granada", 
  "Guadalajara", "Gipuzkoa", "Huelva", "Huesca", "Illes Balears", "Jaén", "León", "Lleida", "Lugo", "Madrid", 
  "Málaga", "Murcia", "Navarra", "Ourense", "Palencia", "Las Palmas", "Pontevedra", "La Rioja", "Salamanca", 
  "Segovia", "Sevilla", "Soria", "Tarragona", "Santa Cruz de Tenerife", "Teruel", "Toledo", "Valencia", 
  "Valladolid", "Zamora", "Zaragoza", "Ceuta", "Melilla"
];

export function CompanyCreatorModal({ open, onOpenChange, tenantSlug, onSuccess }: CompanyCreatorModalProps) {
  const [isCompany, setIsCompany] = useState(true);
  const [useSameAddress, setUseSameAddress] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    formData.append('entityType', isCompany ? 'COMPANY' : 'INDIVIDUAL');
    formData.append('useSameAddress', useSameAddress ? 'true' : 'false');
    
    // Validate required fields
    if (isCompany) {
      if (!formData.get('name')) {
        toast.error("El nombre comercial es obligatorio");
        setIsSubmitting(false);
        return;
      }
    } else {
      if (!formData.get('firstName')) {
        toast.error("El nombre es obligatorio");
        setIsSubmitting(false);
        return;
      }
    }

    const { error, companyId } = await createCompany(tenantSlug, formData);

    if (error) {
      toast.error(error);
    } else {
      toast.success(isCompany ? "Empresa creada con éxito" : "Contacto creado con éxito");
      onOpenChange(false);
      if (onSuccess) onSuccess();
    }
    
    setIsSubmitting(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden bg-background">
        <DialogHeader className="px-6 py-4 border-b border-border/40 bg-muted/20">
          <DialogTitle className="text-lg font-semibold flex items-center gap-2">
            <Building className="text-muted-foreground w-5 h-5" />
            Nuevo Registro
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col max-h-[80vh]">
          <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
            
            {/* 1. Toggle Tipo Entidad */}
            <div className="flex justify-center mb-2">
              <div className="inline-flex items-center p-1 bg-muted/60 rounded-full border border-border/60 shadow-sm relative">
                <div 
                  role="button"
                  tabIndex={0}
                  className={`flex items-center justify-center px-5 py-2 text-sm font-semibold rounded-full cursor-pointer transition-all z-10 w-[160px] ${isCompany ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  onClick={() => setIsCompany(true)}
                >
                  Empresa / Entidad
                </div>
                <div 
                  role="button"
                  tabIndex={0}
                  className={`flex items-center justify-center px-5 py-2 text-sm font-semibold rounded-full cursor-pointer transition-all z-10 w-[160px] ${!isCompany ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  onClick={() => setIsCompany(false)}
                >
                  Persona Física
                </div>
                <div className={`absolute top-1 bottom-1 w-[160px] bg-background rounded-full shadow-sm border border-border/40 transition-transform duration-300 ease-in-out z-0 ${!isCompany ? 'translate-x-[160px]' : 'translate-x-0'}`}></div>
              </div>
            </div>

            {/* 2. IDENTIFICACIÓN */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <FileText size={14} />
                Identificación Fiscal
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isCompany ? (
                  <>
                    <div className="space-y-1.5">
                      <Label htmlFor="legalName">Razón Social</Label>
                      <Input id="legalName" name="legalName" placeholder="Acme Corporation S.L." />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Nombre Comercial <span className="text-red-500">*</span></Label>
                      <Input id="name" name="name" placeholder="Acme" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="taxId">CIF / NIF</Label>
                      <Input id="taxId" name="taxId" placeholder="B12345678" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1.5">
                      <Label htmlFor="firstName">Nombre <span className="text-red-500">*</span></Label>
                      <Input id="firstName" name="firstName" placeholder="Juan" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="lastName">Primer Apellido</Label>
                      <Input id="lastName" name="lastName" placeholder="Pérez" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="secondLastName">Segundo Apellido</Label>
                      <Input id="secondLastName" name="secondLastName" placeholder="García" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="taxId">DNI / NIE</Label>
                      <Input id="taxId" name="taxId" placeholder="12345678Z" />
                    </div>
                  </>
                )}
                
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email principal</Label>
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input id="email" name="email" type="email" placeholder="hola@ejemplo.com" className="pl-9" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Teléfono</Label>
                  <div className="relative">
                    <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input id="phone" name="phone" placeholder="+34 600 000 000" className="pl-9" />
                  </div>
                </div>
                {isCompany && (
                  <div className="space-y-1.5">
                    <Label htmlFor="website">Web (opcional)</Label>
                    <div className="relative">
                      <Globe className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input id="website" name="website" placeholder="www.acme.com" className="pl-9" />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 4. DIRECCIÓN FISCAL */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <MapPin size={14} />
                Dirección Fiscal
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="address">Dirección completa</Label>
                  <Input id="address" name="address" placeholder="Calle Ejemplo 123, Piso 4A" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="addressCity">Ciudad</Label>
                  <Input id="addressCity" name="addressCity" placeholder="Madrid" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="addressProvince">Provincia</Label>
                  <Select name="addressProvince">
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione provincia" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROVINCES.map(p => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="addressZip">Código Postal</Label>
                  <Input id="addressZip" name="addressZip" placeholder="28001" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="addressCountry">País</Label>
                  <Input id="addressCountry" name="addressCountry" defaultValue="España" readOnly className="bg-muted/50" />
                </div>
              </div>
            </div>

            {/* 5. DIRECCIÓN OPERATIVA */}
            <div className="space-y-4 p-4 border border-border/50 rounded-xl bg-muted/10">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-semibold">Dirección Operativa</Label>
                  <p className="text-xs text-muted-foreground">Donde se realiza la actividad principal</p>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="same-address" className="text-xs text-muted-foreground font-medium cursor-pointer">Usar misma dirección fiscal</Label>
                  <Switch id="same-address" checked={useSameAddress} onCheckedChange={setUseSameAddress} />
                </div>
              </div>

              {!useSameAddress && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/50 mt-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="opAddress">Dirección completa operativa</Label>
                    <Input id="opAddress" name="opAddress" placeholder="Nave 4, Polígono Industrial..." />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="opAddressCity">Ciudad</Label>
                    <Input id="opAddressCity" name="opAddressCity" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="opAddressProvince">Provincia</Label>
                    <Select name="opAddressProvince">
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione provincia" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROVINCES.map(p => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="opAddressZip">Código Postal</Label>
                    <Input id="opAddressZip" name="opAddressZip" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="opAddressCountry">País</Label>
                    <Input id="opAddressCountry" name="opAddressCountry" defaultValue="España" />
                  </div>
                </div>
              )}
            </div>

          </div>

          <DialogFooter className="px-6 py-4 border-t border-border/40 bg-muted/10 shrink-0">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting} className="min-w-[120px] bg-[#2f6bff] hover:bg-[#1a55e8] text-white">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Crear Registro"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
