import ChatBot from './components/chat/ChatBot';
import { Hero } from './components/Homepage/Hero';
import { TarotProvider } from './components/Tarot/TarotContext';

function App() {
   return (
      <TarotProvider>
         <Hero />
         <section id="chat-section" className="p-4 border-0 min-h-screen">
            <ChatBot />
         </section>
      </TarotProvider>
   );
}

export default App;
