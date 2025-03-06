import React, { useState, useEffect } from "react";
import './Hero.css'
import { Link } from 'react-router-dom';
import profile_img from '../../assets/temp_profileimg.png'

const Hero = () => {
  const [displayedText, setDisplayedText] = useState("");
  const [showContent, setShowContent] = useState(false);
  const [showWorkOptions, setShowWorkOptions] = useState(false);
  const [skipAnimation, setSkipAnimation] = useState(false);

  // Split text for gradient and normal styles
  const gradientText = "Hey there! I'm Tori, ";
  const remainingText = "Developer and Artist based in Ottawa.";
  const fullString = `${gradientText}${remainingText}`;

  // Check if animation has been shown in this "session"
  useEffect(() => {
    // Use sessionStorage instead of localStorage
    // sessionStorage persists across page navigation but clears on refresh
    const hasAnimationPlayed = sessionStorage.getItem('heroAnimationPlayed');
    
    if (hasAnimationPlayed === 'true') {
      // Skip animation if it has played before in this session
      setSkipAnimation(true);
      setDisplayedText(fullString);
      setShowContent(true);
    }
  }, []);

  // Main Typing Effect 
  useEffect(() => {
    // Skip the animation if needed
    if (skipAnimation) return;
    
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < fullString.length) {
        setDisplayedText(fullString.substring(0, index + 1));
        index++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          setShowContent(true);
          // Store that animation has played in this session
          sessionStorage.setItem('heroAnimationPlayed', 'true');
        }, 50);
      }
    }, 45);

    return () => clearInterval(typingInterval);
  }, [skipAnimation, fullString]);
  
  const handleViewWork = () => {
    setShowWorkOptions(true);
  };

  const handleCloseWorkOptions = () => {
    setShowWorkOptions(false);
  };
  
  return (
    <div className="hero-container">
      <div className={`hero ${showWorkOptions ? 'blurred' : ''}`}>
        <div className="image-container">
          <div className="image-glow"></div>
          <img src={profile_img} alt="Profile" className={skipAnimation ? '' : 'pop-in'} />
        </div>

        <h1>
          <span className="gradient">
            {displayedText.substring(0, gradientText.length)}
          </span>
          <span>
            {displayedText.length > gradientText.length &&
              displayedText.substring(gradientText.length)}
          </span>
          {!showContent && !skipAnimation && <span className="cursor">|</span>}
        </h1>
        
        {showContent && (
          <>
            <p className={skipAnimation ? '' : 'pop-in'}>
              I do many things. Developing software, designing websites, and
              producing music are the main ones.
            </p>
            <div className="hero-buttons">
              <div className={`hero-viewbtn ${skipAnimation ? '' : 'pop-in'}`} onClick={handleViewWork}>View my work</div>
              <div className={`hero-connectbtn ${skipAnimation ? '' : 'pop-in'}`}>Contact me</div>
            </div>
          </>
        )}
      </div>

      {showWorkOptions && (
        <div className="work-options-overlay" onClick={handleCloseWorkOptions}>
          <div className="work-options-container" onClick={e => e.stopPropagation()}>
            <Link to="/projects" className="work-option-box pop-in">
              <div className="option-image-container">
                <img src="/api/placeholder/400/300" alt="Coding Projects" />
              </div>
              <div className="option-glow"></div>
              <h2>Computer Science</h2>
            </Link>
            
            <Link to="/music" className="work-option-box pop-in">
              <div className="option-image-container">
                <img src="/api/placeholder/400/300" alt="Music" />
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