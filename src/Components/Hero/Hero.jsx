import React, { useState, useEffect, useRef } from "react";
import "./Hero.css";
import { Link } from "react-router-dom";
import { useAnimationStore } from "../../store/animationStore";
import FlippingText from "./FlippingMsg";

const Hero = () => {
  const { hasTypingAnimationPlayed, setHasTypingAnimationPlayed } = useAnimationStore();
  const [displayedText, setDisplayedText] = useState("");
  const [showContent, setShowContent] = useState(false);
  const [showWorkOptions, setShowWorkOptions] = useState(false);

  const [flipped, setFlipped] = useState(false);

  const animationFrameId = useRef(null);
  const timeoutId = useRef(null); // For the initial delay

  const gradientText = "Hi there! I'm Tori,";
  const remainingText = " Developer and Artist based in Ottawa.";
  const fullString = `${gradientText}${remainingText}`;

  useEffect(() => {
    // If animation has already played, show everything immediately
    if (hasTypingAnimationPlayed) {
      setDisplayedText(fullString);
      setShowContent(true);
      return;
    }

    const animationStartDelay = 25; 

    timeoutId.current = setTimeout(() => {
      let startTime = null;
      const durationPerChar = 30; 

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const index = Math.min(Math.floor(elapsed / durationPerChar), fullString.length -1); // Ensure index stays within bounds

        setDisplayedText(prevText => {
            const nextSubstring = fullString.substring(0, index + 1);
            return prevText === nextSubstring ? prevText : nextSubstring;
        });

        if (index < fullString.length - 1) {
          animationFrameId.current = requestAnimationFrame(animate);
        } else {
          setDisplayedText(fullString);
        
          setTimeout(() => {
            setShowContent(true);
            setHasTypingAnimationPlayed();
          }, 50); 
        }
      };

      animationFrameId.current = requestAnimationFrame(animate);
    }, animationStartDelay);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId.current);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [fullString, hasTypingAnimationPlayed, setHasTypingAnimationPlayed]); // Dependencies are correct

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowWorkOptions(false);
      }
    };

    if (showWorkOptions) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
        window.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = '';
    };
  }, [showWorkOptions]);

  return (
    <div className="hero-container">
      <div className={`hero ${showWorkOptions ? "blurred" : ""}`}>
        <div className="image-container pop-in" onClick={() => setFlipped(!flipped)}>
          <div className="image-glow"></div>
          <div className={`flip-card-inner ${flipped ? 'flipped' : ''}`}>
            <div className="flip-card-front">
              <img src="/heropage/profileimg1.webp" alt="Profile" fetchpriority="high" loading="eager" />
            </div>
            <div className="flip-card-back">
              <img src="/heropage/profileimg2.webp" alt="Profile2" />
            </div>
          </div>
        </div>

        <h1 className={`pop-in ${showContent ? "fade-in" : ""}`}>
          <span className="text-wrapper">
            {/* Blurred copy for the glass effect */}
            <span className="text-back">
              <span className="gradient">
                {displayedText.substring(0, gradientText.length)}
              </span>
              {displayedText.substring(gradientText.length)}
            </span>
            <span className="text-back layer2">
              <span className="gradient">
                {displayedText.substring(0, gradientText.length)}
              </span>
              {displayedText.substring(gradientText.length)}
            </span>
            <span className="text-back layer3">
              <span className="gradient">
                {displayedText.substring(0, gradientText.length)}
              </span>
              {displayedText.substring(gradientText.length)}
            </span>
            <span className="text-back layer4">
              <span className="gradient">
                {displayedText.substring(0, gradientText.length)}
              </span>
              {displayedText.substring(gradientText.length)}
            </span>
            {/* Foreground text with typing effect */}
            <span className={`text-front ${displayedText.length < fullString.length ? "typing" : ""}`}>
              <span className="gradient">
                {displayedText.substring(0, gradientText.length)}
              </span>
              {displayedText.substring(gradientText.length)}
            </span>
          </span>
        </h1>

        <p className={`${showContent ? "pop-in" : "hidden-content"}`}>
          <FlippingText />
        </p>
        <div className={`hero-buttons ${showContent ? "pop-in" : "hidden-content"}`}>
          <div className="radiate">
            <span className="pulse-layer"></span>
            <span className="pulse-layer"></span>
            <span className="pulse-layer"></span>
            <span className="pulse-layer"></span>
            <button className="hero-viewbtn" onClick={() => setShowWorkOptions(true)}>
              See My Work
            </button>
          </div>
          <Link to="/contact" className="hero-connectbtn">
            Contact Me
          </Link>
        </div>
      </div>

      {showWorkOptions && (
        <div className="work-options-overlay" onClick={() => setShowWorkOptions(false)}>
          <div className="work-options-container" onClick={(e) => e.stopPropagation()}>
            <Link to="/projects" className="work-option-box pop-in">
              <div className="option-image-container">
                <img src="/heropage/cs.webp" alt="Coding Projects" />
              </div>
              <div className="option-glow"></div>
              <h2>Computer Science</h2>
            </Link>

            <Link to="/music" className="work-option-box pop-in">
              <div className="option-image-container">
                <img src="/heropage/music.webp" alt="Music" />
              </div>
              <div className="option-glow"></div>
              <h2>Music</h2>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;
