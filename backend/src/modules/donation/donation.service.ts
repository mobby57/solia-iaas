import prisma from '../../lib/prisma';

export async function getDonations(tenantId: string) {
  return prisma.donation.findMany({ where: { tenantId } });
}

export async function getDonationById(id: string) {
  return prisma.donation.findUnique({ where: { id } });
}

export async function createDonation(data: any, tenantId: string) {
  return prisma.donation.create({
    data: {
      ...data,
      tenantId,
    },
  });
}

export async function updateDonation(id: string, data: any) {
  return prisma.donation.update({
    where: { id },
    data,
  });
}

export async function deleteDonation(id: string) {
  return prisma.donation.delete({ where: { id } });
}
