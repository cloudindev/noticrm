import React from 'react';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { CompaniesClient } from '@/features/companies/components/companies-client';

export default async function CompaniesPage({ params }: { params: Promise<{ tenantSlug: string }>}) {
  const { tenantSlug } = await params;
  
  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
    select: { id: true }
  });

  if (!tenant) return <div>Tenant not found</div>;

  const companies = await prisma.company.findMany({
    where: { tenantId: tenant.id },
    orderBy: { createdAt: 'desc' },
    include: {
      owner: {
        select: { name: true }
      }
    }
  });

  // Map to safely serializable format
  const serializedCompanies = companies.map(c => ({
    id: c.id,
    name: c.name,
    sector: c.sector || "General",
    website: c.website || "-",
    owner: c.owner?.name || "No asignado",
    entityType: c.entityType
  }));

  return <CompaniesClient initialCompanies={serializedCompanies} tenantSlug={tenantSlug} />;
}
