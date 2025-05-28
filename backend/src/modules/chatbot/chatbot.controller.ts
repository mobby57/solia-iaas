import { FastifyReply, FastifyRequest } from 'fastify';
import * as chatbotService from './chatbot.service';
import { CreateChatbotSchema, UpdateChatbotSchema } from './chatbot.schema';

export async function getChatbots(request: FastifyRequest, reply: FastifyReply) {
  const tenantId = (request as any).tenantId;
  try {
    const chatbots = await chatbotService.getChatbots(tenantId);
    reply.send(chatbots);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch chatbots' });
  }
}

export async function getChatbotById(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  try {
    const chatbot = await chatbotService.getChatbotById(id);
    if (!chatbot) {
      reply.status(404).send({ error: 'Chatbot not found' });
      return;
    }
    reply.send(chatbot);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to fetch chatbot' });
  }
}

export async function createChatbot(request: FastifyRequest, reply: FastifyReply) {
  const tenantId = (request as any).tenantId;
  const chatbotData = request.body as any;
  try {
    const chatbot = await chatbotService.createChatbot(chatbotData, tenantId);
    reply.status(201).send(chatbot);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to create chatbot' });
  }
}

export async function updateChatbot(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  const chatbotData = request.body as any;
  try {
    const chatbot = await chatbotService.updateChatbot(id, chatbotData);
    if (!chatbot) {
      reply.status(404).send({ error: 'Chatbot not found' });
      return;
    }
    reply.send(chatbot);
  } catch (error) {
    reply.status(500).send({ error: 'Failed to update chatbot' });
  }
}

export async function deleteChatbot(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as any;
  try {
    await chatbotService.deleteChatbot(id);
    reply.status(204).send();
  } catch (error) {
    reply.status(500).send({ error: 'Failed to delete chatbot' });
  }
}
