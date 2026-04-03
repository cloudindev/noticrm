"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, Search, User, Mail, CreditCard, Building, Settings, Blocks, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function SettingsSidebar({ tenantSlug }: { tenantSlug: string }) {
  const pathname = usePathname();

  const personalLinks = [
    { href: `/${tenantSlug}/settings/profile`, label: 'Perfil', icon: User },
    { href: `/${tenantSlug}/settings/emails`, label: 'Cuentas de email', icon: Mail },
  ];

  const workspaceLinks = [
    { href: `/${tenantSlug}/settings/general`, label: 'General', icon: Building },
    { href: `/${tenantSlug}/settings/members`, label: 'Miembros', icon: User },
    { href: `/${tenantSlug}/settings/ai`, label: 'Inteligencia artificial', icon: Sparkles },
    { href: `/${tenantSlug}/settings/plans`, label: 'Planes', icon: Blocks },
    { href: `/${tenantSlug}/settings/billing`, label: 'Facturación', icon: CreditCard },
  ];

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
            className="w-full bg-background pl-8 shadow-none h-8 text-xs border-border/60 rounded-md focus-visible:ring-1"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto py-2">
        {/* Personal Group */}
        <div className="px-4 mb-6">
          <h3 className="mb-2 text-xs font-semibold text-muted-foreground">Personal</h3>
          <nav className="flex flex-col gap-0.5">
            {personalLinks.map((link) => {
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

        {/* Workspace Group */}
        <div className="px-4 mb-6">
          <h3 className="mb-2 text-xs font-semibold text-muted-foreground">Espacio de trabajo</h3>
          <nav className="flex flex-col gap-0.5">
            {workspaceLinks.map((link) => {
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
      </div>
    </aside>
  );
}
