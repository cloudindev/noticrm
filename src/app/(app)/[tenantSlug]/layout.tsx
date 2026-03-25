import React from 'react';
import Link from 'next/link';
import { 
  Home, 
  CheckSquare, 
  Mail, 
  BarChart2, 
  Building2, 
  Users, 
  Target,
  Search,
  Settings,
  Menu
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function AppLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tenantSlug: string }>;
}) {
  const { tenantSlug } = await params;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="hidden w-[240px] flex-col border-r border-border/40 bg-sidebar sm:flex">
        <div className="flex h-14 items-center border-b border-border/40 px-4">
          <Link href={`/${tenantSlug}/home`} className="flex items-center gap-2 font-semibold">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-[10px] text-primary-foreground font-mono">
              N/
            </div>
            <span className="truncate text-sm">{tenantSlug}</span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-auto py-4">
          <nav className="flex flex-col gap-1 px-2">
            <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
              Workspace
            </div>
            <SidebarItem icon={<Home size={18} />} label="Home" href={`/${tenantSlug}/home`} active />
            <SidebarItem icon={<CheckSquare size={18} />} label="Tasks" href={`/${tenantSlug}/tasks`} />
            <SidebarItem icon={<Mail size={18} />} label="Emails" href={`/${tenantSlug}/emails`} />
            
            <div className="mb-2 mt-4 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
              Records
            </div>
            <SidebarItem icon={<Building2 size={18} />} label="Companies" href={`/${tenantSlug}/companies`} />
            <SidebarItem icon={<Users size={18} />} label="People" href={`/${tenantSlug}/people`} />
            <SidebarItem icon={<Target size={18} />} label="Leads" href={`/${tenantSlug}/leads`} />
            
            <div className="mb-2 mt-4 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
              Analytics
            </div>
            <SidebarItem icon={<BarChart2 size={18} />} label="Reports" href={`/${tenantSlug}/reports`} />
          </nav>
        </div>
        
        <div className="flex items-center gap-3 border-t border-border/40 p-4">
          <Avatar className="h-8 w-8 rounded-md">
            <AvatarImage src="" alt="User" />
            <AvatarFallback className="rounded-md bg-primary/10 text-xs">U</AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-sm font-medium">User Name</span>
            <span className="truncate text-xs text-muted-foreground">user@example.com</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center justify-between border-b border-border/40 bg-background/95 px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <button className="sm:hidden text-muted-foreground">
              <Menu size={20} />
            </button>
            <div className="relative hidden max-w-md sm:flex items-center">
              <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search anything... (⌘K)"
                className="flex h-9 w-[300px] rounded-md border border-input bg-transparent px-3 py-1 pl-9 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-muted-foreground hover:text-foreground">
              <Settings size={20} />
            </button>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto bg-muted/20 p-4 lg:p-8">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, href, active }: { icon: React.ReactNode, label: string, href: string, active?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
        active 
          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
          : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
      }`}
    >
      {icon}
      <span>{label}</span>
      {active && <div className="ml-auto h-2 w-2 rounded-full bg-primary" />}
    </Link>
  );
}
