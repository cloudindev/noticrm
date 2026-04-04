import React from 'react';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/lib/auth';
import { ProfileClient } from '@/features/settings/components/profile-client';

const prisma = new PrismaClient();

export const metadata = {
  title: 'Perfil de Usuario | Noticrm',
  description: 'Gestiona tu perfil y credenciales.',
};

export default async function ProfilePage({ params }: { params: Promise<{ tenantSlug: string }> }) {
  const { tenantSlug } = await params;
  const session = await auth();

  if (!session?.user?.id) return <div>No autorizado</div>;

  const tenant = await prisma.tenant.findUnique({
    where: { slug: tenantSlug },
    include: {
      members: {
        where: { userId: session.user.id }
      }
    }
  });

  if (!tenant || tenant.members.length === 0) {
    return <div>No autorizado para acceder a este espacio de trabajo</div>;
  }

  // Fetch complete user data
  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user) return <div>Usuario no encontrado</div>;

  const userData = {
    name: user.name,
    email: user.email,
    image: user.image,
  };

  return (
    <div className="p-8 lg:p-12 h-full overflow-y-auto">
      <ProfileClient tenantSlug={tenantSlug} user={userData} />
    </div>
  );
}
