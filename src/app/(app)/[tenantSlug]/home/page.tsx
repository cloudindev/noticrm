import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, ArrowUp, Zap } from 'lucide-react';
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from 'next/link';

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
    },
    include: { tenant: true }
  });

  if (!membership) {
    redirect(`/${tenantSlug}/onboarding`);
  }

  const hasAiConfigured = Boolean((membership.tenant as any).geminiApiKey && (membership.tenant as any).aiEnabled);
  const userName = session.user.name?.split(' ')[0] || "User";

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl mx-auto p-6 md:p-8 h-[calc(100vh-2rem)]">
      {/* Columna Principal - Chat IA */}
      <div className="flex-1 flex flex-col gap-4 relative">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Buenas tardes, {userName}.
          </h1>
          <p className="mt-2 text-muted-foreground">
            Entorno RAG (Generación Aumentada por Recuperación) privado.
          </p>
        </header>

        <Card className="flex-1 flex flex-col justify-end p-4 border-border/40 bg-card shadow-sm rounded-xl relative overflow-hidden min-h-[400px]">
          {!hasAiConfigured && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/60 backdrop-blur-sm rounded-xl">
               <Card className="p-8 max-w-md text-center border-border/50 shadow-md">
                 <Zap className="w-10 h-10 text-amber-500 mx-auto mb-4" />
                 <h3 className="text-lg font-semibold mb-2">IA No Configurada</h3>
                 <p className="text-sm text-muted-foreground mb-6">
                   Actualmente el módulo de Inteligencia Artificial está desactivado. Para interactuar con tus datos, añade una clave de API de Gemini.
                 </p>
                 <Link href={`/${tenantSlug}/settings/ai`}>
                   <Button className="w-full">Configurar API de IA</Button>
                 </Link>
               </Card>
            </div>
          )}

          {/* Chat messages area placeholder */}
          <div className="flex-1 overflow-y-auto mb-4 p-2">
            {/* Messages will render here */}
          </div>

          {/* Chat Input */}
          <div className="relative border rounded-xl bg-background border-border/60 shadow-sm focus-within:ring-1 focus-within:ring-primary/20 transition-all flex items-end overflow-hidden">
             <textarea 
               placeholder="Pregunta cualquier cosa sobre tus datos..." 
               className="w-full min-h-[80px] max-h-[200px] resize-none bg-transparent p-4 outline-none text-sm"
             />
             <div className="absolute bottom-3 right-3 flex items-center gap-2">
               <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-muted/50 text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground">
                 <span>Auto</span>
                 <MessageSquare size={12} />
               </div>
               <Button size="icon" className="h-8 w-8 rounded-lg">
                 <ArrowUp size={16} />
               </Button>
             </div>
          </div>
        </Card>
      </div>

      {/* Columna Lateral - Historial y Tareas */}
      <div className="w-full lg:w-80 flex flex-col gap-8 shrink-0">
         <div>
           <div className="flex items-center gap-2 mb-3 px-1 text-sm font-semibold text-muted-foreground">
             <MessageSquare size={14} />
             <span>Chats</span>
           </div>
           <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/30 border border-border/40 hover:bg-muted/50 cursor-pointer transition-colors text-sm font-medium">
                 <MessageSquare size={14} className="text-muted-foreground" />
                 <span className="truncate">¿Tengo tareas para hoy?</span>
              </div>
           </div>
         </div>

         <div className="flex-1">
            <div className="flex items-center gap-2 mb-3 px-1 text-sm font-semibold text-foreground">
               <span>Próximas Tareas</span>
            </div>
            <div className="flex flex-col gap-3">
               <TaskItem title="Follow up email to John" due="Hoy" priority="Alto" />
               <TaskItem title="Prepare Q3 presentation" due="Mañana" priority="Medio" />
               <TaskItem title="Sync with marketing" due="Próx Semana" priority="Bajo" />
            </div>
         </div>
      </div>
    </div>
  );
}

function TaskItem({ title, due, priority }: { title: string, due: string, priority: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/40 p-3 bg-card shadow-sm hover:shadow transition-shadow">
      <div className="flex items-center gap-3">
        <input type="checkbox" className="h-4 w-4 rounded border-input text-primary" />
        <span className="text-sm font-medium">{title}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground font-medium">{due}</span>
      </div>
    </div>
  );
}
