"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, Search, User, Mail, CreditCard, Building, Settings, Blocks, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function SettingsSidebar({ tenantSlug }: { tenantSlug: string }) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = React.useState('');

  const personalLinks = [
    { href: `/${tenantSlug}/settings/profile`, label: 'Perfil', icon: User, keywords: 'perfil nombre apellido email foto avatar guardar cambios personal contraseña reset' },
    { href: `/${tenantSlug}/settings/emails`, label: 'Cuentas de email', icon: Mail, keywords: 'cuentas de email correo bandeja smtp imap conexión conectividad seguridad tls puertos' },
  ];

  const workspaceLinks = [
    { href: `/${tenantSlug}/settings/general`, label: 'General', icon: Building, keywords: 'general exportar datos csv base de datos zona de peligro borrar cuenta espacio de trabajo configuracion nombre logo' },
    { href: `/${tenantSlug}/settings/members`, label: 'Miembros', icon: User, keywords: 'miembros roles permisos administrador propietario usuario invitar equipo invitacion correo unirse añadir' },
    { href: `/${tenantSlug}/settings/ai`, label: 'Inteligencia artificial', icon: Sparkles, keywords: 'inteligencia artificial ia ai api key llm openai gemini procesamiento tokens habilitar claude gpt modelos modelo' },
    { href: `/${tenantSlug}/settings/plans`, label: 'Planes', icon: Blocks, keywords: 'planes pro premium enterprise suscripcion actualizar downgrade upgrade anual mensual precio limites pago' },
    { href: `/${tenantSlug}/settings/billing`, label: 'Facturación', icon: CreditCard, keywords: 'facturación billing tarjeta metodos de pago recibos historial facturas pagos cobros stripe card visa mastercard iva vat impuesto' },
  ];

  const filterLinks = (links: typeof personalLinks) => {
    if (!searchQuery) return links;
    const lowerQuery = searchQuery.toLowerCase();
    return links.filter(link => 
      link.label.toLowerCase().includes(lowerQuery) || 
      link.keywords.toLowerCase().includes(lowerQuery)
    );
  };

  const filteredPersonalLinks = filterLinks(personalLinks);
  const filteredWorkspaceLinks = filterLinks(workspaceLinks);

  return (
    <aside className="w-[280px] h-full border-r border-border/40 bg-[#fafafa] dark:bg-[#0a0a0a] flex flex-col shrink-0">
      <div className="flex h-14 items-center px-4 border-b border-border/40 shrink-0">
        <Link 
          href={`/${tenantSlug}/home`} 
          className="flex items-center gap-2 text-sm font-semibold hover:text-muted-foreground transition-colors"
        >
          <ChevronLeft size={16} className="text-muted-foreground" />
          Ajustes
        </Link>
      </div>
      
      <div className="p-4 shrink-0">
        <div className="relative">
          <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar ajustes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background pl-8 shadow-none h-8 text-xs border-border/60 rounded-md focus-visible:ring-1"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto py-2">
        {/* Personal Group */}
        {filteredPersonalLinks.length > 0 && (
          <div className="px-4 mb-6">
            <h3 className="mb-2 text-xs font-semibold text-muted-foreground">Personal</h3>
            <nav className="flex flex-col gap-0.5">
              {filteredPersonalLinks.map((link) => {
                const active = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link 
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm outline-none transition-colors ${
                      active 
                        ? 'bg-black/5 dark:bg-white/10 font-medium text-foreground' 
                        : 'text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10 hover:text-foreground'
                    }`}
                  >
                    <Icon size={15} className={active ? "text-foreground" : "text-muted-foreground"} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        {/* Workspace Group */}
        {filteredWorkspaceLinks.length > 0 && (
          <div className="px-4 mb-6">
            <h3 className="mb-2 text-xs font-semibold text-muted-foreground">Espacio de trabajo</h3>
            <nav className="flex flex-col gap-0.5">
              {filteredWorkspaceLinks.map((link) => {
                const active = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link 
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm outline-none transition-colors ${
                      active 
                        ? 'bg-black/5 dark:bg-white/10 font-medium text-foreground' 
                        : 'text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10 hover:text-foreground'
                    }`}
                  >
                    <Icon size={15} className={active ? "text-foreground" : "text-muted-foreground"} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        {/* Empty State */}
        {searchQuery && filteredPersonalLinks.length === 0 && filteredWorkspaceLinks.length === 0 && (
          <div className="px-4 text-center mt-4 text-sm text-muted-foreground">
            No se encontraron ajustes para "{searchQuery}"
          </div>
        )}
      </div>
    </aside>
  );
}
