import express from 'express';
import type { Request, Response } from 'express';
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
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

// ---- visits: file persistence ----
const DATA_DIR = path.join(process.cwd(), 'data');
const VISITS_FILE = path.join(DATA_DIR, 'visits.json');

let visits = 0;

// Init on startup (sync = simple & safe for boot)
try {
   fs.mkdirSync(DATA_DIR, { recursive: true });
   if (fs.existsSync(VISITS_FILE)) {
      const raw = fs.readFileSync(VISITS_FILE, 'utf8');
      const parsed = JSON.parse(raw || '{"visits":0}');
      visits = Number(parsed.visits) || 0;
   } else {
      fs.writeFileSync(
         VISITS_FILE,
         JSON.stringify({ visits: 0 }, null, 2),
         'utf8'
      );
   }
} catch (err) {
   console.error('Visits init failed:', err);
   visits = 0;
}
// Helper to persist (async; fire-and-forget)
const persistVisits = () =>
   fsp
      .writeFile(VISITS_FILE, JSON.stringify({ visits }, null, 2), 'utf8')
      .catch((e) => console.error('Visits persist failed:', e));

router.get('/api/visits', (_req: Request, res: Response) => {
   res.json({ visits });
});

router.post('/api/visits', (_req: Request, res: Response) => {
   visits += 1;
   persistVisits();
   res.json({ visits });
});

export default router;
