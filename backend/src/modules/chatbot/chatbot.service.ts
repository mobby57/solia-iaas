import { prisma } from '../../lib/prisma';

export class ChatbotService {
  static async getChatbots(tenantId: string) {
    return prisma.chatbot.findMany({ where: { tenantId } });
  }

  static async getChatbotById(id: string) {
    return prisma.chatbot.findUnique({ where: { id } });
  }

  static async createChatbot(data: any, tenantId: string) {
    return prisma.chatbot.create({ data: { ...data, tenantId } });
  }

  static async updateChatbot(id: string, data: any) {
    return prisma.chatbot.update({ where: { id }, data });
  }

  static async deleteChatbot(id: string) {
    return prisma.chatbot.delete({ where: { id } });
  }
}
