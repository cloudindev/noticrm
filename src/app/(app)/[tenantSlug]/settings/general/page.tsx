import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Camera, Copy, Download, LayoutGrid, Calendar, Trash2, Building } from 'lucide-react';

import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

export default async function GeneralSettingsPage({
  params,
}: {
  params: Promise<{ tenantSlug: string }>;
}) {
  const { tenantSlug } = await params;
  
  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug }
  });

  if (!tenant) return notFound();

  const workspaceName = tenant.name;

  return (
    <div className="flex flex-col h-full w-full">
      {/* Top Header */}
      <div className="flex h-14 items-center px-6 border-b border-border/40 gap-2 shrink-0 bg-background z-10 sticky top-0">
        <Building size={16} className="text-muted-foreground" />
        <span className="text-sm font-semibold">General</span>
      </div>

      <div className="flex-1 overflow-y-auto w-full">
        <div className="mx-auto max-w-4xl py-10 px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold mb-1">General</h1>
        <p className="text-sm text-muted-foreground">Modifica los ajustes de tu espacio de trabajo actual</p>
      </div>

      <div className="my-10 h-px bg-border/40 max-w-3xl" />

      {/* Workspace Logo */}
      <div className="mb-8 flex items-start gap-6">
        <Avatar className="h-16 w-16 rounded-xl border border-border/40 bg-[#00b2ff] text-white shrink-0">
          <AvatarImage src="" />
          <AvatarFallback className="rounded-xl text-2xl font-medium bg-transparent">
            {workspaceName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1.5 pt-0.5">
          <h2 className="text-sm font-semibold">Logo del espacio</h2>
          <p className="text-xs text-muted-foreground mb-1">Soportamos PNGs, JPEGs y GIFs menores de 10MB</p>
          <div className="flex items-center gap-3">
            <Button size="sm" className="bg-[#2f6bff] hover:bg-[#1a55e8] text-white shadow-sm h-8 px-4 font-medium rounded-md gap-2">
              <Camera size={14} />
              Subir logo
            </Button>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="flex flex-col gap-6 max-w-3xl">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground">Nombre</label>
            <Input defaultValue={workspaceName} className="h-9 shadow-sm px-3" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-muted-foreground">Identificador (Slug)</label>
            <div className="relative">
              <Input 
                value={tenantSlug} 
                readOnly 
                className="h-9 shadow-sm bg-muted/30 px-3 pr-8 text-muted-foreground" 
              />
              <button className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground">
                <Copy size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="my-10 h-px bg-border/40 max-w-3xl" />

      {/* Export Workspace Data */}
      <div className="mb-10 max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold mb-1">Exportar datos</h2>
            <p className="text-sm text-muted-foreground">Las exportaciones son en CSV y se pueden descargar en los próximos 7 días</p>
          </div>
          <Button variant="outline" size="sm" className="h-8 shadow-sm border-border/60 text-sm font-medium gap-2">
            <Download size={14} />
            Nueva exportación
          </Button>
        </div>
        
        <div className="rounded-xl border border-border/60 overflow-hidden shadow-sm">
          <div className="grid grid-cols-2 gap-4 items-center px-4 py-3 border-b border-border/60 bg-muted/10 text-xs font-medium text-muted-foreground">
            <div className="flex items-center gap-2"><LayoutGrid size={14} className="opacity-70" /> Tipo</div>
            <div className="flex items-center gap-2"><Calendar size={14} className="opacity-70" /> Fecha</div>
          </div>
          <div className="px-4 py-4 text-sm text-muted-foreground bg-background">
            Sin exportaciones
          </div>
        </div>
      </div>

      <div className="my-10 h-px bg-border/40 max-w-3xl" />

      {/* Danger Zone */}
      <div className="mb-10 max-w-3xl">
        <h2 className="text-sm font-semibold mb-4">Zona de peligro</h2>
        
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 flex items-center justify-between">
          <div>
            <h3 className="text-[14px] font-semibold text-foreground mb-1">Eliminar espacio de trabajo</h3>
            <p className="text-sm text-muted-foreground">Una vez eliminado, u espacio de trabajo no podrá recuperarse</p>
          </div>
          <Button variant="destructive" size="sm" className="h-9 shadow-sm bg-red-500 hover:bg-red-600 text-white font-medium px-4 gap-2">
            <Trash2 size={16} />
            Eliminar espacio
          </Button>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
}
