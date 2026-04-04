import React from 'react';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/lib/auth';
import { TasksClient } from '@/features/tasks/components/tasks-client';
import { format, isBefore, isToday, isTomorrow, startOfDay } from 'date-fns';

const prisma = new PrismaClient();

export const metadata = {
  title: 'Tareas | Noticrm',
  description: 'Gestiona tus tareas y seguimientos.',
};

export default async function TasksPage({ params }: { params: Promise<{ tenantSlug: string }> }) {
  const { tenantSlug } = await params;
  const session = await auth();
  
  if (!session?.user?.id) return <div>Unauthorized</div>;

  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
    include: { members: { where: { userId: session.user.id } } }
  });

  if (!tenant || tenant.members.length === 0) {
    return <div>Workspace not found or unauthorized access</div>;
  }

  const dbTasks = await prisma.task.findMany({
    where: { tenantId: tenant.id },
    include: {
      assignee: true,
    },
    orderBy: { dueDate: 'asc' },
  });

  const formattedTasks = dbTasks.map((task: any) => {
    let dueDateLabel = "Sin fecha";
    let dueColor = "text-muted-foreground";

    if (task.dueDate) {
      if (isToday(task.dueDate)) {
        dueDateLabel = "Hoy";
        dueColor = "text-orange-500 font-medium";
      } else if (isTomorrow(task.dueDate)) {
        dueDateLabel = "Mañana";
      } else if (isBefore(startOfDay(task.dueDate), startOfDay(new Date()))) {
        dueDateLabel = "Atrasada";
        dueColor = "text-red-500 font-medium";
      } else {
        dueDateLabel = format(task.dueDate, "MMM d");
      }
    }

    const assigneeName = task.assignee?.name || "Sin asignar";
    const initials = assigneeName.substring(0, 2).toUpperCase();

    return {
      id: task.id,
      title: task.title,
      completed: task.status === 'COMPLETED',
      dueDate: dueDateLabel,
      dueColor,
      record: task.relatedEntityId || "Ninguno",
      assignee: {
        name: assigneeName,
        initials,
        avatar: task.assignee?.image || ""
      }
    };
  });

  return (
    <div className="h-full w-full">
      <TasksClient initialTasks={formattedTasks} tenantSlug={tenantSlug} />
    </div>
  );
}
