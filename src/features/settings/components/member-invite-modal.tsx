"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, Target, CheckSquare, Shield, ShieldAlert, ArrowRight, Save, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import { inviteMemberAction, updateMemberPermissionsAction, type MemberPermissionsPayload } from '../members.actions';

interface MemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantSlug: string;
  mode: 'INVITE' | 'EDIT';
  membershipId?: string;
  initialEmail?: string;
  initialRole?: "ADMIN" | "MEMBER";
  initialPermissions?: MemberPermissionsPayload;
}

const defaultPermissions: MemberPermissionsPayload = {
  canAccessCompanies: true,
  canAccessPeople: true,
  canAccessLeads: true,
  canAccessTasks: true,
  visibilityScope: "GLOBAL",
  canCreate: true,
  canEdit: true,
  canDelete: false,
  canExport: false,
};

export function MemberInviteModal({ 
  open, 
  onOpenChange, 
  tenantSlug, 
  mode,
  membershipId,
  initialEmail = "",
  initialRole = "MEMBER",
  initialPermissions = defaultPermissions
}: MemberModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState(initialEmail);
  const [role, setRole] = useState<"ADMIN" | "MEMBER">(initialRole);
  const [perms, setPerms] = useState<MemberPermissionsPayload>(initialPermissions);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal closes/opens
  React.useEffect(() => {
    if (open) {
      setStep(1);
      setEmail(initialEmail);
      setRole(initialRole);
      setPerms(initialPermissions);
    }
  }, [open, initialEmail, initialRole, initialPermissions]);

  const handleNext = () => {
    if (mode === 'INVITE' && !email.includes('@')) {
      toast.error('Por favor introduce un email válido');
      return;
    }
    // Si es ADMIN, lo creamos/guardamos directamente porque tiene control total
    if (role === 'ADMIN') {
      submitData();
    } else {
      setStep(2);
    }
  };

  const submitData = async () => {
    if (mode === 'INVITE' && !email.trim()) return;
    setIsSubmitting(true);
    
    let result;
    if (mode === 'INVITE') {
      result = await inviteMemberAction(tenantSlug, email, role, perms);
    } else {
      if (!membershipId) return;
      result = await updateMemberPermissionsAction(tenantSlug, membershipId, role, perms);
    }

    setIsSubmitting(false);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success(mode === 'INVITE' ? "Invitación enviada por email." : "Permisos actualizados.");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 gap-0 overflow-hidden bg-background">
        
        {step === 1 && (
          <div className="flex flex-col">
            <div className="px-6 py-5 border-b border-border/40">
              <DialogTitle className="text-lg font-semibold">
                {mode === 'INVITE' ? 'Invitar al equipo' : 'Editar miembro'}
              </DialogTitle>
            </div>
            
            <div className="p-6 flex flex-col gap-6">
              {mode === 'INVITE' && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-muted-foreground">Dirección de correo electrónico</label>
                  <Input 
                    placeholder="email@empresa.com" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    className="h-10 border-border/60 shadow-sm" 
                  />
                </div>
              )}
              
              <div className="flex flex-col gap-3">
                <label className="text-xs font-semibold text-muted-foreground">Rol en la organización</label>
                
                <div 
                  onClick={() => setRole('ADMIN')}
                  className={`flex items-start gap-3 p-4 rounded-xl border ${role === 'ADMIN' ? 'border-[#2f6bff] bg-[#2f6bff]/5' : 'border-border/60 hover:bg-muted/30'} cursor-pointer transition-colors`}
                >
                  <ShieldAlert className={role === 'ADMIN' ? 'text-[#2f6bff]' : 'text-muted-foreground'} size={20} />
                  <div className="flex flex-col flex-1">
                    <span className="text-sm font-semibold text-foreground">Administrador</span>
                    <span className="text-xs text-muted-foreground mt-0.5">Acceso total a los ajustes de la organización, facturación y a todos los registros del CRM sin restricciones.</span>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 ${role === 'ADMIN' ? 'border-[#2f6bff]' : 'border-muted-foreground/30'}`}>
                    {role === 'ADMIN' && <div className="w-2 h-2 rounded-full bg-[#2f6bff]" />}
                  </div>
                </div>

                <div 
                  onClick={() => setRole('MEMBER')}
                  className={`flex items-start gap-3 p-4 rounded-xl border ${role === 'MEMBER' ? 'border-[#2f6bff] bg-[#2f6bff]/5' : 'border-border/60 hover:bg-muted/30'} cursor-pointer transition-colors`}
                >
                  <Shield className={role === 'MEMBER' ? 'text-[#2f6bff]' : 'text-muted-foreground'} size={20} />
                  <div className="flex flex-col flex-1">
                    <span className="text-sm font-semibold text-foreground">Miembro Estándar</span>
                    <span className="text-xs text-muted-foreground mt-0.5">Permite configurar granularmente qué secciones del CRM puede ver y si puede alterar registros de otros.</span>
                  </div>
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 ${role === 'MEMBER' ? 'border-[#2f6bff]' : 'border-muted-foreground/30'}`}>
                    {role === 'MEMBER' && <div className="w-2 h-2 rounded-full bg-[#2f6bff]" />}
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 flex justify-end border-t border-border/40 bg-muted/10">
              <Button 
                onClick={handleNext}
                disabled={isSubmitting || (mode==='INVITE' && !email)}
                className="bg-[#2f6bff] hover:bg-[#1a55e8] text-white shadow-sm gap-2"
              >
                {isSubmitting && role==='ADMIN' ? <Loader2 size={16} className="animate-spin" /> : null}
                {role === 'ADMIN' ? (mode === 'INVITE' ? 'Enviar Invitación' : 'Guardar') : 'Continuar a Permisos'}
                {role === 'MEMBER' && <ArrowRight size={16} />}
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col max-h-[85vh]">
            <div className="px-6 py-5 border-b border-border/40 flex items-center gap-3 shrink-0">
              <button 
                onClick={() => setStep(1)} 
                className="p-1 hover:bg-muted rounded-md text-muted-foreground transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
              <div className="flex flex-col">
                <DialogTitle className="text-lg font-semibold">Configurar Permisos</DialogTitle>
                <span className="text-xs text-muted-foreground">{email || "Miembro"}</span>
              </div>
            </div>

            <div className="p-6 flex flex-col gap-8 overflow-y-auto w-full">
              
              {/* Scope & Visibilidad */}
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Nivel de Visibilidad (Scope)</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Define si el usuario puede ver la red completa de la empresa o requiere que le asignen records.</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div 
                    onClick={() => setPerms((p: MemberPermissionsPayload) => ({...p, visibilityScope: "GLOBAL"}))}
                    className={`flex flex-col gap-1.5 p-3 rounded-lg border ${perms.visibilityScope === 'GLOBAL' ? 'border-[#2f6bff] bg-[#2f6bff]/5' : 'border-border/60 hover:bg-muted/30'} cursor-pointer text-center`}
                  >
                    <span className="text-sm font-semibold text-foreground">Global</span>
                    <span className="text-[11px] text-muted-foreground">Puede ver todos los registros del CRM (de las secciones permitidas).</span>
                  </div>
                  <div 
                    onClick={() => setPerms((p: MemberPermissionsPayload) => ({...p, visibilityScope: "OWNED"}))}
                    className={`flex flex-col gap-1.5 p-3 rounded-lg border ${perms.visibilityScope === 'OWNED' ? 'border-[#2f6bff] bg-[#2f6bff]/5' : 'border-border/60 hover:bg-muted/30'} cursor-pointer text-center`}
                  >
                    <span className="text-sm font-semibold text-foreground">Restringida</span>
                    <span className="text-[11px] text-muted-foreground">Solo ve los registros en los que figura como Asignado / Ownership.</span>
                  </div>
                </div>
              </div>

              {/* Secciones Habilitadas */}
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Módulos Habilitados</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Controla qué enlaces aparecen en la barra lateral del miembro y a qué datos puede acceder.</p>
                </div>
                
                <div className="flex flex-col border border-border/60 rounded-xl divide-y divide-border/40 overflow-hidden">
                  <div className="flex items-center justify-between p-3 bg-background">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-md bg-[#2f6bff]/10 text-[#2f6bff] flex items-center justify-center"><Building2 size={13} /></div>
                      <span className="text-[13px] font-medium text-foreground">Empresas</span>
                    </div>
                    <Switch checked={perms.canAccessCompanies} onCheckedChange={(v) => setPerms((p: MemberPermissionsPayload) => ({...p, canAccessCompanies: v}))} />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-md bg-[#2f6bff]/10 text-[#2f6bff] flex items-center justify-center"><Users size={13} /></div>
                      <span className="text-[13px] font-medium text-foreground">Personas</span>
                    </div>
                    <Switch checked={perms.canAccessPeople} onCheckedChange={(v) => setPerms((p: MemberPermissionsPayload) => ({...p, canAccessPeople: v}))} />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-md bg-[#f26522]/10 text-[#f26522] flex items-center justify-center"><Target size={13} /></div>
                      <span className="text-[13px] font-medium text-foreground">Oportunidades</span>
                    </div>
                    <Switch checked={perms.canAccessLeads} onCheckedChange={(v) => setPerms((p: MemberPermissionsPayload) => ({...p, canAccessLeads: v}))} />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-md border text-foreground flex items-center justify-center"><CheckSquare size={13} /></div>
                      <span className="text-[13px] font-medium text-foreground">Gestión de Tareas</span>
                    </div>
                    <Switch checked={perms.canAccessTasks} onCheckedChange={(v) => setPerms((p: MemberPermissionsPayload) => ({...p, canAccessTasks: v}))} />
                  </div>
                </div>
              </div>

              {/* Acciones Operativas */}
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Derechos sobre registros</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Qué interacciones permite el sistema (asumiendo que tiene acceso visual).</p>
                </div>
                
                <div className="grid grid-cols-2 gap-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Switch checked={perms.canCreate} onCheckedChange={(v) => setPerms((p: MemberPermissionsPayload) => ({...p, canCreate: v}))} />
                    <span className="text-[13px] font-medium text-foreground">Crear nuevos registros</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Switch checked={perms.canEdit} onCheckedChange={(v) => setPerms((p: MemberPermissionsPayload) => ({...p, canEdit: v}))} />
                    <span className="text-[13px] font-medium text-foreground">Editar registros</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Switch checked={perms.canDelete} onCheckedChange={(v) => setPerms((p: MemberPermissionsPayload) => ({...p, canDelete: v}))} />
                    <span className="text-[13px] font-medium text-destructive">Borrar registros</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Switch checked={perms.canExport} onCheckedChange={(v) => setPerms((p: MemberPermissionsPayload) => ({...p, canExport: v}))} />
                    <span className="text-[13px] font-medium text-foreground">Exportar bases CSV</span>
                  </label>
                </div>
              </div>

            </div>

            <div className="px-6 py-4 flex items-center justify-between border-t border-border/40 bg-muted/10 shrink-0">
              <span className="text-xs text-muted-foreground">Revisar matriz de seguridad con cuidado.</span>
              <Button 
                onClick={submitData}
                disabled={isSubmitting}
                className="bg-[#2f6bff] hover:bg-[#1a55e8] text-white shadow-sm gap-2 w-[160px]"
              >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {mode === 'INVITE' ? 'Finalizar Invitación' : 'Guardar Todo'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
