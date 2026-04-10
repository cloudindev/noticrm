import { PrismaClient, PlanTier } from "@prisma/client";

const prisma = new PrismaClient();

export const PLAN_LIMITS = {
  [PlanTier.TRIAL]: { members: 3, records: 1000 },
  [PlanTier.SOLO]: { members: 1, records: 25000 },
  [PlanTier.TEAM]: { members: 5, records: 2500000 },
  [PlanTier.PRO]: { members: 12, records: 1000000 },
  [PlanTier.UNLIMITED]: { members: 999999, records: 999999999 },
};

export async function checkMemberLimit(tenantId: string) {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { planTier: true }
  });
  
  if (!tenant) throw new Error("Tenant not found");
  
  const currentMembers = await prisma.membership.count({
    where: { tenantId }
  });
  
  const pendingInvites = await prisma.invite.count({
    where: { tenantId, status: "PENDING" }
  });

  const maxMembers = PLAN_LIMITS[tenant.planTier].members;
  if (currentMembers + pendingInvites >= maxMembers) {
    throw new Error(`Limit reached. Tu plan actual (${tenant.planTier}) solo permite hasta ${maxMembers} usuarios.`);
  }
}

export async function checkRecordLimit(tenantId: string) {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { planTier: true }
  });
  
  if (!tenant) throw new Error("Tenant not found");

  const [companyCount, personCount, leadCount] = await Promise.all([
    prisma.company.count({ where: { tenantId } }),
    prisma.person.count({ where: { tenantId } }),
    prisma.lead.count({ where: { tenantId } })
  ]);

  const totalRecords = companyCount + personCount + leadCount;
  const maxRecords = PLAN_LIMITS[tenant.planTier].records;

  if (totalRecords >= maxRecords) {
    throw new Error(`Limit reached. Tu plan actual (${tenant.planTier}) solo permite hasta ${maxRecords} registros.`);
  }
}

export async function getUsageStats(tenantId: string) {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { planTier: true, stripeCurrentPeriodEnd: true }
  });
  
  if (!tenant) throw new Error("Tenant not found");

  const currentMembers = await prisma.membership.count({
    where: { tenantId }
  });

  const [companyCount, personCount, leadCount] = await Promise.all([
    prisma.company.count({ where: { tenantId } }),
    prisma.person.count({ where: { tenantId } }),
    prisma.lead.count({ where: { tenantId } })
  ]);

  const totalRecords = companyCount + personCount + leadCount;

  return {
    tier: tenant.planTier,
    periodEnd: tenant.stripeCurrentPeriodEnd,
    members: {
      current: currentMembers,
      max: PLAN_LIMITS[tenant.planTier].members
    },
    records: {
      current: totalRecords,
      max: PLAN_LIMITS[tenant.planTier].records
    }
  };
}
