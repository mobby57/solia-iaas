import prisma from '../lib/prisma';

export async function getMissions(tenantId: string) {
  return prisma.mission.findMany({ where: { tenantId } });
}

export async function getMissionById(id: string) {
  return prisma.mission.findUnique({ where: { id } });
}

export async function createMission(data: any, tenantId: string) {
  return prisma.mission.create({
    data: {
      ...data,
      tenantId,
    },
  });
}

export async function updateMission(id: string, data: any) {
  return prisma.mission.update({
    where: { id },
    data,
  });
}

export async function deleteMission(id: string) {
  return prisma.mission.delete({ where: { id } });
}
