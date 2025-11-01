import { OpenAI } from 'openai';
import { conversationRepository } from '../repositories/conversation.repository';

//implementation detail
const client = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});
//solve: leaky abstraction
type ChatResponse = {
   id: string;
   message: string;
};

//public interface

export const chatService = {
   async sendMessage(
      prompt: string,
      conversationId: string
   ): Promise<ChatResponse> {
      const response = await client.responses.create({
         model: 'gpt-4o-mini',
         input: prompt,
         temperature: 0.7,
         max_output_tokens: 300,
         previous_response_id:
            conversationRepository.getLastResponseId(conversationId),
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
      conversationRepository.setLastResponseId(conversationId, response.id);
      return {
         id: response.id,
         message: response.output_text,
      };
   },
};
