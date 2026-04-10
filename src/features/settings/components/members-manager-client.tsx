"use client";

import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, SlidersHorizontal, UserPlus, User, Shield, MoreVertical, Trash, Edit, Mail, ShieldAlert } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

import { MemberInviteModal } from './member-invite-modal';
import { revokeMembershipAction } from '../members.actions';
import { toast } from 'sonner';

interface MembersManagerClientProps {
  tenantSlug: string;
  memberships: any[];
  invites?: any[];
  currentUserId: string;
}

export function MembersManagerClient({ 
  tenantSlug, 
  memberships, 
  invites = [], 
  currentUserId 
}: MembersManagerClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'INVITE' | 'EDIT'>('INVITE');
  const [editingMember, setEditingMember] = useState<any>(null);

  const filteredMembers = memberships.filter(m => 
    m.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openInvite = () => {
    setModalMode('INVITE');
    setEditingMember(null);
    setIsModalOpen(true);
  };

  const openEdit = (member: any) => {
    setModalMode('EDIT');
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleRevoke = async (membershipId: string) => {
    if (!confirm("¿Seguro que deseas eliminar el acceso a este usuario?")) return;
    const res = await revokeMembershipAction(tenantSlug, membershipId);
    if (res.error) toast.error(res.error);
    else toast.success("Acceso revocado correctamente.");
  };

  const currentUserRole = memberships.find(m => m.userId === currentUserId)?.role;
  const canManageMembers = currentUserRole === 'ADMIN' || currentUserRole === 'OWNER';

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre o email" 
            className="pl-9 h-9 shadow-sm bg-background border-border/60"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" className="h-9 shadow-sm border-border/60 text-sm font-medium gap-2">
            <SlidersHorizontal size={14} />
            Filtros
          </Button>
          {canManageMembers && (
            <Button onClick={openInvite} className="h-9 bg-[#2f6bff] hover:bg-[#1a55e8] text-white shadow-sm font-medium gap-2 px-4">
              <UserPlus size={16} />
              Invitar miembro
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Active Members Table */}
        <div className="rounded-xl border border-border/60 overflow-hidden shadow-sm bg-background">
          <div className="grid grid-cols-[1fr_120px_40px] gap-4 items-center px-4 py-3 border-b border-border/60 bg-muted/10 text-[13px] font-medium text-muted-foreground">
            <div className="flex items-center gap-2"><User size={14} className="opacity-70" /> Usuario Activo</div>
            <div className="flex items-center gap-2"><Shield size={14} className="opacity-70" /> Rol</div>
            <div></div>
          </div>

          <div className="divide-y divide-border/40">
            {filteredMembers.map((membership: any) => {
              const isYou = membership.userId === currentUserId;
              const initials = membership.user?.name?.charAt(0).toUpperCase() || membership.user?.email?.charAt(0).toUpperCase() || "U";
              
              const isAdmin = membership.role === 'OWNER' || membership.role === 'ADMIN';
              const roleBadgeClass = isAdmin 
                ? 'bg-purple-100 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300' 
                : 'bg-muted text-muted-foreground hover:bg-muted';
              
              const displayRole = isAdmin ? 'Admin' : 'Miembro';

              return (
                <div key={membership.id} className="grid grid-cols-[1fr_120px_40px] gap-4 items-center px-4 py-3 group hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="h-8 w-8 rounded-full shadow-sm shrink-0 border border-border/40">
                      <AvatarImage src={membership.user?.image || ""} />
                      <AvatarFallback className="bg-[#2f6bff]/10 text-[#2f6bff] text-xs font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex items-baseline gap-2 min-w-0">
                      <span className="text-[14px] font-semibold text-foreground truncate">
                        {membership.user?.name || "Usuario"} {isYou && <span className="text-muted-foreground font-normal">(Tú)</span>}
                      </span>
                      <span className="text-[13px] text-muted-foreground hidden md:inline truncate">
                        {membership.user?.email}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Badge variant="secondary" className={`font-semibold text-[11px] px-2 py-0.5 shadow-none rounded-md ${roleBadgeClass}`}>
                      {displayRole}
                    </Badge>
                  </div>

                  <div className="flex justify-end">
                    {(canManageMembers && !isYou) && membership.role !== "OWNER" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground opacity-50 hover:bg-muted group-hover:opacity-100 transition-opacity focus:outline-none">
                          <MoreVertical size={16} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px]">
                          <DropdownMenuItem onClick={() => openEdit(membership)} className="gap-2 cursor-pointer">
                            <Edit size={14} className="text-muted-foreground" />
                            Editar Permisos
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRevoke(membership.id)} className="text-destructive gap-2 cursor-pointer focus:text-destructive">
                            <Trash size={14} />
                            Revocar Acceso
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              );
            })}
            
            {filteredMembers.length === 0 && (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                No hay miembros que coincidan con la búsqueda.
              </div>
            )}
          </div>
        </div>

        {/* Pending Invites */}
        {invites.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3 text-foreground flex items-center gap-2">
              <Mail size={16} className="text-muted-foreground" />
              Invitaciones Pendientes
            </h3>
            <div className="rounded-xl border border-border/60 overflow-hidden shadow-sm bg-background">
              <div className="divide-y divide-border/40">
                {invites.map((invite: any) => (
                  <div key={invite.id} className="grid grid-cols-[1fr_120px_40px] gap-4 items-center px-4 py-3 group hover:bg-muted/20 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-8 w-8 rounded-full shadow-sm shrink-0 border border-border/40 border-dashed bg-mutedflex items-center justify-center text-muted-foreground text-xs font-medium">
                        {invite.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[13px] font-medium text-foreground truncate">{invite.email}</span>
                        <span className="text-[11px] text-muted-foreground">Invitación enviada</span>
                      </div>
                    </div>

                    <div>
                      <Badge variant="outline" className="font-medium text-[11px] px-2 py-0.5 shadow-none rounded-md text-muted-foreground">
                        {invite.role === 'ADMIN' ? 'Admin' : 'Miembro'}
                      </Badge>
                    </div>

                    <div className="flex justify-end">
                      {canManageMembers && (
                        <DropdownMenu>
                          <DropdownMenuTrigger className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground opacity-50 hover:bg-muted group-hover:opacity-100 transition-opacity focus:outline-none">
                            <MoreVertical size={16} />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="text-destructive gap-2 cursor-pointer focus:text-destructive">
                              <Trash size={14} />
                              Cancelar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {isModalOpen && (
        <MemberInviteModal 
          open={isModalOpen} 
          onOpenChange={setIsModalOpen}
          tenantSlug={tenantSlug}
          mode={modalMode}
          membershipId={editingMember?.id}
          initialEmail={editingMember?.user?.email || ""}
          initialRole={editingMember?.role === "ADMIN" || editingMember?.role === "OWNER" ? "ADMIN" : "MEMBER"}
          initialPermissions={
            editingMember ? {
              canAccessCompanies: editingMember.canAccessCompanies ?? true,
              canAccessPeople: editingMember.canAccessPeople ?? true,
              canAccessLeads: editingMember.canAccessLeads ?? true,
              canAccessTasks: editingMember.canAccessTasks ?? true,
              visibilityScope: editingMember.visibilityScope ?? "GLOBAL",
              canCreate: editingMember.canCreate ?? true,
              canEdit: editingMember.canEdit ?? true,
              canDelete: editingMember.canDelete ?? false,
              canExport: editingMember.canExport ?? false,
            } : undefined
          }
        />
      )}
    </>
  );
}
