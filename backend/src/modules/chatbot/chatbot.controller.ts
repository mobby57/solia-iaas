import { FastifyRequest, FastifyReply } from 'fastify';
import * as chatbotService from './chatbot.service';

export async function getChatbots(request: FastifyRequest, reply: FastifyReply) {
  const tenantId = request.headers['x-tenant-id'] as string;
  const chatbots = await chatbotService.ChatbotService.getChatbots(tenantId);
  return reply.send(chatbots);
}

export async function getChatbotById(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const chatbot = await chatbotService.ChatbotService.getChatbotById(id);
  return reply.send(chatbot);
}

export async function createChatbot(request: FastifyRequest, reply: FastifyReply) {
  const tenantId = request.headers['x-tenant-id'] as string;
  const chatbotData = request.body;
  const chatbot = await chatbotService.ChatbotService.createChatbot(chatbotData, tenantId);
  return reply.send(chatbot);
}

export async function updateChatbot(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  const chatbotData = request.body;
  const chatbot = await chatbotService.ChatbotService.updateChatbot(id, chatbotData);
  return reply.send(chatbot);
}

export async function deleteChatbot(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: string };
  await chatbotService.ChatbotService.deleteChatbot(id);
  return reply.status(204).send();
}
