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
import { redirect, notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function AppLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ tenantSlug: string }>;
}) {
  const { tenantSlug } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  // Cross-check if user actually belongs to this workspace
  const membership = await prisma.membership.findFirst({
    where: {
      userId: session.user.id,
      tenant: { slug: tenantSlug }
    }
  });

  if (!membership) {
    // Attempt rescue to their valid workspace
    const validMembership = await prisma.membership.findFirst({
      where: { userId: session.user.id },
      include: { tenant: true }
    });
    
    if (validMembership) {
      redirect(`/${validMembership.tenant.slug}/home`);
    }
    
    notFound();
  }

  const userName = session.user.name || "User Name";
  const userEmail = session.user.email || "user@example.com";
  const initials = userName.charAt(0).toUpperCase();

  // Get uncompleted tasks count
  const uncompletedTasksCount = await prisma.task.count({
    where: {
      tenantId: membership.tenantId,
      status: { not: "COMPLETED" },
    }
  });

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
            <SidebarNavItem 
              icon={<CheckSquare size={18} />} 
              label="Tasks" 
              href={`/${tenantSlug}/tasks`} 
              badge={uncompletedTasksCount > 0 ? uncompletedTasksCount : undefined} 
            />
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
        <main className="flex-1 overflow-y-auto bg-background p-4 lg:p-8">
          <div className="mx-auto max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

