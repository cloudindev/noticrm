"use server";

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { revalidatePath } from 'next/cache';
import { checkRecordLimit } from '@/lib/limits';

export async function createCompany(tenantSlug: string, formData: FormData) {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug }
    });

    if (!tenant) return { error: "Tenant not found" };

    try {
      await checkRecordLimit(tenant.id);
    } catch (err: any) {
      return { error: err.message };
    }

    const entityType = formData.get('entityType') as string || 'COMPANY';
    const useSameAddress = formData.get('useSameAddress') === 'true';
    
    // Core fields
    const name = formData.get('name') as string || (formData.get('legalName') as string) || (formData.get('firstName') as string) || 'Sin nombre';
    
    const company = await prisma.company.create({
      data: {
        tenantId: tenant.id,
        name,
        entityType,
        
        // Fiscal (Company)
        legalName: formData.get('legalName') as string || null,
        taxId: formData.get('taxId') as string || null,
        
        // Fiscal (Individual)
        firstName: formData.get('firstName') as string || null,
        lastName: formData.get('lastName') as string || null,
        secondLastName: formData.get('secondLastName') as string || null,
        
        // Contact
        email: formData.get('email') as string || null,
        phone: formData.get('phone') as string || null,
        website: formData.get('website') as string || null,
        logoUrl: formData.get('logoUrl') as string || null,
        
        // Fiscal Address
        address: formData.get('address') as string || null,
        addressCity: formData.get('addressCity') as string || null,
        addressProvince: formData.get('addressProvince') as string || null,
        addressZip: formData.get('addressZip') as string || null,
        addressCountry: formData.get('addressCountry') as string || 'España',
        
        // Operating Address
        useSameAddress,
        opAddress: useSameAddress ? null : (formData.get('opAddress') as string || null),
        opAddressCity: useSameAddress ? null : (formData.get('opAddressCity') as string || null),
        opAddressProvince: useSameAddress ? null : (formData.get('opAddressProvince') as string || null),
        opAddressZip: useSameAddress ? null : (formData.get('opAddressZip') as string || null),
        opAddressCountry: useSameAddress ? null : (formData.get('opAddressCountry') as string || null),
      }
    });

    revalidatePath(`/${tenantSlug}/companies`);
    return { success: true, companyId: company.id };
  } catch (error) {
    console.error("Error creating company:", error);
    return { error: "Failed to create company" };
  }
}

export async function deleteCompany(tenantSlug: string, companyId: string) {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { slug: tenantSlug }
    });

    if (!tenant) return { error: "Tenant not found" };

    await prisma.company.deleteMany({
      where: {
        id: companyId,
        tenantId: tenant.id
      }
    });

    revalidatePath(`/${tenantSlug}/companies`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting company:", error);
    return { error: "Failed to delete company" };
  }
}

export async function updateCompany(tenantSlug: string, companyId: string, data: any) {
  try {
    const tenant = await prisma.tenant.findUnique({
       where: { slug: tenantSlug }
    });
    if (!tenant) return { error: "Tenant not found" };

    await prisma.company.update({
      where: { id: companyId, tenantId: tenant.id },
      data
    });

    revalidatePath(`/${tenantSlug}/companies/${companyId}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating company:", error);
    return { error: "Failed to update company" };
  }
}
