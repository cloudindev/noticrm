"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function createPerson(tenantSlug: string, formData: FormData) {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug },
    });

    if (!tenant) return { error: "Tenant not found" };

    const name = formData.get("name") as string;
    const lastName = formData.get("lastName") as string | null;
    const email = formData.get("email") as string | null;
    const phone = formData.get("phone") as string | null;
    const jobTitle = formData.get("jobTitle") as string | null;
    const companyId = formData.get("companyId") as string | null;
    const notes = formData.get("notes") as string | null;

    if (!name) return { error: "Name is required" };

    const person = await prisma.person.create({
      data: {
        tenantId: tenant.id,
        name,
        lastName,
        email,
        phone,
        jobTitle,
        companyId: companyId || null,
        notes,
      },
    });

    revalidatePath(`/${tenantSlug}/people`);
    return { success: true, personId: person.id };
  } catch (error: any) {
    console.error("Error creating person:", error);
    return { error: error.message || "Failed to create person" };
  }
}

export async function updatePerson(tenantSlug: string, personId: string, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const lastName = formData.get("lastName") as string | null;
    const email = formData.get("email") as string | null;
    const phone = formData.get("phone") as string | null;
    const jobTitle = formData.get("jobTitle") as string | null;
    const companyId = formData.get("companyId") as string | null;
    const notes = formData.get("notes") as string | null;

    if (!name) return { error: "Name is required" };

    await prisma.person.update({
      where: { id: personId },
      data: {
        name,
        lastName,
        email,
        phone,
        jobTitle,
        companyId: companyId || null,
        notes,
      },
    });

    revalidatePath(`/${tenantSlug}/people`);
    return { success: true };
  } catch (error: any) {
    console.error("Error updating person:", error);
    return { error: error.message || "Failed to update person" };
  }
}

export async function deletePerson(tenantSlug: string, personId: string) {
  try {
    await prisma.person.delete({
      where: { id: personId },
    });

    revalidatePath(`/${tenantSlug}/people`);
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting person:", error);
    return { error: error.message || "Failed to delete person" };
  }
}
