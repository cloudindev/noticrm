import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';
import { MembersManagerClient } from '@/features/settings/components/members-manager-client';
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

export default async function MembersSettingsPage({
  params,
}: {
  params: Promise<{ tenantSlug: string }>;
}) {
  const { tenantSlug } = await params;
  const session = await auth();

  // Fetch tenant and memberships
  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
    include: {
      members: {
        include: {
          user: true
        }
      }
    }
  });

  if (!tenant || !session?.user?.id) return notFound();

  const invites = await prisma.invite.findMany({
    where: { tenantId: tenant.id, status: 'PENDING' }
  });

  return (
    <div className="flex flex-col h-full w-full">
      {/* Top Header */}
      <div className="flex h-14 items-center px-6 border-b border-border/40 gap-2 shrink-0 bg-background z-10 sticky top-0">
        <User size={16} className="text-muted-foreground" />
        <span className="text-sm font-semibold">Miembros</span>
      </div>

      <div className="flex-1 overflow-y-auto w-full">
        <div className="mx-auto max-w-5xl py-10 px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-1">Miembros</h1>
        <p className="text-sm text-muted-foreground">Gestiona los miembros, niveles de acceso e invita nuevos usuarios.</p>
      </div>

      {/* Static "Tab" Header representation (no Teams) */}
      <div className="flex items-center gap-6 border-b border-border/40 mb-6 px-1">
        <div className="pb-3 border-b-2 border-primary text-sm font-semibold flex items-center gap-2">
          <User size={15} className="text-muted-foreground" />
          Miembros
        </div>
      </div>

      {/* Toolbar & Members Table Container */}
      <MembersManagerClient 
        tenantSlug={tenantSlug} 
        memberships={tenant.members} 
        invites={invites}
        currentUserId={session.user.id}
      />

        </div>
      </div>
    </div>
  );
}
