"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { updateGeneralSettings } from '../actions';

interface GeneralSettingsFormProps {
  tenantSlug: string;
  initialName: string;
}

export function GeneralSettingsForm({ tenantSlug, initialName }: GeneralSettingsFormProps) {
  const [name, setName] = useState(initialName);
  const [isPending, setIsPending] = useState(false);

  const copySlug = () => {
    navigator.clipboard.writeText(tenantSlug);
    toast.success("Identificador (Slug) copiado al portapapeles");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("El nombre del espacio de trabajo no puede estar vacío");
      return;
    }
    
    setIsPending(true);
    const result = await updateGeneralSettings(tenantSlug, { name });
    setIsPending(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Ajustes guardados correctamente");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-3xl">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-muted-foreground">Nombre</label>
          <Input 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-9 shadow-sm px-3 font-medium" 
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-muted-foreground">Identificador (Slug)</label>
          <div className="relative">
            <Input 
              value={tenantSlug} 
              readOnly 
              className="h-9 shadow-sm bg-muted/30 px-3 pr-8 text-muted-foreground" 
            />
            <button 
              type="button"
              onClick={copySlug}
              className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Copy size={14} />
            </button>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">El identificador único no se puede cambiar.</p>
        </div>
      </div>
      
      <div className="flex justify-start">
        <Button 
          type="submit" 
          disabled={isPending || name === initialName}
          className="bg-[#2f6bff] hover:bg-[#1a55e8] text-white shadow-sm h-8 px-4 font-medium rounded-md gap-2"
        >
          {isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          Guardar Cambios
        </Button>
      </div>
    </form>
  );
}
