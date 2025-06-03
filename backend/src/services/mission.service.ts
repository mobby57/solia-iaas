import {prisma} from '../lib/prisma';

export async function getMissions() {
  return prisma.mission.findMany();
}

export async function getMissionById(id: string) {
  return prisma.mission.findUnique({ where: { id } });
}

export async function createMission(data: any) {
  return prisma.mission.create({
    data: {
      ...data,
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
