import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Camera, Copy, Download, LayoutGrid, Calendar, Building } from 'lucide-react';
import { WorkspaceDeleteZone } from '@/features/settings/components/workspace-delete-zone';
import { GeneralSettingsForm } from '@/features/settings/components/general-settings-form';
import { WorkspaceLogoUpload } from '@/features/settings/components/workspace-logo-upload';

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
      <WorkspaceLogoUpload 
        currentLogoUrl={tenant.logoUrl as string | null} 
        workspaceName={workspaceName} 
        tenantSlug={tenantSlug} 
      />

      {/* Form Fields & Save Action */}
      <GeneralSettingsForm tenantSlug={tenantSlug} initialName={workspaceName} />

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
      <WorkspaceDeleteZone tenantSlug={tenantSlug} workspaceName={workspaceName} />

        </div>
      </div>
    </div>
  );
}
