import React, { useRef, useEffect, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

import pythonImg from "../../assets/skills/python.svg";
import jsImg from "../../assets/skills/javascript.svg";
import nodejsImg from "../../assets/skills/nodejs.svg";
import csharpImg from "../../assets/skills/csharp.svg";
import tensorflowImg from "../../assets/skills/tensorflow.svg";

const projectLearningItems = [
  { img: jsImg, name: "File Converter" },
  { img: jsImg, name: "Cryptocurrency Analyzers" },
  { img: tensorflowImg, name: "AI Models" },
  { img: jsImg, name: "Typing Test" },
  { img: nodejsImg, name: "Utility APIs" },
  { img: pythonImg, name: "Music Loudness Analyzer" },
  { img: csharpImg, name: "Unity & C#" }
];

const UpcomingProjectsAndLearningStack = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.2 });
  const controls = useAnimation();
  const [containerWidth, setContainerWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const contentRef = useRef(null);

  // Calculate dimensions once on mount and on resize
  useEffect(() => {
    const calculateWidths = () => {
      if (containerRef.current && contentRef.current) {
        const container = containerRef.current.getBoundingClientRect();
        const content = contentRef.current.getBoundingClientRect();
        
        setContainerWidth(container.width);
        setContentWidth(content.width);
      }
    };

    calculateWidths();
    
    // Update on resize
    window.addEventListener("resize", calculateWidths);
    return () => window.removeEventListener("resize", calculateWidths);
  }, []);

  // Control animation based on visibility
  useEffect(() => {
    if (isInView) {
      controls.start("animate");
    } else {
      controls.stop();
    }
  }, [isInView, controls, contentWidth]);

  // Create a duplicate array for seamless infinite scroll
  const displayItems = [...projectLearningItems, ...projectLearningItems];

  return (
    <div className="project-learning-stack-container" ref={containerRef}>
      <div className="project-learning-stack">
        <motion.div
          ref={contentRef}
          className="scrolling-items"
          initial="initial"
          animate={controls}
          variants={{
            initial: { x: 0 },
            animate: {
              x: contentWidth > 0 ? -contentWidth / 2 : 0,
              transition: {
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: displayItems.length * 4,
                  ease: "linear"
                }
              }
            }
          }}
        >
          {displayItems.map((item, index) => (
            <div key={index} className="project-learning-item">
              <img
                src={item.img}
                alt={item.name}
                className="project-learning-icon"
              />
              <span className="project-learning-text">
                {item.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default React.memo(UpcomingProjectsAndLearningStack);