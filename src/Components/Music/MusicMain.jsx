import React, { useState, useEffect } from 'react';
import "./MusicMain.css";
import { fetchShepArtistStat } from './getShepArtistStat.js';
import { useLocation } from 'react-router-dom';

//Chart Module
import AudienceTimelineChart from './AudienceTimelineChart';

//Collaborators Data
import Collaborators from './Collaborators'

//Release Player
import Player from './Player'

import avatar from "../../assets/artwork_me.webp";
import spotifyImg from "../../assets/social/spotify.svg";
import youtubeImg from "../../assets/social/youtube.svg";
import tidalImg from "../../assets/social/tidal.svg";
import amImg from "../../assets/social/am.svg";
import soundcloudImg from "../../assets/social/soundcloud.svg";

//MProd Stack Logos
import abletonImg from "../../assets/tools/ableton.webp";
import reaperImg from "../../assets/tools/reaper.webp";
import iZotopeOImg from "../../assets/tools/iZotopeOzone.webp";
import iZotopeRXImg from "../../assets/tools/iZotopeRX.webp";
import NIImg from "../../assets/tools/NI.webp";
import uadImg from "../../assets/tools/UAD.webp";
import wavesImg from "../../assets/tools/waves.webp";
import neuralImg from "../../assets/tools/Neural.webp";
import vitalImg from "../../assets/tools/Vital.webp";

//Social link map
const socialLinks = [
    { name: "Spotify", url: "https://open.spotify.com/artist/48ds3BHWCPZVfAzFB2At2L", img: spotifyImg },
    { name: "Youtube", url: "https://music.youtube.com/channel/UCtPf_UBTj152Hxi4g1FxC5g", img: youtubeImg },
    { name: "Tidal", url: "https://listen.tidal.com/artist/47932768", img: tidalImg, invert: true },
    { name: "Apple Music", url: "https://music.apple.com/us/artist/shep/1747760245", img: amImg },
    { name: "Soundcloud", url: "https://soundcloud.com/shepy2", img: soundcloudImg },
];

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

//Fun fact list
const funFacts = {
    "Favorite Key": "D# Minor",
    "Favorite Tempo": "140 BPM",
    "First Release": "Eclipse (2021)",
    "Favorite Release": "Calydon (2024)",
    "Favorite DAW": "Ableton Live Suite",
    "Favorite Synths": "Vital & Serum",
    "Favorite Genres": "Metalcore & Trap",
    "Clear": "Click any option to reveal a fact"
};

const song = {
    src: "https://your-audio-file-url.mp3",
    title: "Song Name",
    artist: "Artist Name"
};

const MusicProductionStack = () => {
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
};

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

const Music = () => {
    const [followers, setFollowers] = useState("N/A");
    const [monthlyListeners, setMonthlyListeners] = useState("N/A");
    const [popularityIndex, setPopularityIndex] = useState("N/A");

    const [followersUpdate, setFollowersUpdate] = useState("Long ago");
    const [monthlyUpdate, setMonthlyUpdate] = useState("Long ago");
    const [popularityUpdate, setPopularityUpdate] = useState("Long ago");

    const location = useLocation();

    const getRelativeDateString = (dateString) => {
        const fetchedDate = new Date(dateString);
        const today = new Date();
        // Reset times so we compare only dates.
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const startOfFetched = new Date(fetchedDate.getFullYear(), fetchedDate.getMonth(), fetchedDate.getDate());
        const diffTime = startOfToday - startOfFetched;
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        return `${diffDays} days ago`;
    };

    useEffect(() => {
        // If the URL is /musiclinks, scroll the .shep-section into view
        if (location.pathname === '/musiclinks') {
            const shepSection = document.querySelector('.shep-section');
            if (shepSection) {
                shepSection.scrollIntoView({ behavior: 'smooth' });
            }
        }

        async function fetchStats() {
            try {
                const data = await fetchShepArtistStat();

                // Update stats values
                setFollowers(data.followers);
                setMonthlyListeners(data.monthly_listeners);
                setPopularityIndex(data.popularity);

                // Compute relative date string from fetched_at and update state for all stats
                if (data.fetched_at) {
                    const relativeDate = getRelativeDateString(data.fetched_at);
                    setFollowersUpdate(relativeDate);
                    setMonthlyUpdate(relativeDate);
                    setPopularityUpdate(relativeDate);
                }
            } catch (err) {
                console.error(err.message);
            }
        }

        fetchStats();
    }, [location]);

    return (
        <div className="music">
            <div className="music-title">
                <h1 className="pop-in">Music Projects</h1>
            </div>

            <section className="shep-section">
                <div className="bio-panel">
                    <div className="shep-pfp-left">
                        <img src={avatar} alt="Profile" className="shepprofileimg" />
                    </div>
                    <div className="shep-description-right">
                        <div className="bio-para">
                            <h2>Shep</h2>
                            <div className="genre-row">
                                <div className="genre-mini">EDM</div>
                                <div className="genre-mini">VGM</div>
                                <div className="genre-mini">Pop</div>
                                <div className="genre-mini">Orchestral</div>
                                <div className="genre-mini">Metalcore</div>
                            </div>
                            <p>
                                I launched this project in 2021 making EDM songs. My first piece was Eclipse, an electrohouse track inspired by the channel NCS. Since then I've been producing any genre that comes to mind from Lofi to EDM to Metal to Pop. I've collaborated with many other artists and musicians with a ton of tracks pending release in the near future.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="social-links-panel">
                    <h2>Follow my Journey on</h2>
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
                        <h3>Core Production Stack</h3>
                        <MusicProductionStack />
                    </div>
                    <div className="music-terminal">
                        <h3>Music Fun Facts</h3>
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
                    <div className="counter-wrapper">
                        <div className="live-card">
                            <div className="stat-title">Followers</div>
                            <div className="stat-value">{followers}</div>
                            <div className="stat-updated">
                                <span className={`update-dot ${followersUpdate === "Today" ? 'green-dot' : 'gray-dot'}`}></span>
                                Last Updated: {followersUpdate}
                            </div>
                        </div>
                        <div className="live-card">
                            <div className="stat-title">Monthly Listeners</div>
                            <div className="stat-value">{monthlyListeners}</div>
                            <div className="stat-updated">
                                <span className={`update-dot ${monthlyUpdate === "Today" ? 'green-dot' : 'gray-dot'}`}></span>
                                Last Updated: {monthlyUpdate}
                            </div>
                        </div>
                        <div className="live-card">
                            <div className="stat-title">Popularity Index</div>
                            <div className="stat-value">{popularityIndex}</div>
                            <div className="stat-updated">
                                <span className={`update-dot ${popularityUpdate === "Today" ? 'green-dot' : 'gray-dot'}`}></span>
                                Last Updated: {popularityUpdate}
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

            <section className="release-section">
                <h2>Releases (Under Construction)</h2>
                <div className='release-panel'>
                    <Player />
                </div>
            </section>
        </div>
    );
};

export default Music;