import React, { useState, useEffect } from "react";
import "./Hero.css";
import { Link } from "react-router-dom";
import profile_img from "../../assets/temp_profileimg.png";

import music_img from "../../assets/mainpage/music.png";
import cs_img from "../../assets/mainpage/cs.webp";

import { useAnimationStore } from "../../store/animationStore";

const Hero = () => {
  const { hasTypingAnimationPlayed, setHasTypingAnimationPlayed } = useAnimationStore();
  const [displayedText, setDisplayedText] = useState("");
  const [showContent, setShowContent] = useState(false);
  const [showWorkOptions, setShowWorkOptions] = useState(false);
  const [applyPopIn, setApplyPopIn] = useState(hasTypingAnimationPlayed); // Ensures pop-in on navigation

  const gradientText = "Hey there! I'm Tori, ";
  const remainingText = "Developer and Artist based in Ottawa.";
  const fullString = `${gradientText}${remainingText}`;

  // Typing animation effect (Only on refresh)
  useEffect(() => {
    if (hasTypingAnimationPlayed) {
      setDisplayedText(fullString);
      setShowContent(true);
      return;
    }

    let index = 0;
    const typingInterval = setInterval(() => {
      setDisplayedText(fullString.substring(0, index + 1));
      index++;

      if (index > fullString.length) {
        clearInterval(typingInterval);
        setTimeout(() => {
          setShowContent(true);
          setHasTypingAnimationPlayed();
        }, 50);
      }
    }, 45);

    return () => clearInterval(typingInterval);
  }, [fullString, hasTypingAnimationPlayed, setHasTypingAnimationPlayed]);

  return (
    <div className="hero-container">
      <div className={`hero ${showWorkOptions ? "blurred" : ""}`}>
        <div className="image-container pop-in">
          <div className="image-glow"></div>
          <img src={profile_img} alt="Profile" />
        </div>

        {/* Typing Effect */}
        <h1 className={`pop-in ${displayedText.length < fullString.length ? "typing" : ""}`}>
          <span className="gradient">{displayedText.substring(0, gradientText.length)}</span>
          <span>{displayedText.substring(gradientText.length)}</span>
        </h1>



        {/* Content appears after typing animation */}
        {showContent && (
          <>
            <p className="pop-in">
              I do many things. Developing software, designing websites, and producing music are the main ones.
            </p>
            <div className="hero-buttons">
              <button className="hero-viewbtn pop-in" onClick={() => setShowWorkOptions(true)}>
                View my work
              </button>
              <Link to="/contact" className="hero-connectbtn pop-in">
                Contact me
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Work Options Overlay */}
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
