import axios from 'axios';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import { Button } from './button';
import { FaArrowUp } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';

type FormData = {
   prompt: string;
};

type ChatResponse = {
   message: string;
};

type Message = {
   role: 'user' | 'bot';
   content: string;
};

const ChatBot = () => {
   const [messages, setMessages] = useState<Message[]>([]);
   const [isBotTyping, setIsBotTyping] = useState(false);
   const formRef = useRef<HTMLFormElement | null>(null);
   const conversationId = useRef(crypto.randomUUID());
   const { register, handleSubmit, reset, formState } = useForm<FormData>({
      mode: 'onChange',
   });

   useEffect(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages]);

   const onSubmit = async ({ prompt }: FormData) => {
      setMessages((prev) => [...prev, { role: 'user', content: prompt }]);
      setIsBotTyping(true);
      reset();
      const { data } = await axios.post<ChatResponse>('/api/chat', {
         prompt,
         conversationId: conversationId.current,
      });
      setMessages((prev) => [...prev, { role: 'bot', content: data.message }]);
      setIsBotTyping(false);
   };

   const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(onSubmit)();
      }
   };

   const onCopyMessage = (e: React.ClipboardEvent<HTMLParagraphElement>) => {
      const selection = window.getSelection()?.toString().trim();
      if (selection) {
         e.preventDefault();
         e.clipboardData.setData('text/plain', selection);
      }
   };
   return (
      <div>
         <div className="flex flex-col gap-3 mb-10">
            {messages.map((message, index) => (
               <p
                  key={index}
                  onCopy={onCopyMessage}
                  className={`px-3 py-1 rounded-xl ${
                     message.role === 'user'
                        ? 'bg-indigo-500 text-white text-right self-end'
                        : 'bg-gray-100 text-left self-start '
                  }`}
               >
                  <ReactMarkdown>{message.content}</ReactMarkdown>
               </p>
            ))}
            {isBotTyping && (
               <div className="flex self-start gap-1 px-3 py-3 bg-gray-100 rounded-xl  ">
                  <div className="w-2 h-2  bg-gray-800 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2  bg-gray-800 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2  bg-gray-800 rounded-full animate-pulse [animation-delay:0.4s]"></div>
               </div>
            )}
         </div>
         <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={onKeyDown}
            ref={formRef}
            className="flex flex-col gap-2 items-end border-2 p-4 rounded-lg"
         >
            <textarea
               {...register('prompt', {
                  required: true,
                  validate: (data) => data.trim().length > 0,
               })}
               className="w-full border-0 focus:outline-0 resize-none"
               placeholder="Ask me anything"
               maxLength={1000}
            />
            <Button
               disabled={!formState.isValid}
               className="rounded-full w-9 h-9"
            >
               <FaArrowUp />
            </Button>
         </form>
      </div>
   );
};
export default ChatBot;
