import React, { useState, useEffect } from 'react';
import "./MusicMain.css";
import { useLocation } from 'react-router-dom';
import AudienceTimelineChart from './AudienceTimelineChart';
import Collaborators from './Collaborators'
import avatar from "../../assets/artwork_me.png";
import spotifyImg from "../../assets/social/spotify.svg";
import youtubeImg from "../../assets/social/youtube.svg";
import tidalImg from "../../assets/social/tidal.svg";
import amImg from "../../assets/social/am.svg";
import iTunesImg from "../../assets/social/itunes.svg";
import soundcloudImg from "../../assets/social/soundcloud.svg";

import abletonImg from "../../assets/tools/ableton.png";
import reaperImg from "../../assets/tools/reaper.png";
import iZotopeOImg from "../../assets/tools/iZotopeOzone.png";
import iZotopeRXImg from "../../assets/tools/iZotopeRX.png";
import NIImg from "../../assets/tools/NI.png";
import uadImg from "../../assets/tools/UAD.png";
import wavesImg from "../../assets/tools/waves.png";
import neuralImg from "../../assets/tools/Neural.png";
import vitalImg from "../../assets/tools/Vital.png";

const socialLinks = [
    { name: "Spotify", url: "https://youtube.com/c/yourchannelhere", img: spotifyImg },
    { name: "Youtube", url: "https://open.spotify.com/artist/yoururlhere", img: youtubeImg },
    { name: "Tidal", url: "https://soundcloud.com/yoururlhere", img: tidalImg, invert: true },
    { name: "Apple Music", url: "https://instagram.com/yourusernamehere", img: amImg },
    { name: "iTunes", url: "https://instagram.com/yourusernamehere", img: iTunesImg },
    { name: "Soundcloud", url: "https://instagram.com/yourusernamehere", img: soundcloudImg },
];

// Added descriptive names for each music tool and invert property for Waves and Neural DSP
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

const funFacts = {
    "Favorite Key": "D# Minor",
    "First Release": "Eclipse (2021)",
    "Favorite DAW": "Ableton Live",
    "Go-to Synth": "Vital & Serum",
    "Favorite Genres": "Metalcore & EDM",
    "Clear": "Click any option to reveal a fact"
};

const isMonthlyUpdatedToday = true;
const isFollowersUpdatedToday = true;
const isPopIUpdatedToday = true;

const MusicProductionStack = React.memo(() => {
    return (
      <div className="music-stack-container">
        <div className='music-production-stack'>
          <div className="scrolling-icons">
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
  });

const FunFactTerminal = () => {
    const [displayedText, setDisplayedText] = useState("Click an option to reveal a fact");
    const [isTyping, setIsTyping] = useState(false);
    const [showCursor, setShowCursor] = useState(true);
    const typingSpeed = 35;
    const eraseSpeed = 15;

    useEffect(() => {
        if (!isTyping) {
            const cursorInterval = setInterval(() => {
                setShowCursor(prev => !prev);
            }, 500);
            return () => clearInterval(cursorInterval);
        }
    }, [isTyping]);

    const eraseText = (callback) => {
        if (isTyping) return;
        setIsTyping(true);
        setShowCursor(false);

        let i = displayedText.length;
        const erasingInterval = setInterval(() => {
            setDisplayedText((prev) => prev.slice(0, -1)); 
            i--;
            if (i <= 0) {
                clearInterval(erasingInterval);
                callback(); 
            }
        }, eraseSpeed);
    };

    const typeText = (text) => {
        let i = -1; 
        setDisplayedText(""); 

        const typingInterval = setInterval(() => {
            if (i < text.length - 1) {
                i++;
                setDisplayedText((prev) => prev + text[i]);
            } else {
                clearInterval(typingInterval);
                setIsTyping(false); 
                setShowCursor(true); 
            }
        }, typingSpeed);
    };

    const handleClick = (factKey) => {
        if (isTyping) return;

        const newText = funFacts[factKey] || "Click an option to reveal a fact";

        eraseText(() => typeText(newText)); 
    };

    return (
        <div className="fun-fact-terminal">
            <div className="terminal-display">
                {displayedText}
            </div>
            <div className="terminal-options">
                {Object.keys(funFacts).map((fact) => (
                    <button key={fact} onClick={() => handleClick(fact)}>
                        {fact}
                    </button>
                ))}
            </div>
        </div>
    );
};

const MusicPage = () => {
    const location = useLocation();

    useEffect(() => {
      if (location.pathname === '/musiclinks') {
        const shepSection = document.querySelector('.shep-section');
        if (shepSection) {
          shepSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, [location]);


    return (
        <div className="music">
            <div className="music-title">
                <h1>Music Career & Projects</h1>
            </div>

            <section className="shep-section">
                <div className="bio-panel">
                    <div className="shep-pfp-left">
                        <img src={avatar} alt="Profile" className="shepprofileimg" />
                    </div>
                    <div className="shep-description-right">
                        <div className="bio-para">
                            <h2>Shep</h2>
                            <p>
                                I launched this project in 2021 making EDM songs. My first piece was Eclipse, an electrohouse track inspired by the channel NCS. Since then I've been producing any genre that comes to mind from Lofi to EDM to Metal to Pop.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="social-links-panel">
                    <h2>Follow me on</h2>
                    <div className="social-links-grid">
                        {socialLinks.map((link) => (
                            <a key={link.name} href={link.url} className="social-link" target="_blank" rel="noopener noreferrer">
                                <img src={link.img} alt={link.name} className={`social-icon ${link.invert ? 'invert' : ''}`} />
                                <span className="social-text">{link.name}</span>
                                <span className="arrow-indicator">▲</span>
                            </a>
                        ))}
                    </div>
                </div>

                <div className="music-extra-panel">
                    <div className="music-stack">
                        <h3>Production Stack</h3>
                        <MusicProductionStack />
                    </div>
                    <div className="music-terminal">
                        <h3>Fun Facts</h3>
                        <FunFactTerminal />
                    </div>
                </div>
            </section>

            <section className='stats-section'>
                <div className='stats-graphs'> {/* Single container with border */}
                    <h2>The Statistics</h2>
                    <div className='chart-wrapper'>
                        <AudienceTimelineChart />
                    </div>
                    <div className='counter-wrapper'>
                        <div className="live-card">
                            <div className="stat-title">Followers</div>
                            <div className="stat-value">4,738</div>
                            <div className="stat-updated">
                                <span className="update-dot green-dot"></span>
                                Last Updated: Today
                            </div>
                        </div>
                        <div className="live-card">
                            <div className="stat-title">Monthly Listeners</div>
                            <div className="stat-value">18,673</div>
                            <div className="stat-updated">
                                <span className="update-dot green-dot"></span>
                                Last Updated: Today
                            </div>
                        </div>
                        <div className="live-card">
                            <div className="stat-title">Popularity Index</div>
                            <div className="stat-value">26</div>
                            <div className="stat-updated">
                                <span className="update-dot green-dot"></span>
                                Last Updated: Today
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='collab-section'>
                <h2>My Collaborators</h2>
                <div className='collaborator-wrapper'>
                    <Collaborators />
                </div>
            </section>
        </div>
    );
};

export default MusicPage;