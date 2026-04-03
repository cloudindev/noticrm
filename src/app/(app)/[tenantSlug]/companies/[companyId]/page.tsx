import React from 'react';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { notFound } from 'next/navigation';
import { CompanyDetailClient } from '@/features/companies/components/company-detail-client';

export default async function CompanyDetailPage({ params }: { params: Promise<{ tenantSlug: string, companyId: string }>}) {
  const { tenantSlug, companyId } = await params;
  
  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
    select: { id: true }
  });

  if (!tenant) return notFound();

  const company = await prisma.company.findUnique({
    where: { 
      id: companyId,
      tenantId: tenant.id
    },
    include: {
      owner: { select: { id: true, name: true, image: true } }
    }
  });

  if (!company) return notFound();

  return <CompanyDetailClient initialCompany={company} tenantSlug={tenantSlug} />;
}
