import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Search, User, Mail, CreditCard, Building, Settings, Blocks } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default async function SettingsLayoutWrapper({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tenantSlug: string }>;
}) {
  const { tenantSlug } = await params;

  return (
    <div className="fixed inset-0 z-50 flex bg-background h-screen w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      {/* Settings Left Sidebar */}
      <aside className="w-[280px] h-full border-r border-border/40 bg-[#fafafa] dark:bg-[#0a0a0a] flex flex-col shrink-0">
        <div className="flex h-14 items-center px-4 border-b border-border/40 shrink-0">
          <Link 
            href={`/${tenantSlug}/home`} 
            className="flex items-center gap-2 text-sm font-semibold hover:text-muted-foreground transition-colors"
          >
            <ChevronLeft size={16} className="text-muted-foreground" />
            Settings
          </Link>
        </div>
        
        <div className="p-4 shrink-0">
          <div className="relative">
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search settings..."
              className="w-full bg-background pl-8 shadow-none h-8 text-xs border-border/60 rounded-md focus-visible:ring-1"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto py-2">
          {/* Personal Group */}
          <div className="px-4 mb-6">
            <h3 className="mb-2 text-xs font-semibold text-muted-foreground">Personal</h3>
            <nav className="flex flex-col gap-0.5">
              <Link 
                href={`/${tenantSlug}/settings/profile`}
                className="flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm outline-none bg-black/5 dark:bg-white/10 font-medium"
              >
                <User size={15} className="text-muted-foreground" />
                Profile
              </Link>
              <Link 
                href={`/${tenantSlug}/settings/emails`}
                className="flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm outline-none hover:bg-black/5 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground"
              >
                <Mail size={15} className="text-muted-foreground" />
                Email accounts
              </Link>
            </nav>
          </div>

          {/* Workspace Group */}
          <div className="px-4 mb-6">
            <h3 className="mb-2 text-xs font-semibold text-muted-foreground">Workspace</h3>
            <nav className="flex flex-col gap-0.5">
              <Link 
                href={`/${tenantSlug}/settings/general`}
                className="flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm outline-none hover:bg-black/5 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground"
              >
                <Building size={15} className="text-muted-foreground" />
                General
              </Link>
              <Link 
                href={`/${tenantSlug}/settings/members`}
                className="flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm outline-none hover:bg-black/5 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground"
              >
                <User size={15} className="text-muted-foreground" />
                Members
              </Link>
              <Link 
                href={`/${tenantSlug}/settings/plans`}
                className="flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm outline-none hover:bg-black/5 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground"
              >
                <Blocks size={15} className="text-muted-foreground" />
                Plans
              </Link>
              <Link 
                href={`/${tenantSlug}/settings/billing`}
                className="flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm outline-none hover:bg-black/5 dark:hover:bg-white/10 text-muted-foreground hover:text-foreground"
              >
                <CreditCard size={15} className="text-muted-foreground" />
                Billing
              </Link>
            </nav>
          </div>
        </div>
      </aside>

      {/* Settings Main Content */}
      <main className="flex-1 h-full overflow-y-auto bg-background">
        {children}
      </main>
    </div>
  );
}
