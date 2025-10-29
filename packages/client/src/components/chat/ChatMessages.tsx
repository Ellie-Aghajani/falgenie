import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

export type Message = {
   role: 'user' | 'bot';
   content: string;
};

type Props = {
   messages: Message[];
};
const ChatMessages = ({ messages }: Props) => {
   const lastMessageRef = useRef<HTMLDivElement | null>(null);
   useEffect(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages]);

   const onCopyMessage = (e: React.ClipboardEvent<HTMLParagraphElement>) => {
      const selection = window.getSelection()?.toString().trim();
      if (selection) {
         e.preventDefault();
         e.clipboardData.setData('text/plain', selection);
      }
   };
   return (
      <div className="flex flex-col gap-3  ">
         {messages.map((message, index) => (
            <div
               key={index}
               onCopy={onCopyMessage}
               ref={index === messages.length - 1 ? lastMessageRef : null}
               className={`px-3 py-1 rounded-xl ${
                  message.role === 'user'
                     ? 'bg-[var(--chat-user-bg)] text-[var(--chat-user-text)] border border-[var(--chat-border)] shadow-[0_0_15px_rgba(255,180,60,0.2)] text-right self-end'
                     : 'bg-[var(--chat-bot-bg)] text-[var(--chat-bot-text)] border border-[var(--chat-border)] shadow-[0_0_15px_rgba(255,180,60,0.2)] text-left self-start'
               }`}
            >
               <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
         ))}
      </div>
   );
};

export default ChatMessages;
