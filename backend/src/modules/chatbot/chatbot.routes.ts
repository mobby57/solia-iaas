import { FastifyInstance } from 'fastify';
import {
  getChatbots,
  getChatbotById,
  createChatbot,
  updateChatbot,
  deleteChatbot,
} from './chatbot.controller';
import { verifyAuth } from '../../middlewares/verifyAuth';
import { verifyRole } from '../../middlewares/verifyRole';

export async function chatbotRoutes(fastify: FastifyInstance) {
  fastify.addHook('preHandler', verifyAuth);

  fastify.get('/chatbots', getChatbots);
  fastify.get('/chatbots/:id', getChatbotById);

  fastify.post('/chatbots', { preHandler: verifyRole(['ADMIN']) }, createChatbot);
  fastify.put('/chatbots/:id', { preHandler: verifyRole(['ADMIN']) }, updateChatbot);
  fastify.delete('/chatbots/:id', { preHandler: verifyRole(['ADMIN']) }, deleteChatbot);
}
