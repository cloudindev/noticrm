"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export const LEAD_STAGES = [
  { id: "PROSPECTING", label: "Prospección" },
  { id: "QUALIFIED", label: "Cualificada" },
  { id: "PROPOSAL", label: "Propuesta enviada" },
  { id: "NEGOTIATION", label: "Negociación" },
  { id: "CLOSED", label: "Cerrada" } // Closed can be WON or LOST, we map it as one visual column but it has modifiers or we can separate them. The user said: "cerrada (ok o ko)".
];
// We will use WON / LOST internal states, but in UI they can be in a 'CLOSED' stage or we just use:
// PROSPECTING, QUALIFIED, PROPOSAL, NEGOTIATION, WON, LOST. Let's make the pipeline standard.
export const PIPELINE_STAGES = [
  "PROSPECTING",
  "QUALIFIED",
  "PROPOSAL",
  "NEGOTIATION",
  "CLOSED",
];

export async function createLead(tenantSlug: string, formData: FormData) {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug },
    });

    if (!tenant) return { error: "Tenant not found" };

    const name = formData.get("name") as string;
    const companyId = formData.get("companyId") as string | null;
    const personId = formData.get("personId") as string | null;
    const value = parseFloat(formData.get("value") as string) || 0;
    const dueDateStr = formData.get("dueDate") as string | null;
    const notes = formData.get("notes") as string | null;

    if (!name) return { error: "Name is required" };

    const lead = await prisma.lead.create({
      data: {
        tenantId: tenant.id,
        name,
        companyId: companyId || null,
        personId: personId || null,
        status: "PROSPECTING", // Initial Status
        value,
        notes,
        dueDate: dueDateStr ? new Date(dueDateStr) : null,
      },
    });

    revalidatePath(`/${tenantSlug}/leads`);
    return { success: true, leadId: lead.id };
  } catch (error: any) {
    console.error("Error creating lead:", error);
    return { error: error.message || "Failed to create lead" };
  }
}

export async function updateLeadStage(tenantSlug: string, leadId: string, newStage: string) {
  try {
    await prisma.lead.update({
      where: { id: leadId },
      data: { status: newStage }
    });
    
    // Create an automated task/note representing the activity transition if needed.
    // For now we just update status.
    revalidatePath(`/${tenantSlug}/leads`);
    revalidatePath(`/${tenantSlug}/leads/${leadId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Error updating lead stage:", error);
    return { error: error.message || "Failed to update lead stage" };
  }
}

export async function deleteLead(tenantSlug: string, leadId: string) {
  try {
    await prisma.lead.delete({
      where: { id: leadId },
    });
    revalidatePath(`/${tenantSlug}/leads`);
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting lead:", error);
    return { error: error.message || "Failed to delete lead" };
  }
}
