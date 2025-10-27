import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const client = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

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
const conversations = new Map<string, string>();

app.post('/api/chat', async (req: Request, res: Response) => {
   const { prompt, conversationId } = req.body;
   const response = await client.responses.create({
      model: 'gpt-4o-mini',
      input: prompt,
      temperature: 0.7,
      max_output_tokens: 100,
      previous_response_id: conversations.get(conversationId),
   });

   // Each response includes token counts
   const inputTokens = response.usage?.input_tokens ?? 0;
   const outputTokens = response.usage?.output_tokens ?? 0;

   // GPT-4o-mini pricing (as of Oct 2025):
   // $0.00015 per 1K input tokens, $0.0006 per 1K output tokens
   const inputCost = (inputTokens / 1000) * 0.00015;
   const outputCost = (outputTokens / 1000) * 0.0006;
   const totalCost = inputCost + outputCost;

   console.log(
      `Tokens in: ${inputTokens}, out: ${outputTokens}, cost: $${totalCost.toFixed(6)}`
   );
   conversations.set(conversationId, response.id);
   res.json({ message: response.output_text });
});

app.listen(port, () => {
   console.log(`Server is running at http://localhost:${port}`);
});
