import React from 'react';
import { PrismaClient } from '@prisma/client';
import { PeopleClient } from '@/features/people/components/people-client';

const prisma = new PrismaClient();

export default async function PeoplePage({ params }: { params: Promise<{ tenantSlug: string }>}) {
  const { tenantSlug } = await params;
  
  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
    select: { id: true }
  });

  if (!tenant) return <div>Tenant not found</div>;

  // Fetch People
  const people = await prisma.person.findMany({
    where: { tenantId: tenant.id },
    orderBy: { createdAt: 'desc' },
    include: {
      company: {
        select: { id: true, name: true, logoUrl: true }
      }
    }
  });

  // Fetch Companies for dropdown
  const companies = await prisma.company.findMany({
    where: { tenantId: tenant.id },
    select: { id: true, name: true, logoUrl: true },
    orderBy: { name: 'asc' }
  });

  // Serialize exactly as expected by the Client
  const serializedPeople = people.map(p => ({
    id: p.id,
    name: p.name,
    lastName: p.lastName,
    email: p.email,
    phone: p.phone,
    jobTitle: p.jobTitle,
    companyId: p.companyId,
    companyName: p.company?.name || null,
    companyLogoUrl: p.company?.logoUrl || null,
    notes: p.notes,
  }));

  const serializedCompanies = companies.map(c => ({
    id: c.id,
    name: c.name,
    logoUrl: c.logoUrl,
  }));

  return (
    <PeopleClient 
      initialPeople={serializedPeople} 
      companies={serializedCompanies} 
      tenantSlug={tenantSlug} 
    />
  );
}
