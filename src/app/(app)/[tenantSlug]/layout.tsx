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
  Blocks,
  ChevronDown
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
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-[10px] text-primary-foreground font-mono">
              N/
            </div>
            <span className="truncate text-sm">{tenantSlug}</span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-auto py-2">
          <nav className="flex flex-col gap-[2px] px-2">
            <div className="mb-1 mt-2 px-3 text-[13px] font-medium text-muted-foreground/80 flex justify-between items-center group cursor-pointer hover:text-foreground">
              Espacio de trabajo
              <ChevronDown size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <SidebarNavItem icon={<Home size={18} />} label="Inicio" href={`/${tenantSlug}/home`} />
            <SidebarNavItem 
              icon={<CheckSquare size={18} />} 
              label="Tareas" 
              href={`/${tenantSlug}/tasks`} 
              badge={uncompletedTasksCount > 0 ? uncompletedTasksCount : undefined} 
            />
            <SidebarNavItem icon={<Mail size={18} />} label="Correos" href={`/${tenantSlug}/emails`} />
            
            <div className="mb-1 mt-6 px-3 text-[13px] font-medium text-muted-foreground/80 flex justify-between items-center group cursor-pointer hover:text-foreground">
              Registros
              <ChevronDown size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <SidebarNavItem 
              icon={<div className="flex h-5 w-5 items-center justify-center rounded-[5px] bg-[#2f6bff] text-white shadow-sm"><Building2 size={13} strokeWidth={2.5} /></div>} 
              label="Empresas" 
              href={`/${tenantSlug}/companies`} 
            />
            <SidebarNavItem 
              icon={<div className="flex h-5 w-5 items-center justify-center rounded-[5px] bg-[#2f6bff] text-white shadow-sm"><Users size={13} strokeWidth={2.5} /></div>} 
              label="Personas" 
              href={`/${tenantSlug}/people`} 
            />
            <SidebarNavItem 
              icon={<div className="flex h-5 w-5 items-center justify-center rounded-[5px] bg-[#f26522] text-white shadow-sm"><Target size={13} strokeWidth={2.5} /></div>} 
              label="Oportunidades" 
              href={`/${tenantSlug}/leads`} 
            />
            
            <div className="mb-1 mt-6 px-3 text-[13px] font-medium text-muted-foreground/80 flex justify-between items-center group cursor-pointer hover:text-foreground">
              Analíticas
              <ChevronDown size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <SidebarNavItem icon={<BarChart2 size={18} />} label="Informes" href={`/${tenantSlug}/reports`} />
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

