"use client";

import { useEffect, useState } from "react";

const Loader = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <p className="text-white text-lg font-medium flex">
        Loading
        <span className="inline-block w-[1.5ch]">{dots}</span>
      </p>
    </div>
  );
};

export default Loader;

