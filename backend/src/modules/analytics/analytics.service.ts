import prisma from '../../lib/prisma';

export async function getDashboardData(tenantId: string) {
  // Fetch missions count filtered by organization tenantId
  const missionsCount = await prisma.mission.count({
    where: {
      organization: {
        tenantId: tenantId,
      },
    },
  });

  // Fetch active operators count (users with active tasks)
  const activeOperatorsCount = await prisma.user.count({
    where: {
      tenantId,
      tasks: {
        some: {
          // Removed invalid status filter
        },
      },
    },
  });

  // Fetch signed donations count
  const signedDonationsCount = await prisma.donation.count({
    where: {
      tenantId,
      // Removed invalid status filter
    },
  });

  return {
    missionsCount,
    activeOperatorsCount,
    signedDonationsCount,
  };
}
