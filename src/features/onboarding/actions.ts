"use server";

import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

const profileSchema = z.object({
  firstName: z.string().min(2, "First name is too short"),
  lastName: z.string().min(2, "Last name is too short"),
});

export async function updateProfileAction(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const data = Object.fromEntries(formData.entries());
    const parsed = profileSchema.safeParse(data);

    if (!parsed.success) {
      return { error: "Invalid name provided." };
    }

    const { firstName, lastName } = parsed.data;

    await prisma.user.update({
      where: { id: session.user.id },
      data: { name: `${firstName} ${lastName}` },
    });

    return { success: true };
  } catch (err) {
    console.error("Update profile error:", err);
    return { error: "An unexpected error occurred." };
  }
}

const workspaceSchema = z.object({
  companyName: z.string().min(2, "Company name is too short"),
  workspaceHandle: z.string().min(3, "Workspace handle must be at least 3 characters").max(30),
  billingCountry: z.string().min(2, "Please select a country"),
});

export async function createWorkspaceAction(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const data = Object.fromEntries(formData.entries());
    const parsed = workspaceSchema.safeParse(data);

    if (!parsed.success) {
      return { error: "Invalid data provided." };
    }

    const { companyName, workspaceHandle, billingCountry } = parsed.data;
    const slug = workspaceHandle.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const existingTenant = await prisma.tenant.findUnique({
      where: { slug },
    });

    if (existingTenant) {
      return { error: "This workspace handle is already taken." };
    }

    const result = await prisma.$transaction(async (tx) => {
      // Create Tenant
      const tenant = await tx.tenant.create({
        data: {
          name: companyName,
          slug,
        },
      });

      // Create Organization
      await tx.organization.create({
        data: {
          tenantId: tenant.id,
          name: companyName,
          billingCountry,
        },
      });

      // Create Membership linking Owner to Tenant
      await tx.membership.create({
        data: {
          userId: session.user!.id!,
          tenantId: tenant.id,
          role: "OWNER",
        },
      });

      return tenant.slug;
    });

    return { success: true, slug: result };
  } catch (err) {
    console.error("Create workspace error:", err);
    return { error: "An unexpected error occurred." };
  }
}

export async function inviteUsersAction(tenantSlug: string, invites: { email: string, role: string }[]) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug },
      select: { id: true },
    });

    if (!tenant) return { error: "Tenant not found." };

    for (const invite of invites) {
       await prisma.invite.upsert({
         where: { email_tenantId: { email: invite.email, tenantId: tenant.id } },
         update: { role: invite.role as any, inviterId: session.user.id },
         create: {
           email: invite.email,
           role: invite.role as any,
           tenantId: tenant.id,
           inviterId: session.user.id,
           token: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
         }
       });
    }

    return { success: true };
  } catch (err) {
    console.error("Invite users error:", err);
    return { error: "An unexpected error occurred." };
  }
}
