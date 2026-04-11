import React from 'react';
import { PrismaClient } from '@prisma/client';
import { LeadsClient } from '@/features/leads/components/leads-client';

const prisma = new PrismaClient();

export default async function LeadsPage({ params }: { params: Promise<{ tenantSlug: string }>}) {
  const { tenantSlug } = await params;
  
  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
    select: { id: true }
  });

  if (!tenant) return <div>Tenant not found</div>;

  // Fetch Leads
  const leadsRaw = await prisma.lead.findMany({
    where: { tenantId: tenant.id },
    orderBy: { createdAt: 'desc' },
    include: {
      company: {
        select: { id: true, name: true, logoUrl: true }
      },
      person: {
        select: { id: true, name: true, lastName: true }
      }
    }
  });

  // Fetch tasks per lead to calculate "Notes/Tasks due" if needed
  // For now we map it directly
  const serializedLeads = leadsRaw.map(l => ({
    id: l.id,
    name: l.name,
    status: l.status,
    value: l.value,
    notes: l.notes,
    dueDate: l.dueDate ? l.dueDate.toISOString() : null,
    companyId: l.company?.id || null,
    companyName: l.company?.name || null,
    companyLogoUrl: l.company?.logoUrl || null,
    personName: l.person ? `${l.person.name} ${l.person.lastName || ''}`.trim() : null,
    createdAt: l.createdAt.toISOString()
  }));

  // Fetch lists for the creator modal
  const companies = await prisma.company.findMany({
    where: { tenantId: tenant.id },
    select: { id: true, name: true, logoUrl: true },
    orderBy: { name: 'asc' }
  });

  const people = await prisma.person.findMany({
    where: { tenantId: tenant.id },
    select: { id: true, name: true, lastName: true, companyId: true },
    orderBy: { name: 'asc' }
  });

  const serializedCompanies = companies.map(c => ({
    id: c.id,
    name: c.name,
    logoUrl: c.logoUrl,
  }));
  
  const serializedPeople = people.map(p => ({
    id: p.id,
    name: p.name,
    lastName: p.lastName,
    companyId: p.companyId
  }));

  return (
    <LeadsClient 
      initialLeads={serializedLeads} 
      companies={serializedCompanies} 
      people={serializedPeople}
      tenantSlug={tenantSlug} 
    />
  );
}
