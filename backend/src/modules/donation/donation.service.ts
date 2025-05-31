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

export async function updateDonation(id: string, data: any, tenantId: string) {
  try {
    // Find the donation by id and tenantId first
    const existingDonation = await prisma.donation.findUnique({
      where: { id_tenantId: { id, tenantId } },
    });
    if (!existingDonation) {
      throw new Error('No donation found for update with the given id and tenant');
    }
    // Update by id and tenantId
    return await prisma.donation.update({
      where: { id_tenantId: { id, tenantId } },
      data,
    });
  } catch (error: any) {
    if (error.message === 'No donation found for update with the given id and tenant' || error.code === 'P2025') {
      throw new Error('No donation found for update with the given id and tenant');
    }
    throw error;
  }
}

export async function deleteDonation(id: string, tenantId: string) {
  try {
    return await prisma.donation.delete({ where: { id_tenantId: { id, tenantId } } });
  } catch (error: any) {
    if (error.code === 'P2025') {
      throw new Error('No donation found for delete with the given id and tenant');
    }
    throw error;
  }
}
