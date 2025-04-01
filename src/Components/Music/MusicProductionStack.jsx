import React, { useRef, useEffect, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import "./MusicMain.css";

// Music Tools array
import abletonImg from "../../assets/tools/ableton.webp";
import iZotopeOImg from "../../assets/tools/iZotopeOzone.webp";
import iZotopeRXImg from "../../assets/tools/iZotopeRX.webp";
import neuralImg from "../../assets/tools/Neural.webp";
import NIImg from "../../assets/tools/NI.webp";
import reaperImg from "../../assets/tools/reaper.webp";
import uadImg from "../../assets/tools/UAD.webp";
import vitalImg from "../../assets/tools/Vital.webp";
import wavesImg from "../../assets/tools/waves.webp";

const musicTools = [
  { img: abletonImg, name: "Ableton Live", invert: false },
  { img: reaperImg, name: "Reaper", invert: false },
  { img: iZotopeOImg, name: "iZotope Ozone", invert: false },
  { img: iZotopeRXImg, name: "iZotope RX", invert: false },
  { img: uadImg, name: "Universal Audio", invert: false },
  { img: wavesImg, name: "Waves Plugins", invert: true },
  { img: vitalImg, name: "Vital Synth", invert: false },
  { img: neuralImg, name: "Neural DSP", invert: true },
  { img: NIImg, name: "Native Instruments", invert: false }
];

const MusicProdStack = () => {
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
  const displayTools = [...musicTools, ...musicTools];

  return (
    <div className="music-stack-container" ref={containerRef}>
      <div className="music-production-stack">
        <motion.div
          ref={contentRef}
          className="scrolling-icons"
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
                  duration: displayTools.length * 1.5,
                  ease: "linear"
                }
              }
            }
          }}
        >
          {displayTools.map((tool, index) => (
            <div key={index} className="music-tool">
              <img
                src={tool.img}
                alt={tool.name}
                className={`music-tool-icon ${tool.invert ? 'invert' : ''}`}
              />
              <span className="music-tool-text">{tool.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default React.memo(MusicProdStack);