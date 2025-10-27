import type { Request, Response } from 'express';
import { chatService } from '../services/chat.service';
import { z } from 'zod';

//implementation detail
const ChatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt is required')
      .max(1000, 'Prompt is too long (max 1000 characters)'),
   conversationId: z.uuid(),
});

//public interface
export const chatController = {
   async sendMessage(req: Request, res: Response) {
      const parseResult = ChatSchema.safeParse(req.body);
      if (!parseResult.success) {
         const tree = z.treeifyError(parseResult.error);
         return res.status(400).json(tree);
      }

      try {
         const { prompt, conversationId } = req.body;
         const response = await chatService.sendMessage(prompt, conversationId);
         res.json({ message: response.message });
      } catch (error) {
         res.status(500).json({ error: 'Error communicating with OpenAI API' });
      }
   },
};
