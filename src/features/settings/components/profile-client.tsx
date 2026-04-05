"use client";

import React, { useState } from 'react';
import { AvatarUpload } from './avatar-upload';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User } from '@prisma/client';
import { toast } from 'sonner';
import { updateProfileDetails } from '../actions';

interface ProfileClientProps {
  tenantSlug: string;
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

export function ProfileClient({ tenantSlug, user }: ProfileClientProps) {
  const [userName, setUserName] = useState(user.name || "Usuario NotiCRM");
  const [email, setEmail] = useState(user.email || "");
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const userInitials = userName.substring(0, 2).toUpperCase();

  async function handleSaveDetails() {
    setIsLoading(true);
    const fd = new FormData();
    fd.append("name", userName);
    fd.append("email", email);

    const res = await updateProfileDetails(tenantSlug, fd);
    setIsLoading(false);
    
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Perfil actualizado correctamente");
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">Perfil Personal</h2>
        <p className="text-sm text-muted-foreground">Gestiona tus datos personales y preferencias de la cuenta.</p>
      </div>

      <div className="bg-card border border-border/80 rounded-xl overflow-hidden shadow-[0_2px_10px_rgb(0,0,0,0.02)]">
        <div className="p-6 border-b border-border/40">
          <AvatarUpload 
            currentImageUrl={user.image} 
            userName={userName} 
            userInitials={userInitials} 
            tenantSlug={tenantSlug}
          />
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Nombre completo</label>
              <Input 
                value={userName} 
                onChange={(e) => setUserName(e.target.value)} 
                className="h-9 shadow-sm" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Correo electrónico</label>
              <div className="relative">
                <Input 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  disabled={!isEditingEmail} 
                  className={`h-9 shadow-sm pr-16 ${!isEditingEmail ? "bg-muted/30" : ""}`} 
                />
                <button 
                  type="button"
                  onClick={() => setIsEditingEmail(!isEditingEmail)}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[11px] font-medium text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-muted transition-colors"
                >
                  {isEditingEmail ? "Hecho" : "Editar"}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Idioma</label>
              <select className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-[13px] shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                <option>Español</option>
                <option>English</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">Zona horaria</label>
              <select className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-[13px] shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                <option>(GMT+01:00) Madrid</option>
                <option>(GMT+00:00) Londres</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="p-4 px-6 bg-muted/20 border-t border-border/40 flex justify-end">
          <Button 
            onClick={handleSaveDetails} 
            disabled={isLoading}
            size="sm" 
            className="bg-foreground text-background hover:bg-foreground/90 font-medium h-8"
          >
            {isLoading ? "Guardando..." : "Guardar cambios"}
          </Button>
        </div>
      </div>
      
      {/* Zona de peligro */}
      <div className="bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-900/30 rounded-xl overflow-hidden flex flex-col sm:flex-row items-center justify-between p-6 gap-4">
        <div>
          <h3 className="text-sm font-semibold text-red-600 dark:text-red-400">Eliminar cuenta</h3>
          <p className="text-sm text-muted-foreground mt-1">Borra permanentemente tu cuenta y toda su información. Esta acción no se puede deshacer.</p>
        </div>
        <Button variant="destructive" size="sm" className="shrink-0 h-8 font-medium">
          Eliminar cuenta
        </Button>
      </div>
    </div>
  );
}
