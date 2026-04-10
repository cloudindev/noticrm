"use server";

import { PrismaClient, Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { Resend } from "resend";
import crypto from "crypto";

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY || "fallback");

export type MemberPermissionsPayload = {
  canAccessCompanies: boolean;
  canAccessPeople: boolean;
  canAccessLeads: boolean;
  canAccessTasks: boolean;
  visibilityScope: "GLOBAL" | "OWNED";
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canExport: boolean;
};

// Admin/Owner check helper
async function checkAdminStatus(tenantSlug: string, userId: string) {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
    include: { members: { where: { userId } } }
  });
  if (!tenant || tenant.members.length === 0) return { error: "No se encontró el entorno" };
  const role = tenant.members[0].role;
  if (role !== "ADMIN" && role !== "OWNER") return { error: "Permisos insuficientes" };
  return { tenant, memberId: tenant.members[0].id };
}

export async function inviteMemberAction(
  tenantSlug: string,
  email: string,
  role: Role,
  permissions: MemberPermissionsPayload
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "No autorizado" };

    const adminCheck = await checkAdminStatus(tenantSlug, session.user.id);
    if (adminCheck.error) return { error: adminCheck.error };
    const { tenant } = adminCheck;

    // Determine if user is already a member
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      const existingMembership = await prisma.membership.findFirst({
        where: { userId: existingUser.id, tenantId: tenant!.id }
      });
      if (existingMembership) return { error: "El usuario ya es miembro de este espacio de trabajo" };
    }

    // Check if invite already exists
    const existingInvite = await prisma.invite.findUnique({
      where: { email_tenantId: { email, tenantId: tenant!.id } }
    });

    const token = crypto.randomBytes(32).toString("hex");

    const inviteData = {
      email,
      role,
      tenantId: tenant!.id,
      inviterId: session.user.id,
      status: "PENDING",
      token,
      // Permissions
      ...(role === "ADMIN" ? {
        canAccessCompanies: true,
        canAccessPeople: true,
        canAccessLeads: true,
        canAccessTasks: true,
        visibilityScope: "GLOBAL",
        canCreate: true,
        canEdit: true,
        canDelete: true,
        canExport: true,
      } : permissions)
    };

    let invite;
    if (existingInvite) {
      invite = await prisma.invite.update({
        where: { id: existingInvite.id },
        data: inviteData
      });
    } else {
      invite = await prisma.invite.create({
        data: inviteData
      });
    }

    const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/invite?token=${token}`;

    try {
      await resend.emails.send({
        from: "NotiCRM <no-reply@noticrm.cloudin.pro>",
        to: email,
        subject: `Invitación al equipo de ${tenant!.name} en NotiCRM`,
        html: `
          <h2>Has sido invitado a unirte a ${tenant!.name}</h2>
          <p>${session.user.name || session.user.email} te ha invitado a unirte a su espacio de trabajo en NotiCRM.</p>
          <p><a href="${verificationLink}" style="background-color: #2F6BFF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Aceptar invitación</a></p>
          <p>Si no esperabas esto, simplemente ignora este correo.</p>
        `,
      });
    } catch (e) {
      console.error("Resend error", e);
      // Fallback but doesn't crash action
    }

    revalidatePath(`/${tenantSlug}/settings/members`);
    return { success: true };
  } catch (error: any) {
    console.error("Error creating invite", error);
    return { error: "Ocurrió un error inesperado al invitar al usuario." };
  }
}

export async function updateMemberPermissionsAction(
  tenantSlug: string,
  membershipId: string,
  role: Role,
  permissions: MemberPermissionsPayload
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "No autorizado" };

    const adminCheck = await checkAdminStatus(tenantSlug, session.user.id);
    if (adminCheck.error) return { error: adminCheck.error };

    // Update
    await prisma.membership.update({
      where: { id: membershipId },
      data: {
        role,
        ...(role === "ADMIN" ? {
          canAccessCompanies: true,
          canAccessPeople: true,
          canAccessLeads: true,
          canAccessTasks: true,
          visibilityScope: "GLOBAL",
          canCreate: true,
          canEdit: true,
          canDelete: true,
          canExport: true,
        } : permissions)
      }
    });

    revalidatePath(`/${tenantSlug}/settings/members`);
    return { success: true };
  } catch (error: any) {
    console.error("Error updating permissions", error);
    return { error: "Error al actualizar los permisos del miembro." };
  }
}

export async function revokeMembershipAction(
  tenantSlug: string,
  membershipId: string
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "No autorizado" };

    const adminCheck = await checkAdminStatus(tenantSlug, session.user.id);
    if (adminCheck.error) return { error: adminCheck.error };
    
    if (adminCheck.memberId === membershipId) {
      return { error: "No puedes eliminar tu propia membresía desde aquí." };
    }

    const membership = await prisma.membership.findUnique({
      where: { id: membershipId }
    });

    if (membership?.role === "OWNER") {
      return { error: "No se puede eliminar al OWNER del entorno." };
    }

    await prisma.membership.delete({
      where: { id: membershipId }
    });

    revalidatePath(`/${tenantSlug}/settings/members`);
    return { success: true };
  } catch (error: any) {
    console.error("Error revoking membership", error);
    return { error: "Error al revocar acceso al miembro." };
  }
}

export async function resendInviteAction(
  tenantSlug: string,
  inviteId: string
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "No autorizado" };

    const adminCheck = await checkAdminStatus(tenantSlug, session.user.id);
    if (adminCheck.error) return { error: adminCheck.error };
    const { tenant } = adminCheck;

    const invite = await prisma.invite.findUnique({
      where: { id: inviteId }
    });

    if (!invite || invite.tenantId !== tenant!.id) {
      return { error: "Invitación no encontrada." };
    }

    const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/invite?token=${invite.token}`;

    try {
      await resend.emails.send({
        from: "NotiCRM <no-reply@noticrm.cloudin.pro>",
        to: invite.email,
        subject: `Recordatorio: Invitación al equipo de ${tenant!.name} en NotiCRM`,
        html: `
          <h2>Has sido invitado a unirte a ${tenant!.name}</h2>
          <p>${session.user.name || session.user.email} te ha invitado a unirte a su espacio de trabajo en NotiCRM.</p>
          <p><a href="${verificationLink}" style="background-color: #2F6BFF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Aceptar invitación</a></p>
          <p>Si no esperabas esto, simplemente ignora este correo.</p>
        `,
      });
    } catch (e) {
      console.error("Resend error", e);
      return { error: "Error al intentar enviar el email." };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error resending invite", error);
    return { error: "Error inesperado al reenviar invitación." };
  }
}

export async function cancelInviteAction(
  tenantSlug: string,
  inviteId: string
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "No autorizado" };

    const adminCheck = await checkAdminStatus(tenantSlug, session.user.id);
    if (adminCheck.error) return { error: adminCheck.error };
    const { tenant } = adminCheck;

    const invite = await prisma.invite.findUnique({
      where: { id: inviteId }
    });

    if (!invite || invite.tenantId !== tenant!.id) {
      return { error: "Invitación no encontrada." };
    }

    await prisma.invite.delete({
      where: { id: inviteId }
    });

    revalidatePath(`/${tenantSlug}/settings/members`);
    return { success: true };
  } catch (error: any) {
    console.error("Error canceling invite", error);
    return { error: "Error al cancelar la invitación." };
  }
}
