import React, { useState, useEffect } from 'react';
import "./MusicMain.css";
import { fetchShepArtistStat } from './getShepArtistStat.js';
import { useLocation } from 'react-router-dom';
import { isToday, formatDistanceToNow } from 'date-fns';

import MusicProductionStack from './MusicProductionStack';

//Fun Fact Terminal
import FunFactTerminal from './FunFactTerminal';

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


//Social link map
const socialLinks = [
    { name: "Spotify", url: "https://open.spotify.com/artist/48ds3BHWCPZVfAzFB2At2L", img: spotifyImg },
    { name: "Youtube", url: "https://music.youtube.com/channel/UCtPf_UBTj152Hxi4g1FxC5g", img: youtubeImg },
    { name: "Tidal", url: "https://listen.tidal.com/artist/47932768", img: tidalImg, invert: true },
    { name: "Apple Music", url: "https://music.apple.com/us/artist/shep/1747760245", img: amImg },
    { name: "Soundcloud", url: "https://soundcloud.com/shepy2", img: soundcloudImg },
];

const Music = () => {
    const [followers, setFollowers] = useState("N/A");
    const [monthlyListeners, setMonthlyListeners] = useState("N/A");
    const [popularityIndex, setPopularityIndex] = useState("N/A");

    const [followersUpdate, setFollowersUpdate] = useState("Long ago");
    const [monthlyUpdate, setMonthlyUpdate] = useState("Long ago");
    const [popularityUpdate, setPopularityUpdate] = useState("Long ago");

    const location = useLocation();

    const getRelativeDateString = (dateString) => {
      const date = new Date(dateString);
    
      if (isToday(date)) {
        return "Today";
      }
    
      return formatDistanceToNow(date, { addSuffix: true });
    };
    

    useEffect(() => {
        if (location.pathname === '/musiclinks') {
            const shepSection = document.querySelector('.shep-section');
            if (shepSection) {
                shepSection.scrollIntoView({ behavior: 'smooth' });
            }
        }

        async function fetchStats() {
            try {
                const data = await fetchShepArtistStat();

                setFollowers(data.followers);
                setMonthlyListeners(data.monthly_listeners);
                setPopularityIndex(data.popularity);


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

    useEffect(() => {
        // Helper to stagger animate child elements
        const staggerAnimate = (parent, selector, delay = 100) => {
          const items = Array.from(parent.querySelectorAll(selector));
          items.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add("visible");
            }, index * delay);
          });
        };
      
        // This function sets up the IntersectionObserver on all animated elements
        const initFadeInObserver = () => {
          const animatedElements = document.querySelectorAll(
            '.shep-pfp-left, .shep-description-right, .bio-para, ' +
            '.social-links-grid, .social-container-title, .music-stack, .music-terminal, ' +
            '.counter-wrapper, .player-wrapper, .live-card, ' +
            '.collaborator-wrapper, .collab-grid'
          );
      
          const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const el = entry.target;
                if (el.classList.contains("social-links-grid")) {
                  staggerAnimate(el, ".social-link", 100);
                } else if (el.classList.contains("counter-wrapper")) {
                  staggerAnimate(el, ".live-card", 100);
                } else if (el.classList.contains("collab-grid")) {
                  staggerAnimate(el, ".collab-item", 200);
                } else {
                  setTimeout(() => {
                    el.classList.add("visible");
                  }, 300);
                }
                obs.unobserve(el);
              }
            });
          }, { threshold: 0.3 });
      
          animatedElements.forEach((el) => {
            observer.observe(el);
          });
        };

        const onLoad = () => {
          initFadeInObserver();
      
          // Set up a MutationObserver on the collaborator wrapper in case the .collab-grid is added later.
          const collabWrapper = document.querySelector('.collaborator-wrapper');
          if (collabWrapper) {
            const mutationObserver = new MutationObserver((mutationsList, observer) => {
              const collabGrids = collabWrapper.querySelectorAll('.collab-grid');
              if (collabGrids.length > 0) {
                initFadeInObserver();
                observer.disconnect();
              }
            });
            mutationObserver.observe(collabWrapper, { childList: true, subtree: true });
          }
        };
      
        if (document.readyState === "complete") {
          onLoad();
        } else {
          window.addEventListener("load", onLoad);
          return () => window.removeEventListener("load", onLoad);
        }
      }, []);


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
                            <h2 className='bio-title'>Shep</h2>
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
                    <h2 className='social-container-title'>Follow my Journey on</h2>
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

            <section className="release-section">
                <h2>Releases</h2>
                <div className="player-wrapper">
                    <Player />
                </div>
            </section>

            <section className='stats-section'>
                <div className='stats-graphs'>
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


        </div>
    );
};

export default Music;