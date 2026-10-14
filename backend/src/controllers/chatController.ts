import { Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { AuthenticatedRequest } from '../types';
import { AiChatService } from '../services/aiChatService';
import { dataStore } from '../services/dataStore';

export class ChatController {
  public static async sendMessage(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { message, sessionId, language = 'en' } = req.body;

      if (!message || !message.trim()) {
        res.status(400).json({ success: false, message: 'Message content is required.' });
        return;
      }

      const userId = req.user?.id || 'guest';
      let session = dataStore.chatSessions.find(s => s.id === sessionId);

      if (!session) {
        session = {
          id: sessionId || `session-${uuidv4().slice(0, 8)}`,
          userId,
          title: message.slice(0, 35) + '...',
          createdAt: new Date(),
          messages: [],
        };
        dataStore.chatSessions.unshift(session);
      }

      // Append user message
      const userMsg = {
        id: `msg-${uuidv4().slice(0, 8)}`,
        sender: 'USER' as const,
        message,
        language,
        createdAt: new Date(),
      };
      session.messages.push(userMsg);

      // Run AI Chatbot Agronomy Service
      const reply = await AiChatService.answerFarmingQuestion(message, language);

      const botMessageText = language === 'ta' ? reply.replyTa : reply.replyEn;

      const botMsg = {
        id: `msg-${uuidv4().slice(0, 8)}`,
        sender: 'BOT' as const,
        message: botMessageText,
        language,
        createdAt: new Date(),
      };
      session.messages.push(botMsg);

      res.status(200).json({
        success: true,
        data: {
          sessionId: session.id,
          userMessage: userMsg,
          botMessage: botMsg,
          topic: reply.topic,
          suggestedFollowUps: reply.suggestedFollowUps,
          bilingualReply: {
            en: reply.replyEn,
            ta: reply.replyTa,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getHistory(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id || 'guest';
      const userSessions = dataStore.chatSessions.filter(s => s.userId === userId);

      res.status(200).json({
        success: true,
        data: { sessions: userSessions },
      });
    } catch (error) {
      next(error);
    }
  }
}
