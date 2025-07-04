import { FastifyReply, FastifyRequest } from 'fastify';
import * as donationService from './donation.service';

export async function getDonations(request: FastifyRequest, reply: FastifyReply) {
  const tenantId = (request as any).tenantId;
  try {
    const donations = await donationService.getDonations(tenantId);
    reply.send(donations);
  } catch (_error) {
    reply.status(500).send({ error: 'Failed to fetch donations' });
  }
}

export async function getDonationById(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  try {
    const donation = await donationService.getDonationById(id);
    if (!donation) {
      reply.status(404).send({ error: 'Donation not found' });
      return;
    }
    reply.send(donation);
  } catch (_error) {
    reply.status(500).send({ error: 'Failed to fetch donation' });
  }
}

export async function createDonation(request: FastifyRequest, reply: FastifyReply) {
  const tenantId = (request as any).tenantId;
  const { donorId, organizationId, ...rest } = request.body as any;
  try {
    const donation = await donationService.createDonation(
      { donorId, organizationId, ...rest },
      tenantId,
    );
    reply.status(201).send(donation);
  } catch (_error) {
    reply.status(500).send({ error: 'Failed to create donation' });
  }
}

export async function updateDonation(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  const donationData = request.body as any;
  const tenantId = (request as any).tenantId;
  try {
    const donation = await donationService.updateDonation(id, donationData, tenantId);
    if (!donation) {
      reply.status(404).send({ error: 'Donation not found' });
      return;
    }
    reply.send(donation);
  } catch (_error) {
    reply.status(500).send({ error: 'Failed to update donation' });
  }
}

export async function deleteDonation(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  const tenantId = (request as any).tenantId;
  try {
    await donationService.deleteDonation(id, tenantId);
    reply.status(204).send();
  } catch (_error) {
    reply.status(500).send({ error: 'Failed to delete donation' });
  }
}
