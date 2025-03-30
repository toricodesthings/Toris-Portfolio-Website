import { useEffect, useState } from "react";
import "./Hero.css";

const FlippingText = () => {
  const messages = [
    "Crafting intuitive 🖥️ digital experiences through Full-Stack Engineering",
    "Building elegant, and interactive 🖌️ UIs with React, CSS & Figma",
    "Writing & Producing 🎸 tracks that capture my evershifting mood",
    "Turning my caffeine addiction ☕ into random useful things 💡"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setFlip(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % messages.length);
        setFlip(false); // Reset flip after text switch
      }, 300); 
    }, 3000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <p className={`flip-text ${flip ? "flipping" : ""}`}>
      {messages[currentIndex]}
    </p>
  );
};

export default FlippingText;
