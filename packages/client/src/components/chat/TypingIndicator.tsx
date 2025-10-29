import React from 'react';

const TypingIndicator = () => {
   return (
      <div className="flex self-start gap-1 px-3 py-3 bg-[var(--chat-bot-bg)]   rounded-xl  ">
         <Dot />
         <Dot className="[animation-delay:0.2s]" />
         <Dot className="[animation-delay:0.4s]" />
      </div>
   );
};
type DotProps = {
   className?: string;
};
const Dot = ({ className }: DotProps) => (
   <div
      className={`w-2 h-2  bg-[#E8C78F] rounded-full animate-pulse ${className} `}
   ></div>
);

export default TypingIndicator;
