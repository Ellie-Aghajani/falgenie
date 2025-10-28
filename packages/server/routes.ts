import express from 'express';
import type { Request, Response } from 'express';
import { chatController } from './controllers/chat.controller';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
   res.send('Hello, World!');
});

router.get('/api/hello', (req: Request, res: Response) => {
   res.json({ message: 'Hello, World!' });
});

let lastResponseId: string | null = null;
//conversationId -> lastResponseId
//conv1 -> 100
//conv2 -> 200

router.post('/api/chat', chatController.sendMessage);

export default router;
