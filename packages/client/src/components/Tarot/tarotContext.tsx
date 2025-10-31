import React, {
   createContext,
   useContext,
   useState,
   useMemo,
   type ReactNode,
} from 'react';
import tarotCards from '@/data/tarotCards.json';

type TarotPhase = 'intro' | 'deck' | 'reading';

type TarotContextType = {
   phase: TarotPhase;
   selectedCard: number | null;
   selectedCardData: { id: number; name: string; upright: string } | null;
   selectRandomCard: () => void;
   reset: () => void;
};

const TarotContext = createContext<TarotContextType | null>(null);
export const useTarot = () => {
   const ctx = useContext(TarotContext);
   if (!ctx) throw new Error('useTarot must be used within TarotProvider');
   return ctx;
};

export const TarotProvider = ({ children }: { children: ReactNode }) => {
   const [phase, setPhase] = useState<TarotPhase>('intro');
   const [selectedCard, setSelectedCard] = useState<number | null>(null);

   const selectRandomCard = () => {
      const randomIndex = Math.floor(Math.random() * tarotCards.length);
      setSelectedCard(randomIndex);
      setPhase('reading');

      // 🔽 Smooth scroll to chat
      setTimeout(() => {
         document
            .getElementById('chat-section')
            ?.scrollIntoView({ behavior: 'smooth' });
      }, 800);
   };

   const reset = () => {
      setPhase('intro');
      setSelectedCard(null);
   };

   const selectedCardData = useMemo(() => {
      if (selectedCard === null) return null;
      return tarotCards[selectedCard];
   }, [selectedCard]);

   return (
      <TarotContext.Provider
         value={{
            phase,
            selectedCard,
            selectedCardData,
            selectRandomCard,
            reset,
         }}
      >
         {children}
      </TarotContext.Provider>
   );
};
