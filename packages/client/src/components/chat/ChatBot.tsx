import axios from 'axios';
import { useForm } from 'react-hook-form';
import { FaArrowUp } from 'react-icons/fa';
import { useRef, useState, useEffect } from 'react';
import TypingIndicator from './TypingIndicator';
import type { Message } from './ChatMessages';
import ChatMessages from './ChatMessages';
import { Button } from '../ui/button';
import { useTarot } from '../Tarot/TarotContext';

type FormData = {
   prompt: string;
};

type ChatResponse = {
   message: string;
};

const ChatBot = () => {
   const { selectedCardData, phase } = useTarot();
   const [messages, setMessages] = useState<Message[]>([]);
   const [isBotTyping, setIsBotTyping] = useState(false);
   const [error, setError] = useState('');
   const seeded = useRef(false); // prevent double-seeding
   // Seed intro when a card is chosen
   // 🔮 Seed an enigmatic first message without revealing the card name
   useEffect(() => {
      const seedIntro = async () => {
         if (seeded.current) return;
         if (phase !== 'reading' || !selectedCardData) return;
         seeded.current = true;
         setIsBotTyping(true);
         try {
            const prompt = `
            You are FalGenie, a tarot guide. The drawn card must NOT be named.
            Card meaning/context: "${selectedCardData.upright}".

            Write a compact reading in **exactly four short paragraphs**, each 2 sentences, separated by single blank lines.
            Use Markdown with a bold label at the start of each paragraph:
            **Dear Seeker**✨, overall energy and key theme (metaphors welcome).
            **Love** — dynamics in relationships (single or partnered), include one gentle suggestion.
            **Career** — opportunities or blocks at work/study; one practical nudge.
            **Health** — mood, energy, or habits; one supportive micro-action.
            Rules: do NOT name or hint the specific card; avoid clichés; no lists; vary sentence lengths; end with a gentle invitation: "When you’re ready, ask a question to go deeper."
             `.trim();

            const { data } = await axios.post<ChatResponse>('/api/chat', {
               prompt,
               conversationId: conversationId.current,
            });
            setMessages([{ role: 'bot', content: data.message }]);
         } catch (e) {
            console.error(e);
            setMessages([
               {
                  role: 'bot',
                  content:
                     "Let's begin. Breathe in slowly—what question is tugging at you?",
               },
            ]);
         } finally {
            setIsBotTyping(false);
         }
      };
      seedIntro();
   }, [phase, selectedCardData]);
   const conversationId = useRef(crypto.randomUUID());
   const { register, handleSubmit, reset, formState } = useForm<FormData>({
      mode: 'onChange',
   });

   const onSubmit = async ({ prompt }: FormData) => {
      try {
         if (!selectedCardData) return; // don’t chat before a card is drawn
         setMessages((prev) => [...prev, { role: 'user', content: prompt }]);
         setIsBotTyping(true);
         setError('');
         reset({ prompt: '' });
         // Constrain model to THIS card only
         const constrained = `
         You are FalGenie. The drawn card must remain unnamed.
         Card meaning/context: "${selectedCardData.upright}".
         Respond to the user's question in a **single short paragraph (2–4 sentences)**.
         Be **concise** and **conversational**. **Do not** repeat or summarize the original four-part reading.
         **Do not** use headings, labels, lists, or section breaks. Avoid restating general meanings unless directly needed.
         Stay strictly within this card's symbolism; if the question is off-topic, gently steer back with one sentence.

         User: "${prompt}"
         `.trim();

         const { data } = await axios.post<ChatResponse>('/api/chat', {
            prompt: constrained,
            conversationId: conversationId.current,
         });
         setMessages((prev) => [
            ...prev,
            { role: 'bot', content: data.message },
         ]);
      } catch (error) {
         console.error(error);
         setIsBotTyping(false);
         setError('Failed to fetch response. Please try again.');
      } finally {
         setIsBotTyping(false);
      }
   };

   const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(onSubmit)();
      }
   };

   return (
      <div className="flex flex-col h-full">
         <div className="flex flex-col flex-1 gap-3 mb-10 pr-2 overflow-y-auto ">
            <ChatMessages messages={messages} />
            {isBotTyping && <TypingIndicator />}
            {error && <div className="text-red-500 text-center">{error}</div>}
         </div>
         <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={onKeyDown}
            className="flex flex-col gap-2 items-end border-2 p-3 rounded-lg"
         >
            <textarea
               {...register('prompt', {
                  required: true,
                  validate: (data) => data.trim().length > 0,
               })}
               // autoFocus
               disabled={!selectedCardData}
               className="w-full border-0 focus:outline-0 resize-none disabled:opacity-60 disabled:cursor-not-allowed"
               placeholder={
                  selectedCardData
                     ? `Ask me anything about your reading…`
                     : 'Draw a card first ✨'
               }
               maxLength={1000}
            />
            <Button
               disabled={!formState.isValid || !selectedCardData}
               className="rounded-full w-11 h-11"
            >
               <FaArrowUp />
            </Button>
         </form>
      </div>
   );
};
export default ChatBot;
