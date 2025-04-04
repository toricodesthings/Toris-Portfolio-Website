import { useEffect, useState, useRef, memo } from "react";
import "./Hero.css";

const FlippingText = () => {
  const messages = [
    "Crafting intuitive 🖥️ digital experiences through Full-Stack Engineering",
    "Building 🖌️ elegant and interactive front-ends with React, CSS & Figma",
    "Turning my caffeine addiction ☕ into random useful things 💡",
    "Transforming imaginative ideas into reality through code 🛠️",
    "Writing & Producing 🎸 tracks that capture my evershifting mood",

  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [flip, setFlip] = useState(false);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Clear any existing intervals/timeouts on mount
    const clearTimers = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    
    clearTimers();
    
    // Set up new interval
    intervalRef.current = setInterval(() => {
      setFlip(true);
      
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % messages.length);
        setFlip(false);
      }, 300);
    }, 3000);

    // Clean up on unmount
    return clearTimers;
  }, [messages.length]);

  // Use a memoized message to prevent re-renders
  const currentMessage = messages[currentIndex];

  return (
    <p className={`flip-text ${flip ? "flipping" : ""}`}>
      {currentMessage}
    </p>
  );
};

// Memoize the component to prevent unnecessary re-renders
export default memo(FlippingText);