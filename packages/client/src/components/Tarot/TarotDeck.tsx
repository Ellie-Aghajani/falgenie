import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Button } from '../ui/button';

const TAROT_FACES = Array.from({ length: 22 }, (_, i) => i);

type TarotDeckProps = {
   onSelectionComplete: (selected: number[]) => void;
};

export const TarotDeck = ({ onSelectionComplete }: TarotDeckProps) => {
   const [selected, setSelected] = useState<number | null>(null);
   const [revealed, setRevealed] = useState(false);

   // pick a random card
   const randomCard = useMemo(() => {
      const randomIndex = Math.floor(Math.random() * TAROT_FACES.length);
      return TAROT_FACES[randomIndex];
   }, []);

   const handleClick = () => {
      if (selected !== null) return;
      setSelected(randomCard);
   };

   return (
      <div className="relative w-full flex flex-col items-center mt-24">
         {/* ✨ Circle before selection */}
         <AnimatePresence>
            {selected === null && (
               <motion.div
                  key="circle"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  transition={{ duration: 0.8 }}
                  className="absolute mt-45 sm:mt-46 md:mt-49 lg:mt-57 xl:mt-66 2xl:mt-105 flex items-center justify-center w-20 h-20 rounded-full 
                        shadow-[0_0_60px_rgba(255,210,47,0.5)]
                       cursor-pointer hover:scale-105 transition-transform duration-500"
                  onClick={handleClick}
               >
                  <motion.div
                     className="absolute inset-0 rounded-full border border-[#FFD22F]/50"
                     animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                     transition={{ repeat: Infinity, duration: 2 }}
                  />
               </motion.div>
            )}
         </AnimatePresence>

         {/* 🪶 Helper text */}
         <AnimatePresence>
            {selected === null && (
               <motion.p
                  key="helper"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.6 }}
                  className="text-[#FFD22F]/80 font-sans text-base md:text-lg text-center mt-6 whitespace-nowrap translate-y-72"
               >
                  Think of your question, take a deep breath, and tap the
                  circle.
               </motion.p>
            )}
         </AnimatePresence>

         {/* 🔮 Revealed card */}
         <AnimatePresence>
            {selected !== null && !revealed && (
               <motion.div
                  key="card"
                  initial={{ opacity: 0, scale: 0.8, rotateY: 0 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 180 }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="mt-6 w-[110px] h-[180px] md:w-[140px] md:h-[230px]
                       rounded-xl shadow-[0_0_25px_rgba(255,180,60,0.5)] border border-[#B5835A]/70"
                  style={{
                     backgroundImage: `url('/tarot/major/${randomCard}.jpg')`,
                     backgroundSize: 'cover',
                     backgroundPosition: 'center',
                     backfaceVisibility: 'hidden',
                  }}
               />
            )}
         </AnimatePresence>

         {/* ✨ Reveal Button */}
         <AnimatePresence>
            {selected !== null && (
               <motion.div
                  key="button"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                  className="mt-10"
               >
                  <Button
                     variant="falgenie"
                     size="lg"
                     onClick={() => {
                        setRevealed(true);
                        onSelectionComplete([randomCard]);
                     }}
                     style={{
                        transform: 'translateY(100px)',
                     }}
                  >
                     Reveal My Reading ✨
                  </Button>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   );
};
