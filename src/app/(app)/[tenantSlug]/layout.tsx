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
  Menu,
  Blocks
} from 'lucide-react';
import { SidebarNavItem } from "@/components/app/sidebar-nav-item";
import { UserProfileDropdown } from "@/components/app/user-profile-dropdown";
import { auth } from "@/lib/auth";

export default async function AppLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tenantSlug: string }>;
}) {
  const { tenantSlug } = await params;
  const session = await auth();
  const userName = session?.user?.name || "User Name";
  const userEmail = session?.user?.email || "user@example.com";
  const initials = userName.charAt(0).toUpperCase();

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
            <SidebarNavItem icon={<Home size={18} />} label="Home" href={`/${tenantSlug}/home`} />
            <SidebarNavItem icon={<CheckSquare size={18} />} label="Tasks" href={`/${tenantSlug}/tasks`} />
            <SidebarNavItem icon={<Mail size={18} />} label="Emails" href={`/${tenantSlug}/emails`} />
            
            <div className="mb-2 mt-4 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
              Records
            </div>
            <SidebarNavItem icon={<Building2 size={18} />} label="Companies" href={`/${tenantSlug}/companies`} />
            <SidebarNavItem icon={<Users size={18} />} label="People" href={`/${tenantSlug}/people`} />
            <SidebarNavItem icon={<Target size={18} />} label="Leads" href={`/${tenantSlug}/leads`} />
            
            <div className="mb-2 mt-4 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
              Analytics
            </div>
            <SidebarNavItem icon={<BarChart2 size={18} />} label="Reports" href={`/${tenantSlug}/reports`} />
          </nav>
        </div>
        
        <div className="px-2 mb-2">
          <SidebarNavItem icon={<Blocks size={18} />} label="Marketplace" href={`/${tenantSlug}/marketplace`} />
        </div>

        <div className="mt-auto border-t border-border/40 p-2">
          <UserProfileDropdown 
            userName={userName} 
            userEmail={userEmail} 
            initials={initials} 
          />
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

