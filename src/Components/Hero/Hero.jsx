import React, { useState, useEffect } from "react";
import "./Hero.css";
import { Link } from "react-router-dom";
import profile_img from "../../assets/profileimg1.webp";
import profile_img2 from "../../assets/profileimg2.webp";
import music_img from "../../assets/mainpage/music.webp";
import cs_img from "../../assets/mainpage/cs.webp";
import { useAnimationStore } from "../../store/animationStore";
import FlippingText from "./FlippingMsg";

const Hero = () => {
  const { hasTypingAnimationPlayed, setHasTypingAnimationPlayed } = useAnimationStore();
  const [displayedText, setDisplayedText] = useState("");
  const [showContent, setShowContent] = useState(false);
  const [showWorkOptions, setShowWorkOptions] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  const gradientText = "Hi there! I'm Tori,";
  const remainingText = " Developer and Artist based in Ottawa.";
  const fullString = `${gradientText}${remainingText}`;

  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const handleLoad = () => setPageLoaded(true);
    if (document.readyState === "complete") {
      setPageLoaded(true);
    } else {
      window.addEventListener("load", handleLoad);
    }
    return () => window.removeEventListener("load", handleLoad);
  }, []);

  useEffect(() => {
    if (!pageLoaded) return;
    if (hasTypingAnimationPlayed) {
      setDisplayedText(fullString);
      setShowContent(true);
      return;
    }

    const animationStartDelay = 100;
    const timeoutId = setTimeout(() => {
      let startTime = null;
      const durationPerChar = 30;

      const animate = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const index = Math.floor(elapsed / durationPerChar);
        if (index < fullString.length) {
          setDisplayedText(fullString.substring(0, index + 1));
          requestAnimationFrame(animate);
        } else {
          setDisplayedText(fullString);
          setTimeout(() => {
            setShowContent(true);
            setHasTypingAnimationPlayed();
          }, 50);
        }
      };

      requestAnimationFrame(animate);
    }, animationStartDelay);

    return () => clearTimeout(timeoutId);
  }, [pageLoaded, fullString, hasTypingAnimationPlayed, setHasTypingAnimationPlayed]);

  return (
    <div className="hero-container">
      <div className={`hero ${showWorkOptions ? "blurred" : ""}`}>
        <div className="image-container pop-in" onClick={() => setFlipped(!flipped)}>
          <div className="image-glow"></div>
          <div className={`flip-card-inner ${flipped ? 'flipped' : ''}`}>
            <div className="flip-card-front">
              <img src={profile_img} alt="Profile" />
            </div>
            <div className="flip-card-back">
              <img src={profile_img2} alt="Profile2" />
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
            <span class="pulse-layer"></span>
            <span class="pulse-layer"></span>
            <span class="pulse-layer"></span>
            <span class="pulse-layer"></span>
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
                <img src={cs_img} alt="Coding Projects" />
              </div>
              <div className="option-glow"></div>
              <h2>Computer Science</h2>
            </Link>

            <Link to="/music" className="work-option-box pop-in">
              <div className="option-image-container">
                <img src={music_img} alt="Music" />
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
