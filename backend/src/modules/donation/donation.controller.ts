import { FastifyReply, FastifyRequest } from 'fastify';
import * as donationService from './donation.service';
import { CreateDonationSchema, UpdateDonationSchema } from './donation.schema';

export async function getDonations(request: FastifyRequest, reply: FastifyReply) {
  const tenantId = (request as any).tenantId;
  try {
    const donations = await donationService.getDonations(tenantId);
    reply.send(donations);
  } catch (error) {
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
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch donation' });
  }
}

export async function createDonation(request: FastifyRequest, reply: FastifyReply) {
  const tenantId = (request as any).tenantId;
  const donationData = request.body as any;
  try {
    const donation = await donationService.createDonation(donationData, tenantId);
    reply.status(201).send(donation);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to create donation' });
  }
}

export async function updateDonation(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  const donationData = request.body as any;
  try {
    const donation = await donationService.updateDonation(id, donationData);
    if (!donation) {
      reply.status(404).send({ error: 'Donation not found' });
      return;
    }
    reply.send(donation);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to update donation' });
  }
}

export async function deleteDonation(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  try {
    await donationService.deleteDonation(id);
    reply.status(204).send();
  } catch (error) {
    reply.status(500).send({ error: 'Failed to delete donation' });
  }
}
