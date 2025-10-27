import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { z } from 'zod';
import { conversationRepository } from './repositories/conversation.repository';
import { chatService } from './services/chat.service';

dotenv.config();

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
   res.send('Hello, World!');
});

app.get('/api/hello', (req: Request, res: Response) => {
   res.json({ message: 'Hello, World!' });
});

let lastResponseId: string | null = null;
//conversationId -> lastResponseId
//conv1 -> 100
//conv2 -> 200

const ChatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt is required')
      .max(1000, 'Prompt is too long (max 1000 characters)'),
   conversationId: z.uuid(),
});

app.post('/api/chat', async (req: Request, res: Response) => {
   const parseResult = ChatSchema.safeParse(req.body);
   if (!parseResult.success) {
      const tree = z.treeifyError(parseResult.error);
      return res.status(400).json(tree);
   }

   const { prompt, conversationId } = req.body;
   try {
      const response = await chatService.sendMessage(prompt, conversationId);
      res.json({ message: response.message });
   } catch (error) {
      res.status(500).json({ error: 'Error communicating with OpenAI API' });
   }
});

app.listen(port, () => {
   console.log(`Server is running at http://localhost:${port}`);
});
