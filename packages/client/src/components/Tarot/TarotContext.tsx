import {
   createContext,
   useContext,
   useMemo,
   useState,
   type ReactNode,
} from 'react';
import tarotCards from '@/data/tarotCards.json';

type TarotPhase = 'intro' | 'deck' | 'reading';

export type TarotContextType = {
   phase: TarotPhase;
   selectedCard: number | null;
   selectedCardData: { id: number; name: string; upright: string } | null;
   startReading: () => void;
   setCard: (id: number) => void;
   selectRandomCard: () => void;
   reset: () => void;
};

const TarotContext = createContext<TarotContextType | null>(null);
// eslint-disable-next-line react-refresh/only-export-components
export const useTarot = () => {
   const ctx = useContext(TarotContext);
   if (!ctx) throw new Error('useTarot must be used within TarotProvider');
   return ctx;
};

export const TarotProvider = ({ children }: { children: ReactNode }) => {
   const [phase, setPhase] = useState<TarotPhase>('intro');
   const [selectedCard, setSelectedCard] = useState<number | null>(null);

   const startReading = () => setPhase('deck'); // ← NEW (shows the deck UI)

   const setCard = (id: number) => {
      // ← NEW (explicitly choose a card)
      setSelectedCard(id);
      setPhase('reading');
      setTimeout(() => {
         document
            .getElementById('chat-section')
            ?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
   };

   const selectRandomCard = () => {
      const randomIndex = Math.floor(Math.random() * tarotCards.length);
      setCard(randomIndex); // reuse setCard
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
            startReading,
            setCard,
            selectRandomCard,
            reset,
         }}
      >
         {children}
      </TarotContext.Provider>
   );
};
