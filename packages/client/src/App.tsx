import { useState, useEffect } from 'react';
import { Button } from './components/ui/button';

function App() {
   const [message, setMessage] = useState<string>('');

   useEffect(() => {
      fetch('api/hello')
         .then((res) => res.json())
         .then((data) => setMessage(data.message));
   }, []);
   return (
      <>
         <div className="min-h-screen flex items-center justify-center">
            <p className="text-lg font-bold p-4">{message}</p>
            <Button>Ask Falgenie</Button>
         </div>
      </>
   );
}

export default App;
