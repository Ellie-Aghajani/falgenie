import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Button } from '../ui/button';

const TAROT_FACES = Array.from({ length: 22 }, (_, i) => i);

type TarotDeckProps = {
   onSelectionComplete: (selected: number[]) => void;
};

export const TarotDeck = ({ onSelectionComplete }: TarotDeckProps) => {
   // Shuffle once per render session
   const shuffled = useMemo(
      () => [...TAROT_FACES].sort(() => Math.random() - 0.5),
      []
   );

   const [selected, setSelected] = useState<number[]>([]);

   const selectionComplete = selected.length === 3;

   const handleSelect = (index: number) => {
      if (selectionComplete) return;
      const cardId = shuffled[index];
      if (selected.includes(cardId)) return;

      const updated = [...selected, cardId];
      setSelected(updated);
   };

   return (
      <div className="relative w-full flex flex-col items-center">
         {/* 🔮 Desk Background */}
         <div
            className="absolute inset-x-0 bottom-0 h-[75%] bg-cover bg-center"
            style={{ backgroundPosition: 'center bottom' }}
         />

         {/* 🃏 Card Fan */}
         <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="relative w-full flex flex-col justify-center perspective-distant mt-16 translate-y-66"
            style={{ transformOrigin: 'center center' }}
         >
            {shuffled.map((cardId, i) => {
               // Fan layout math
               const mid = shuffled.length / 2;
               const xOffset = (i - mid) * -0.5; // spacing
               const angle = (i - mid) * 5; // invert rotation so the fan flips
               const yOffset = -Math.abs(i - mid) * 1; // raise outer cards for an inverted arc
               const isSelected = selected.includes(cardId);

               return (
                  <motion.div
                     key={cardId}
                     onClick={() => handleSelect(i)}
                     className="absolute cursor-pointer"
                     style={{
                        transformOrigin: 'top center',
                        transform: `translateX(${xOffset}px) translateY(${yOffset}px) rotate(${angle}deg)`,
                        zIndex: isSelected ? 999 : i,
                     }}
                     whileHover={
                        !selectionComplete ? { y: -15, scale: 1.05 } : {}
                     }
                     transition={{
                        type: 'spring',
                        stiffness: 200,
                        damping: 12,
                     }}
                  >
                     <motion.div
                        className="relative w-[50px] h-[70px] md:w-10 md:h-[60px]"
                        animate={{
                           rotateY: isSelected ? 180 : 0,
                        }}
                        transition={{ duration: 0.8 }}
                        style={{
                           transformStyle: 'preserve-3d',
                        }}
                     >
                        {/* Card Back */}
                        <div
                           className="absolute inset-0 rounded-xl border border-[#B5835A]/70 
                             shadow-[0_0_15px_rgba(255,180,60,0.25)]"
                           style={{
                              backgroundImage: "url('/tarot/backs/back.jpg')",
                              backgroundSize: 'contain',
                              backgroundPosition: 'center',
                              backfaceVisibility: 'hidden',
                           }}
                        />

                        {/* Card Front */}
                        {/* <div
                           className="absolute inset-0 rounded-r-sm border border-[#B5835A]/80 
                             shadow-[0_0_25px_rgba(255,180,60,0.4)]"
                           style={{
                              backgroundImage: `url('/tarot/major/${cardId}.jpg')`,
                              backgroundSize: 'contain',
                              backgroundPosition: 'center',
                              backfaceVisibility: 'hidden',
                              transform: 'rotateY(180deg)',
                           }}
                        /> */}
                     </motion.div>
                  </motion.div>
               );
            })}
         </motion.div>

         {/* 🪶 Helper text under deck */}
         <AnimatePresence>
            {!selectionComplete && (
               <motion.p
                  key="prompt"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="text-[#FFD22F]/80 font-sans text-xl md:text-md text-center w-screen whitespace-nowrap translate-y-78"
               >
                  Think of your question, take a deep breath, and choose a card.
               </motion.p>
            )}
         </AnimatePresence>

         {/* ✨ Fade out unselected cards when done */}
         <AnimatePresence>
            {selectionComplete && (
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                  className="absolute -bottom-20 z-50"
               >
                  <Button
                     variant="falgenie"
                     size="lg"
                     onClick={() => onSelectionComplete(selected)}
                  >
                     Reveal My Reading ✨
                  </Button>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   );
};
