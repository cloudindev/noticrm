"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

// Check if there is already a global prisma instance to avoid excessive connections
// (Assuming global.prisma pattern isn't strictly enforced here but standard NextJS instantiation)
const prisma = new PrismaClient();

async function authenticateTenant(tenantSlug: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  
  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
    include: {
      members: {
        where: { userId: session.user.id }
      }
    }
  });

  if (!tenant || tenant.members.length === 0) {
    throw new Error("Unauthorized access to workspace");
  }

  return { tenant, user: session.user };
}

export async function createTask(tenantSlug: string, title: string, dueDate?: Date | null, assigneeId?: string | null, relatedEntityId?: string | null, relatedEntityType?: string | null) {
  try {
    const { tenant, user } = await authenticateTenant(tenantSlug);
    
    const task = await prisma.task.create({
      data: {
        tenantId: tenant.id,
        title,
        dueDate: dueDate !== undefined ? dueDate : null,
        assigneeId: assigneeId || user.id, // default to self
        relatedEntityId,
        relatedEntityType,
        status: "TODO",
        priority: "MEDIUM"
      },
      include: {
        assignee: true,
      }
    });

    revalidatePath(`/${tenantSlug}/tasks`);
    return { success: true, task };
  } catch (error: any) {
    console.error("Error creating task:", error);
    return { error: error.message };
  }
}

export async function updateTaskStatus(tenantSlug: string, taskId: string, completed: boolean) {
  try {
    const { tenant } = await authenticateTenant(tenantSlug);
    
    const task = await prisma.task.update({
      where: { id: taskId, tenantId: tenant.id },
      data: {
        status: completed ? "COMPLETED" : "TODO"
      }
    });

    revalidatePath(`/${tenantSlug}/tasks`);
    return { success: true, task };
  } catch (error: any) {
    console.error("Error updating task:", error);
    return { error: error.message };
  }
}

export async function deleteTask(tenantSlug: string, taskId: string) {
  try {
    const { tenant } = await authenticateTenant(tenantSlug);
    
    await prisma.task.delete({
      where: { id: taskId, tenantId: tenant.id },
    });

    revalidatePath(`/${tenantSlug}/tasks`);
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting task:", error);
    return { error: error.message };
  }
}
