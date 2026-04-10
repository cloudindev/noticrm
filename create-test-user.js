const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const email = 'luis@cloudin.pro';
  const password = 'TestingPassword123!';
  const passwordHash = await bcrypt.hash(password, 10);

  // Intentamos obtener el primer tenant que haya (probablemente "cloudindev" o el que estés usando)
  let tenant = await prisma.tenant.findFirst();
  
  if (!tenant) {
    console.log('No se ha encontrado un tenant en la DB. Abortando. Inicia sesión con el dueño para crear uno.');
    return;
  }

  console.log(`Asignando al entorno: ${tenant.slug}`);

  // Verificar si el User ya existe (por si lo creaste a mano o registró)
  let user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: 'Luis Test',
        email,
        passwordHash,
      }
    });
    console.log('✅ Usuario Creado');
  } else {
    user = await prisma.user.update({
      where: { email },
      data: { passwordHash }
    });
    console.log('✅ El usuario ya existía. Se ha refrescado la contraseña.');
  }

  // Ahora preparamos el Membership
  const permissions = {
    role: 'MEMBER',
    visibilityScope: 'GLOBAL',
    canAccessCompanies: true,
    canAccessTasks: true,
    canAccessPeople: false,
    canAccessLeads: false,
    canCreate: true,
    canEdit: true,
    canDelete: true,
    canExport: false,
  };

  const existingMembership = await prisma.membership.findUnique({
    where: { userId_tenantId: { userId: user.id, tenantId: tenant.id } }
  });

  if (!existingMembership) {
    await prisma.membership.create({
      data: {
        userId: user.id,
        tenantId: tenant.id,
        ...permissions
      }
    });
    console.log('✅ Permisos insertados.');
  } else {
    await prisma.membership.update({
      where: { id: existingMembership.id },
      data: permissions
    });
    console.log('✅ Permisos sobre-escritos a los que solicitaste.');
  }

  console.log('\n=====================================');
  console.log(' EMAIL:     ', email);
  console.log(' PASSWORD:  ', password);
  console.log('=====================================\n');
}

main()
  .catch(e => {
    console.error('Hubo un error:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
