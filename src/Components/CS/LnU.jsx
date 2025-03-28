import React, { useRef, useEffect } from "react";

import pythonImg from "../../assets/skills/python.svg";
import jsImg from "../../assets/skills/javascript.svg";
import nodejsImg from "../../assets/skills/nodejs.svg";
import csharpImg from "../../assets/skills/csharp.svg";
import tensorflowImg from "../../assets/skills/tensorflow.svg";

// Example data array for upcoming projects and learning items.
const projectLearningItems = [
  { img: jsImg, name: "Video Extractors" },
  { img: jsImg, name: "Cryptocurrency Analyzers" },
  { img: tensorflowImg, name: "AI Models" },
  { img: jsImg, name: "Typing Test" },
  { img: nodejsImg, name: "Utility APIs" },
  { img: pythonImg, name: "Loudness Analyzer" },
  { img: csharpImg, name: "Unity & C#" }
  // Add more items as needed
];

const UpcomingProjectsAndLearningStack = () => {
    const scrollingIconsRef = useRef(null);
    const requestRef = useRef();
    const previousTimestampRef = useRef();
    const speed = 160;
    let currentX = 0;
  
    useEffect(() => {
      const element = scrollingIconsRef.current;
      if (!element) return;
      const totalWidth = element.scrollWidth / 2;
  
      const animate = (timestamp) => {
        if (!previousTimestampRef.current) {
          previousTimestampRef.current = timestamp;
        }
        const delta = timestamp - previousTimestampRef.current;
        previousTimestampRef.current = timestamp;
  
        currentX += (speed * delta) / 1000;
        if (currentX >= totalWidth) {
          currentX -= totalWidth;
        }
        element.style.transform = `translateX(-${currentX}px)`;
        requestRef.current = requestAnimationFrame(animate);
      };
  
      requestRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(requestRef.current);
    }, []);

  return (
    <div className="project-learning-stack-container">
      <div className="project-learning-stack">
        <div ref={scrollingIconsRef} className="scrolling-items">
          {[...projectLearningItems, ...projectLearningItems].map((item, index) => (
            <div key={index} className="project-learning-item">
              <img
                src={item.img}
                alt={item.name}
                className="project-learning-icon"
              />
              <span className="project-learning-text">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(UpcomingProjectsAndLearningStack);