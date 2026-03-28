import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, SlidersHorizontal, UserPlus, User, Shield, MoreVertical } from 'lucide-react';
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

  return (
    <div className="mx-auto max-w-5xl py-10 px-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-1">Members</h1>
        <p className="text-sm text-muted-foreground">Manage workspace members, set access levels, and invite new users.</p>
      </div>

      {/* Static "Tab" Header representation (no Teams) */}
      <div className="flex items-center gap-6 border-b border-border/40 mb-6 px-1">
        <div className="pb-3 border-b-2 border-primary text-sm font-semibold flex items-center gap-2">
          <User size={15} className="text-muted-foreground" />
          Members
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search name or email" 
            className="pl-9 h-9 shadow-sm bg-background border-border/60"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" className="h-9 shadow-sm border-border/60 text-sm font-medium gap-2">
            <SlidersHorizontal size={14} />
            Filter
          </Button>
          <Button className="h-9 bg-[#2f6bff] hover:bg-[#1a55e8] text-white shadow-sm font-medium gap-2 px-4">
            <UserPlus size={16} />
            Invite member
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border/60 overflow-hidden shadow-sm bg-background">
        {/* Table Header */}
        <div className="grid grid-cols-[1fr_120px_40px] gap-4 items-center px-4 py-3 border-b border-border/60 bg-muted/10 text-[13px] font-medium text-muted-foreground">
          <div className="flex items-center gap-2"><User size={14} className="opacity-70" /> User</div>
          <div className="flex items-center gap-2"><Shield size={14} className="opacity-70" /> Role</div>
          <div></div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-border/40">
          {tenant.members.map((membership) => {
            const isYou = membership.userId === session.user?.id;
            const initials = membership.user.name?.charAt(0).toUpperCase() || "U";
            const roleBadgeClass = membership.role === 'OWNER' || membership.role === 'ADMIN' 
              ? 'bg-purple-100 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300' 
              : 'bg-muted text-muted-foreground hover:bg-muted';
            
            // Format role display: OWNER -> Admin, MEMBER -> Member
            const displayRole = membership.role === 'OWNER' || membership.role === 'ADMIN' ? 'Admin' : 'Member';
            
            return (
              <div key={membership.id} className="grid grid-cols-[1fr_120px_40px] gap-4 items-center px-4 py-3 group hover:bg-muted/20 transition-colors">
                {/* User Column */}
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="h-8 w-8 rounded-full shadow-sm shrink-0 border border-border/40">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-[#2f6bff]/10 text-[#2f6bff] text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-baseline gap-2 min-w-0">
                    <span className="text-[14px] font-semibold text-foreground truncate">
                      {membership.user.name || "User"} {isYou && <span className="text-muted-foreground font-normal">(You)</span>}
                    </span>
                    <span className="text-[13px] text-muted-foreground hidden md:inline truncate">
                      {membership.user.email}
                    </span>
                  </div>
                </div>

                {/* Role Column */}
                <div>
                  <Badge variant="secondary" className={`font-semibold text-[11px] px-2 py-0.5 shadow-none rounded-md ${roleBadgeClass}`}>
                    {displayRole}
                  </Badge>
                </div>

                {/* Actions Column */}
                <div className="flex justify-end">
                  <Button variant="ghost" size="icon-sm" className="h-7 w-7 text-muted-foreground opacity-50 hover:opacity-100 transition-opacity">
                    <MoreVertical size={16} />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
