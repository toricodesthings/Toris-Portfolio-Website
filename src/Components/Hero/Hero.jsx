import React, { useState, useEffect, useRef, memo } from "react";
import "./Hero.css";
import { Link } from "react-router-dom";
import { useAnimationStore } from "../../store/animationStore";
import FlippingText from "./FlippingMsg";

const MemoizedFlippingText = memo(FlippingText);

// Pre-load profile images
const PROFILE_IMG1 = "/heropage/profileimg1.webp";
const PROFILE_IMG2 = "/heropage/profileimg2.webp";

// Extract overlay to separate component to reduce re-renders of main component
const WorkOptionsOverlay = memo(({ onClose }) => (
  <div className="work-options-overlay" onClick={onClose}>
    <div className="work-options-container" onClick={(e) => e.stopPropagation()}>
      <Link to="/projects" className="work-option-box pop-in">
        <div className="option-image-container">
          <img
            src="/heropage/cs.webp"
            alt="Coding Projects"
            loading="lazy"
            width="400"
            height="300"
          />
        </div>
        <div className="option-glow"></div>
        <h2>Computer Science</h2>
      </Link>

      <Link to="/music" className="work-option-box pop-in">
        <div className="option-image-container">
          <img
            src="/heropage/music.webp"
            alt="Music"
            loading="lazy"
            width="400"
            height="300"
          />
        </div>
        <div className="option-glow"></div>
        <h2>Music</h2>
      </Link>
    </div>
  </div>
));

// Memoize the ProfileImage component
const ProfileImage = memo(({ flipped, onClick }) => (
  <div className="image-container pop-in" onClick={onClick}>
    <div className="image-glow"></div>
    <div className={`flip-card-inner ${flipped ? 'flipped' : ''}`}>
      <div className="flip-card-front">
        <img
          src={PROFILE_IMG1}
          alt="Profile"
          loading="eager"
          width="300"
          height="300"
        />
      </div>
      <div className="flip-card-back">
        <img
          src={PROFILE_IMG2}
          alt="Profile2"
          loading="lazy"
          width="300"
          height="300"
        />
      </div>
    </div>
  </div>
));

const TextWithLayers = memo(({ displayedText, gradientText, typingComplete, showBlurLayers }) => {
  return (
    <h1 className={`pop-in ${typingComplete ? "fade-in" : ""}`}>
      <span className="text-wrapper">
        {/* Main text - always displayed */}
        <span className="text-front">
          <span className="gradient">
            {displayedText.substring(0, gradientText.length)}
          </span>
          {displayedText.substring(gradientText.length)}
          {!typingComplete && <span className="typing-cursor">|</span>}
        </span>

        {/* Back layers - only render when typing is complete and showBlurLayers is true */}
        {typingComplete && showBlurLayers && (
          <>
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
            <span className="text-back layer5">
              <span className="gradient">
                {displayedText.substring(0, gradientText.length)}
              </span>
              {displayedText.substring(gradientText.length)}
            </span>
          </>
        )}
      </span>
    </h1>
  );
});


const Hero = () => {
  const { hasTypingAnimationPlayed, setHasTypingAnimationPlayed } = useAnimationStore();
  const [displayedText, setDisplayedText] = useState("");
  const [showContent, setShowContent] = useState(false);
  const [showWorkOptions, setShowWorkOptions] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [typingComplete, setTypingComplete] = useState(false);
  const [showBlurLayers, setShowBlurLayers] = useState(false);

  const animationFrameId = useRef(null);
  const timeoutId = useRef(null);

  useEffect(() => {
    // Preload hero images
    const preloadImages = [PROFILE_IMG1, PROFILE_IMG2, "/heropage/cs.webp", "/heropage/music.webp"];
    preloadImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });

    const glassEffectTimeout = setTimeout(() => {
      setShowGlassEffect(true);
    }, 2000); 

    return () => clearTimeout(glassEffectTimeout);
  }, []);

  const gradientText = "Hi there! I'm Tori,";
  const remainingText = " Developer and Artist based in Ottawa.";
  const fullString = `${gradientText}${remainingText}`;

  useEffect(() => {
    // If animation has already played, show everything immediately
    if (hasTypingAnimationPlayed) {
      setDisplayedText(fullString);
      setTypingComplete(true);
      setShowContent(true);
      setShowBlurLayers(true);
      return;
    }

    const animationStartDelay = 25;

    timeoutId.current = setTimeout(() => {
      let startTime = null;
      const durationPerChar = 30;

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const index = Math.min(Math.floor(elapsed / durationPerChar), fullString.length - 1);

        setDisplayedText(fullString.substring(0, index + 1));

        if (index < fullString.length - 1) {
          animationFrameId.current = requestAnimationFrame(animate);
        } else {
          setTypingComplete(true);

          setShowContent(true);
          setHasTypingAnimationPlayed();

          setTimeout(() => {
            setShowBlurLayers(true);
          }, 300); 
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
  }, [fullString, hasTypingAnimationPlayed, setHasTypingAnimationPlayed, showContent]);

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
        <ProfileImage flipped={flipped} onClick={() => setFlipped(!flipped)} />
        <TextWithLayers
          displayedText={displayedText}
          gradientText={gradientText}
          typingComplete={typingComplete}
          showBlurLayers={showBlurLayers}
        />

        <p className={`${showContent ? "pop-in" : "hidden-content"}`}>
          <MemoizedFlippingText />
        </p>
        <div className={`hero-buttons ${showContent ? "pop-in" : "hidden-content"}`}>
          <div className="radiate">
            <span className="pulse-layer"></span>
            <span className="pulse-layer"></span>
            <span className="pulse-layer"></span>
            <span className="pulse-layer"></span>
            <button
              className="hero-viewbtn"
              onClick={() => setShowWorkOptions(true)}
            >
              See My Work
            </button>
          </div>
          <Link to="/contact" className="hero-connectbtn">
            Contact Me
          </Link>
        </div>
      </div>

      {showWorkOptions && <WorkOptionsOverlay onClose={() => setShowWorkOptions(false)} />}
    </div>
  );
};

export default Hero;