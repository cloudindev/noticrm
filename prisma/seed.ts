import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting DB Seed...');

  // Create an admin user and tenant
  const tenantSlug = 'acme-corp';
  
  // Check if tenant already exists
  const existingTenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
  });

  if (existingTenant) {
    console.log(`Tenant ${tenantSlug} already exists. Skipping seed.`);
    return;
  }

  // Hash password
  const passwordHash = await bcrypt.hash('admin123', 10);

  // 1. Create Tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Acme Corporation',
      slug: tenantSlug,
    },
  });

  // 2. Create Organization
  await prisma.organization.create({
    data: {
      name: 'Acme Corporation',
      tenantId: tenant.id,
    },
  });

  // 3. Create User
  const adminEmail = 'admin@acmecorp.com';
  const user = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: adminEmail,
      passwordHash,
    },
  });

  // 4. Create Membership (Owner Role)
  await prisma.membership.create({
    data: {
      userId: user.id,
      tenantId: tenant.id,
      role: 'OWNER',
    },
  });

  console.log(`Seed successful!`);
  console.log(`Admin Email: ${adminEmail}`);
  console.log(`Admin Password: admin123`);
  console.log(`Tenant Slug: ${tenantSlug}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
