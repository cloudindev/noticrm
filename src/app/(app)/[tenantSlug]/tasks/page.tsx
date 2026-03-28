import React from 'react';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/lib/auth';
import { TasksClient } from '@/features/tasks/components/tasks-client';
import { format, isPast, isToday, isTomorrow } from 'date-fns';

const prisma = new PrismaClient();

export const metadata = {
  title: 'Tasks | Noticrm',
  description: 'Manage your tasks and follow-ups.',
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
    let dueDateLabel = "No date";
    let dueColor = "text-muted-foreground";

    if (task.dueDate) {
      if (isToday(task.dueDate)) {
        dueDateLabel = "Today";
        dueColor = "text-orange-500 font-medium";
      } else if (isTomorrow(task.dueDate)) {
        dueDateLabel = "Tomorrow";
      } else if (isPast(task.dueDate)) {
        dueDateLabel = "Overdue";
        dueColor = "text-red-500 font-medium";
      } else {
        dueDateLabel = format(task.dueDate, "MMM d");
      }
    }

    const assigneeName = task.assignee?.name || "Unassigned";
    const initials = assigneeName.substring(0, 2).toUpperCase();

    return {
      id: task.id,
      title: task.title,
      completed: task.status === 'COMPLETED',
      dueDate: dueDateLabel,
      dueColor,
      record: task.relatedEntityId || "None",
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
