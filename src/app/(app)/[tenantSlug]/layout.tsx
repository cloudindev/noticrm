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
import { CollapsibleSection } from "@/components/app/collapsible-section";
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
    },
    include: { tenant: true }
  });

  if (!membership) {
    // Attempt rescue to their valid workspace
    const validMembership = await prisma.membership.findFirst({
      where: { userId: session.user.id },
      include: { tenant: true }
    });
    
    if (validMembership) {
      redirect(`/${validMembership.tenant.slug}/home`);
    } else {
      // If absolutely no memberships, they need to onboard
      redirect("/onboarding");
    }
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
            {membership.tenant.logoUrl ? (
              <img 
                src={membership.tenant.logoUrl} 
                alt={membership.tenant.name} 
                className="h-6 w-6 object-cover rounded bg-primary/10"
              />
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-[10px] text-primary-foreground font-mono">
                {membership.tenant.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="truncate text-sm">{membership.tenant.name}</span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-auto py-2">
          <nav className="flex flex-col gap-[2px] px-2 mt-2">
            <SidebarNavItem icon={<Home size={16} />} label="Inicio" href={`/${tenantSlug}/home`} />
            
            {/* Tareas */}
            {(membership.role === 'OWNER' || membership.role === 'ADMIN' || membership.canAccessTasks) && (
              <SidebarNavItem 
                icon={<CheckSquare size={16} />} 
                label="Tareas" 
                href={`/${tenantSlug}/tasks`} 
                badge={uncompletedTasksCount > 0 ? uncompletedTasksCount : undefined} 
              />
            )}
            
            <SidebarNavItem icon={<Mail size={16} />} label="Correos" href={`/${tenantSlug}/emails`} />
            
            <CollapsibleSection title="Registros">
              {(membership.role === 'OWNER' || membership.role === 'ADMIN' || membership.canAccessCompanies) && (
                <SidebarNavItem 
                  icon={<div className="flex h-[18px] w-[18px] items-center justify-center rounded-[5px] bg-[#2f6bff] text-white shadow-sm"><Building2 size={12} strokeWidth={2.5} /></div>} 
                  label="Empresas" 
                  href={`/${tenantSlug}/companies`} 
                />
              )}
              
              {(membership.role === 'OWNER' || membership.role === 'ADMIN' || membership.canAccessPeople) && (
                <SidebarNavItem 
                  icon={<div className="flex h-[18px] w-[18px] items-center justify-center rounded-[5px] bg-[#2f6bff] text-white shadow-sm"><Users size={12} strokeWidth={2.5} /></div>} 
                  label="Personas" 
                  href={`/${tenantSlug}/people`} 
                />
              )}
              
              {(membership.role === 'OWNER' || membership.role === 'ADMIN' || membership.canAccessLeads) && (
                <SidebarNavItem 
                  icon={<div className="flex h-[18px] w-[18px] items-center justify-center rounded-[5px] bg-[#f26522] text-white shadow-sm"><Target size={12} strokeWidth={2.5} /></div>} 
                  label="Oportunidades" 
                  href={`/${tenantSlug}/leads`} 
                />
              )}
            </CollapsibleSection>
            
            <CollapsibleSection title="Analíticas">
              {(membership.role === 'OWNER' || membership.role === 'ADMIN') && (
                <SidebarNavItem icon={<BarChart2 size={16} />} label="Informes" href={`/${tenantSlug}/reports`} />
              )}
            </CollapsibleSection>
          </nav>
        </div>
        
        {(membership.role === 'OWNER' || membership.role === 'ADMIN') && (
          <div className="px-2 mb-2">
            <SidebarNavItem icon={<Blocks size={16} />} label="Marketplace" href={`/${tenantSlug}/marketplace`} />
          </div>
        )}

        <div className="mt-auto border-t border-border/40 p-2">
          <UserProfileDropdown 
            userName={userName} 
            userEmail={userEmail} 
            initials={initials} 
            tenantSlug={tenantSlug}
          />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto bg-background">
          <div className="mx-auto h-full w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

