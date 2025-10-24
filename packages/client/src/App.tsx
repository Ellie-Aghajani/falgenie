import { useState, useEffect } from "react";

function App() {
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    fetch("api/hello")
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);
  return (
    <>
      <p className="text-lg font-bold p-4">{message}</p>
      <div className="min-h-screen bg-purple-100 flex items-center justify-center">
        <h1 className="text-4xl font-bold text-purple-800">
          Tailwind v4.1 is working ✨
        </h1>
      </div>
    </>
  );
}

export default App;
