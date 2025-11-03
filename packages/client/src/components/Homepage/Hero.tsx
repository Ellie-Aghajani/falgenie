import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TarotDeck } from '@/components/Tarot/TarotDeck';
import { useTarot } from '@/components/Tarot/TarotContext';

export const Hero = () => {
   const [showIntro, setShowIntro] = useState(true);
   // const [showDeck, setShowDeck] = useState(false);
   // const [showReading, setShowReading] = useState(false);
   const { phase, startReading, setCard } = useTarot();

   return (
      <section
         className="relative h-screen w-full bg-cover bg-center flex flex-col items-center justify-center text-center overflow-hidden"
         style={{
            backgroundImage: "url('/hero.jpg')",
         }}
      >
         <nav
            className="absolute top-0 left-0 right-0 z-30 h-16 px-4 md:px-8
                flex items-center text-white bg-transparent
                supports-[backdrop-filter]:bg-black/20 supports-[backdrop-filter]:backdrop-blur-sm
                border-b border-white/10"
         >
            <a
               href="/"
               className="font-serif macondo-regular text-2xl tracking-wide text-amber-400 hover:text-amber-300 transition"
            >
               FalGenie
            </a>
         </nav>
         {/* Overlay */}
         <AnimatePresence>
            {showIntro && (
               <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-[rgba(10,0,20,0.5)] to-[rgba(0,0,0,0.8)]"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
               />
            )}
         </AnimatePresence>

         {/* Intro Content */}
         <motion.div className="relative z-10 flex flex-col items-center text-white px-6">
            <AnimatePresence>
               {showIntro && (
                  <motion.div
                     key="intro"
                     initial={{ opacity: 0, y: 40 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -20 }}
                     transition={{ duration: 0.8 }}
                     className="flex flex-col items-center"
                  >
                     <h1 className="macondo-regular text-6xl md:text-6xl text-amber-300 drop-shadow-[0_0_15px_rgba(255,200,100,0.3)]">
                        Welcome to FalGenie
                     </h1>

                     <p className="macondo-regular mt-4 text-lg md:text-2xl max-w-2xl text-purple-100 leading-relaxed">
                        Let tarot cards reveal your fortune
                     </p>

                     <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="mt-10"
                     >
                        <Button
                           variant="falgenie"
                           size="lg"
                           onClick={() => {
                              setShowIntro(false);
                              setTimeout(() => startReading(), 800);
                           }}
                           className="macondo-regular"
                        >
                           Begin My Reading
                        </Button>
                     </motion.div>
                  </motion.div>
               )}
            </AnimatePresence>

            {/* Tarot Deck Phase */}
            <AnimatePresence>
               {phase === 'deck' && (
                  <motion.div
                     key="deck"
                     initial={{ opacity: 0, y: 100 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0 }}
                     transition={{ duration: 0.8 }}
                     className="absolute bottom-10 w-full flex justify-center"
                  >
                     <TarotDeck
                        onSelectionComplete={(cards) => {
                           // cards[0] is your random card id from TarotDeck
                           setCard(cards[0]); // ← moves to 'reading' and scrolls to chat
                        }}
                     />
                  </motion.div>
               )}
            </AnimatePresence>

            {/* Reading Phase Placeholder */}
            {/* {phase === 'reading' && (
               <motion.div
                  key="reading"
                  initial={{ opacity: 0, y: 80 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute bottom-0 flex flex-col items-center text-amber-200"
               >
                  <h2 className="text-3xl font-serif mb-4">
                     Your Reading Appears Here ✨
                  </h2>
               </motion.div>
            )} */}
         </motion.div>
      </section>
   );
};
