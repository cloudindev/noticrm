import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Users, Building2, CheckSquare } from 'lucide-react';
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export default async function TenantDashboardHome({ params }: { params: Promise<{ tenantSlug: string }> }) {
  const { tenantSlug } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  const membership = await prisma.membership.findFirst({
    where: {
      userId: session.user.id,
      tenant: { slug: tenantSlug }
    }
  });

  if (!membership) {
    redirect(`/${tenantSlug}/onboarding`);
  }

  const isAdmin = membership.role === 'OWNER' || membership.role === 'ADMIN';
  const showPeople = isAdmin || membership.canAccessPeople;
  const showCompanies = isAdmin || membership.canAccessCompanies;
  const showLeads = isAdmin || membership.canAccessLeads;
  const showTasks = isAdmin || membership.canAccessTasks;

  const userName = session.user.name?.split(' ')[0] || "User";

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto p-6 md:p-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Buenas tardes, {userName}.
        </h1>
        <p className="mt-2 text-muted-foreground">
          Este es un resumen de lo que ocurre en tu espacio de trabajo.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {showPeople && (
          <MetricCard title="Total Personas" value="2,350" icon={<Users className="h-4 w-4 text-muted-foreground" />} trend="+12% mensual" />
        )}
        {showCompanies && (
          <MetricCard title="Empresas" value="430" icon={<Building2 className="h-4 w-4 text-muted-foreground" />} trend="+4% mensual" />
        )}
        {showLeads && (
          <MetricCard title="Oportunidades Activas" value="84" icon={<Target className="h-4 w-4 text-muted-foreground" />} trend="+2 nuevas esta sem..." />
        )}
        {showTasks && (
          <MetricCard title="Tareas Pendientes" value="12" icon={<CheckSquare className="h-4 w-4 text-muted-foreground" />} trend="3 vencen hoy" />
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-border/40 bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-medium">Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              {showLeads && <ActivityItem text="Meeting with Acme Corp scheduled" time="hace 2h" />}
              {showLeads && <ActivityItem text="New lead assigned from website" time="hace 5h" />}
              {showTasks && <ActivityItem text="Task 'Send proposal' completed" time="hace 1d" />}
              {showCompanies && <ActivityItem text="Deal won with Tech Enterprise" time="hace 2d" />}
              {(!showLeads && !showTasks && !showCompanies) && (
                <p className="text-sm text-muted-foreground">No tienes permisos para ver las actividades recientes.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {showTasks && (
          <Card className="col-span-3 border-border/40 bg-card shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-medium">Próximas Tareas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                 <TaskItem title="Follow up email to John" due="Hoy" priority="Alto" />
                 <TaskItem title="Prepare Q3 presentation" due="Mañana" priority="Medio" />
                 <TaskItem title="Sync with marketing" due="Próx Semana" priority="Bajo" />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend: string }) {
  return (
    <Card className="border-border/40 bg-card shadow-sm transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">
          {trend}
        </p>
      </CardContent>
    </Card>
  );
}

function ActivityItem({ text, time }: { text: string, time: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="mt-0.5 h-2 w-2 rounded-full bg-primary" />
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium leading-none">{text}</p>
        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  );
}

function TaskItem({ title, due, priority }: { title: string, due: string, priority: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/40 p-3">
      <div className="flex items-center gap-3">
        <input type="checkbox" className="h-4 w-4 rounded border-input text-primary" />
        <span className="text-sm font-medium">{title}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">{due}</span>
      </div>
    </div>
  );
}
