import React, { useEffect, useRef } from 'react';
import "./MusicMain.css";

// Music Tools array remains the same
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
  const scrollingIconsRef = useRef(null);
  const requestRef = useRef();
  const previousTimestampRef = useRef();
  const speed = 100;
  let currentX = 0;

  useEffect(() => {
    const element = scrollingIconsRef.current;
    if (!element) return;
    const totalWidth = element.scrollWidth;

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
    <div className="music-stack-container">
      <div className='music-production-stack'>
        <div ref={scrollingIconsRef} className="scrolling-icons">
          {[...musicTools, ...musicTools].map((tool, index) => (
            <div key={index} className="music-tool">
              <img
                src={tool.img}
                alt={tool.name}
                className={`music-tool-icon ${tool.invert ? 'invert' : ''}`}
              />
              <span className="music-tool-text">{tool.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MusicProdStack;
