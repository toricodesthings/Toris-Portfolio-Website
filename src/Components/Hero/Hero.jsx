import React, { useState, useEffect } from "react";
import "./Hero.css";
import { Link } from "react-router-dom";
import profile_img from "../../assets/temp_profileimg.webp";
import music_img from "../../assets/mainpage/music.webp";
import cs_img from "../../assets/mainpage/cs.webp";
import { useAnimationStore } from "../../store/animationStore";

const Hero = () => {
  const { hasTypingAnimationPlayed, setHasTypingAnimationPlayed } = useAnimationStore();
  const [displayedText, setDisplayedText] = useState("");
  const [showContent, setShowContent] = useState(false);
  const [showWorkOptions, setShowWorkOptions] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);

  const gradientText = "Hi there! I'm Tori," ;
  const remainingText = " Developer and Artist based in Ottawa.";
  const fullString = `${gradientText}${remainingText}`;

  // Listen for full page load
  useEffect(() => {
    const handleLoad = () => setPageLoaded(true);
    if (document.readyState === "complete") {
      setPageLoaded(true);
    } else {
      window.addEventListener("load", handleLoad);
    }
    return () => window.removeEventListener("load", handleLoad);
  }, []);

  // Delay the start of the typing animation until after the navbar animates
  useEffect(() => {
    if (!pageLoaded) return;
    if (hasTypingAnimationPlayed) {
      setDisplayedText(fullString);
      setShowContent(true);
      return;
    }

    // Delay hero animation start to allow navbar to finish (adjust delay as needed)
    const animationStartDelay = 300; // Delay in milliseconds
    const timeoutId = setTimeout(() => {
      let startTime = null;
      const durationPerChar = 30; // milliseconds per character

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
        <div className="image-container pop-in">
          <div className="image-glow"></div>
          <img src={profile_img} alt="Profile" />
        </div>
        <h1 className={`pop-in ${displayedText.length < fullString.length ? "typing" : ""}`}>
          <span className="gradient">{displayedText.substring(0, gradientText.length)}</span>
          <span>{displayedText.substring(gradientText.length)}</span>
        </h1>
        {showContent && (
          <>
            <p className="pop-in">
              I do many things from developing software, designing websites, to producing music.
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
