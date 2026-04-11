"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function saveAiSettings(tenantSlug: string, apiKey: string, enabled: boolean) {
  try {
    await prisma.tenant.update({
      where: { slug: tenantSlug },
      data: {
        geminiApiKey: apiKey,
        aiEnabled: enabled
      } as any
    });
    revalidatePath(`/${tenantSlug}/settings/ai`);
    revalidatePath(`/${tenantSlug}/home`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
