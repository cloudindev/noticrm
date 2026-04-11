import React from 'react';
import { PrismaClient } from '@prisma/client';
import { LeadDetailClient } from '@/features/leads/components/lead-detail-client';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient();

export default async function LeadDetailPage({ params }: { params: Promise<{ tenantSlug: string, leadId: string }>}) {
  const { tenantSlug, leadId } = await params;
  
  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
    select: { id: true }
  });

  if (!tenant) return <div>Tenant not found</div>;

  // Deep Fetch
  const leadRaw = await prisma.lead.findUnique({
    where: { id: leadId, tenantId: tenant.id },
    include: {
      company: {
        include: {
          people: true // Fetch contacts to show on the right sidebar
        }
      },
      person: true // Primary Person
    }
  });

  if (!leadRaw) return notFound();

  // We need to fetch generic Tasks associated with this lead to populate the Activity/Tasks tab
  const tasks = await prisma.task.findMany({
    where: {
      tenantId: tenant.id,
      relatedEntityId: leadRaw.id,
      relatedEntityType: "LEAD"
    },
    include: {
      assignee: { select: { name: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  const serializedLead = {
    id: leadRaw.id,
    name: leadRaw.name,
    status: leadRaw.status,
    value: leadRaw.value,
    notes: leadRaw.notes,
    dueDate: leadRaw.dueDate ? leadRaw.dueDate.toISOString() : null,
    createdAt: leadRaw.createdAt.toISOString(),
    
    // Company block
    company: leadRaw.company ? {
      id: leadRaw.company.id,
      name: leadRaw.company.name,
      logoUrl: leadRaw.company.logoUrl,
      sector: leadRaw.company.sector,
      addressCity: leadRaw.company.addressCity,
      addressCountry: leadRaw.company.addressCountry,
      people: leadRaw.company.people.map(p => ({
        id: p.id,
        name: p.name,
        lastName: p.lastName,
        jobTitle: p.jobTitle,
        email: p.email,
        phone: p.phone,
        isPrimary: p.id === leadRaw.personId
      }))
    } : null,
    
    // Primary Person
    person: leadRaw.person ? {
      id: leadRaw.person.id,
      name: leadRaw.person.name,
      lastName: leadRaw.person.lastName,
      jobTitle: leadRaw.person.jobTitle,
      email: leadRaw.person.email,
      phone: leadRaw.person.phone,
    } : null
  };

  const serializedTasks = tasks.map(t => ({
    id: t.id,
    title: t.title,
    status: t.status,
    dueDate: t.dueDate ? t.dueDate.toISOString() : null,
    assigneeName: t.assignee?.name || null,
    createdAt: t.createdAt.toISOString()
  }));

  return (
    <LeadDetailClient 
      lead={serializedLead} 
      tasks={serializedTasks}
      tenantSlug={tenantSlug} 
    />
  );
}
