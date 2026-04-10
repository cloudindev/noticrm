"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { getS3Client, getPublicS3Url } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";

const prisma = new PrismaClient();

export async function updateProfileAvatar(tenantSlug: string, formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const file = formData.get("file") as File;
    if (!file) throw new Error("No file provided");

    // Validate size (e.g. max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File size must be less than 5MB");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Create unique file key: users/{userId}/avatar-{timestamp}.ext
    const extension = file.name.split('.').pop() || 'png';
    const timestamp = Date.now();
    const key = `users/${session.user.id}/avatar-${timestamp}.${extension}`;

    // Upload to S3
    const putCommand = new PutObjectCommand({
      Bucket: process.env['S3_BUCKET_NAME'] || 'principal-bucket-e10q',
      Key: key,
      Body: buffer,
      ContentType: file.type,
      // For general public buckets, setting ACL to public-read is common if supported,
      // but 'Visibility Mapping' from the image says the bucket is public by default.
    });

    const s3 = getS3Client();
    await s3.send(putCommand);

    const publicUrl = getPublicS3Url(key);

    // Update the database
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: publicUrl },
    });

    revalidatePath(`/${tenantSlug}/settings/profile`);
    
    return { success: true, url: publicUrl };
  } catch (error: any) {
    console.error("Error updating avatar:", error);
    return { error: error.message };
  }
}

export async function updateWorkspaceLogo(tenantSlug: string, formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug },
      include: { members: { where: { userId: session.user.id } } }
    });

    if (!tenant) return { error: "Espacio no encontrado." };
    
    const member = tenant.members[0];
    if (!member || (member.role !== "OWNER" && member.role !== "ADMIN")) {
      return { error: "No tienes permisos suficientes." };
    }

    const file = formData.get("file") as File;
    if (!file) throw new Error("No file provided");

    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File size must be less than 5MB");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    const extension = file.name.split('.').pop() || 'png';
    const timestamp = Date.now();
    const key = `tenants/${tenant.id}/workspace-logo-${timestamp}.${extension}`;

    const putCommand = new PutObjectCommand({
      Bucket: process.env['S3_BUCKET_NAME'] || 'principal-bucket-e10q',
      Key: key,
      Body: buffer,
      ContentType: file.type,
    });

    const s3 = getS3Client();
    await s3.send(putCommand);

    const publicUrl = getPublicS3Url(key);

    await prisma.tenant.update({
      where: { id: tenant.id },
      data: { logoUrl: publicUrl },
    });

    revalidatePath(`/${tenantSlug}/settings/general`);
    revalidatePath(`/${tenantSlug}/home`);
    
    return { success: true, url: publicUrl };
  } catch (error: any) {
    console.error("Error updating workspace logo:", error);
    return { error: "Falló la subida de imagen." };
  }
}


export async function updateProfileDetails(tenantSlug: string, formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;

    if (!name || name.trim().length < 2) {
      return { error: "Name must be at least 2 characters long." };
    }
    
    // Basic email validation if changed
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { error: "Please provide a valid email address." };
      }
      
      // Check for email collision
      if (email !== session.user.email) {
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
          return { error: "This email is already taken by another account." };
        }
      }
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        name,
        ...(email && { email }) // update email if valid
      },
    });

    revalidatePath(`/${tenantSlug}/settings/profile`);
    
    return { success: true };
  } catch (error: any) {
    console.error("Error updating profile details:", error);
    return { error: error.message || "Failed to update profile." };
  }
}

export async function updateGeneralSettings(tenantSlug: string, data: { name: string }) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug },
      include: {
        members: { where: { userId: session.user.id } }
      }
    });

    if (!tenant) return { error: "Espacio de trabajo no encontrado." };
    
    // Only OWNER or ADMIN can update general settings
    const member = tenant.members[0];
    if (!member || (member.role !== "OWNER" && member.role !== "ADMIN")) {
      return { error: "No tienes permisos suficientes." };
    }

    if (data.name.trim().length < 2) {
      return { error: "El nombre debe tener al menos 2 caracteres." };
    }

    // Update
    await prisma.tenant.update({
      where: { id: tenant.id },
      data: { name: data.name.trim() }
    });

    revalidatePath(`/${tenantSlug}/settings/general`);
    revalidatePath(`/${tenantSlug}/home`);
    
    return { success: true };
  } catch (error: any) {
    console.error("Error updating general settings:", error);
    return { error: "Error inesperado al guardar los ajustes." };
  }
}

export async function deleteWorkspaceAction(tenantSlug: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug },
      include: {
        members: { where: { userId: session.user.id } }
      }
    });

    if (!tenant) return { error: "Espacio de trabajo no encontrado." };
    
    // Solo el OWNER (o ADMIN genérico) puede borrar. Asumamos que el que tiene rol de ADMIN/OWNER
    const member = tenant.members[0];
    if (!member || (member.role !== "OWNER" && member.role !== "ADMIN")) {
      return { error: "No tienes permisos suficientes para eliminar el espacio de trabajo." };
    }

    // Cascade delete handles relationships
    await prisma.tenant.delete({
      where: { id: tenant.id }
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error al eliminar espacio de trabajo:", error);
    return { error: "Error inesperado al intentar borrar el espacio." };
  }
}

