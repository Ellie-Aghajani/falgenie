import ChatBot from './components/chat/ChatBot';
import { Hero } from './components/Homepage/Hero';

function App() {
   return (
      <>
         <Hero />
         <div className=" p-4 border-0 h-screen">
            <ChatBot />
         </div>
      </>
   );
}

export default App;
