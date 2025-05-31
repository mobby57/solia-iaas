import prisma from '../../lib/prisma';

export async function getDashboardData(tenantId: string) {
  // Fetch missions count
  const missionsCount = await prisma.mission.count({ where: { tenantId } });

  // Fetch active operators count (users with active tasks)
  const activeOperatorsCount = await prisma.user.count({
    where: {
      tenantId,
      tasks: {
        some: {
          status: 'active',
        },
      },
    },
  });

  // Fetch signed donations count
  const signedDonationsCount = await prisma.donation.count({
    where: {
      tenantId,
      status: 'signed',
    },
  });

  return {
    missionsCount,
    activeOperatorsCount,
    signedDonationsCount,
  };
}
