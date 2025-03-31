import React, { useState, useEffect } from 'react';
import './MusicMain.css';

import spotifyImg from "../../assets/social/spotify.svg";
import youtubeImg from "../../assets/social/youtube.svg";
import xImg from "../../assets/social/x.svg";
import amImg from "../../assets/social/am.svg";
import instagramImg from "../../assets/social/instagram.svg";
import facebookImg from "../../assets/social/facebook.svg";

import nextButton from '../../assets/cspage/next.svg';
import backButton from '../../assets/cspage/back.svg';

// Mapping social platform keys to their corresponding images.
const socialIcons = {
    spotify: spotifyImg,
    youtube: youtubeImg,
    "apple music": amImg,
    "youtube music": youtubeImg,
    twitter: xImg,
    instagram: instagramImg,
    facebook: facebookImg,
};

const sanitizeUrl = (url) => {
    if (typeof url !== 'string') return '';

    const trimmedUrl = url.trim();

    if (/^(?:javascript|data|vbscript|file):/i.test(trimmedUrl)) {
        return '';
    }
    const allowedDomains = [
        'https://i.scdn.co/',
        'https://pbs.twimg.com/',
    ];
    const isAllowedDomain = allowedDomains.some(domain => trimmedUrl.toLowerCase().startsWith(domain.toLowerCase()));
    const isRelativePath = trimmedUrl.startsWith('/');
    const isHttpsImageUrl = trimmedUrl.toLowerCase().startsWith('https://') &&
        /\.(jpg|jpeg|png|gif|svg|webp)(\?.*)?$/i.test(trimmedUrl);

    if (isAllowedDomain || isRelativePath || isHttpsImageUrl) {
        return trimmedUrl;
    }
    return 'https://placehold.co/600x400';
};


const sanitizeSocialUrl = (url) => {
    if (typeof url !== 'string') return '#';

    const trimmedUrl = url.trim();

    if (/^(?:javascript|data|vbscript|file):/i.test(trimmedUrl)) {
        console.warn('Blocked potentially malicious social link:', trimmedUrl);
        return '#';
    }

    const allowedDomains = [
        'https://open.spotify.com/',
        'https://music.apple.com/',
        'https://www.youtube.com/',
        'https://twitter.com/',
        'https://x.com/',
        'https://www.instagram.com/',
        'https://www.facebook.com/',
    ];

    const isAllowedDomain = allowedDomains.some(domain =>
        trimmedUrl.toLowerCase().startsWith(domain.toLowerCase())
    );

    const isHttpsUrl = trimmedUrl.toLowerCase().startsWith('https://');

    if (isAllowedDomain || isHttpsUrl) {
        return trimmedUrl;
    }

    console.warn('Blocked unsafe social link:', trimmedUrl);
    return '#';
};

const Collaborators = () => {
    const [collaboratorsData, setCollaboratorsData] = useState([]);

    useEffect(() => {
        fetch('/collaborators.json')
            .then((res) => res.json())
            .then((data) => setCollaboratorsData(data))
            .catch((err) => console.error('Failed to load collaborators.json:', err));
    }, []);

    const [selectedIndex, setSelectedIndex] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [slideDirection, setSlideDirection] = useState(null);
    const [columns, setColumns] = useState(window.innerWidth < 768 ? 1 : 3);

    useEffect(() => {
        const handleResize = () => {
            setColumns(window.innerWidth < 768 ? 1 : 3);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const rows = [];
    for (let i = 0; i < collaboratorsData.length; i += columns) {
        rows.push(collaboratorsData.slice(i, i + columns));
    }

    const handleCollabClick = (globalIndex) => {
        if (selectedIndex === globalIndex) {
            setSelectedIndex(null);
        } else {
            setSelectedIndex(globalIndex);
            setCurrentPage(0);
        }
    };

    const handlePrev = (e) => {
        e.stopPropagation();
        if (selectedIndex === null) return;
        if (currentPage > 0) {
            setSlideDirection("prev");
            setCurrentPage((prev) => Math.max(prev - 1, 0));
        }
    };

    const handleNext = (e) => {
        e.stopPropagation();
        if (selectedIndex === null) return;
        const pages = collaboratorsData[selectedIndex].pages || [];
        if (currentPage < pages.length - 1) {
            setSlideDirection("next");
            setCurrentPage((prev) => Math.min(prev + 1, pages.length - 1));
        }
    };

    useEffect(() => {
        if (slideDirection) {
            const timer = setTimeout(() => setSlideDirection(null), 300);
            return () => clearTimeout(timer);
        }
    }, [slideDirection]);

    return (
        <div className="collaborators-container">
            {rows.map((row, rowIndex) => (
                <React.Fragment key={rowIndex}>
                    <div className="collab-grid">
                        {row.map((collab, index) => {
                            const globalIndex = rowIndex * columns + index;
                            return (
                                <div
                                    key={collab.id}
                                    className="collab-item"
                                    onClick={() => handleCollabClick(globalIndex)}
                                >
                                    <img src={collab.img} alt={collab.name} />
                                    <div className="collab-item-name">{collab.name}</div>
                                    <div className="collab-item-role">{collab.role}</div>
                                </div>
                            );
                        })}
                    </div>
                    {selectedIndex !== null &&
                        Math.floor(selectedIndex / columns) === rowIndex && (
                            <div className="collab-expanded-row">
                                <div className="collab-expanded">
                                    {columns > 1 ? (
                                        <>
                                            <div className="collab-nav-arrow left" onClick={handlePrev}>
                                                <img src={backButton} style={{ filter: 'invert(1)' }} />
                                            </div>
                                            <div className={`slide-container ${slideDirection ? "slide-" + slideDirection : ""}`}>
                                                {(() => {
                                                    const currentPageData = collaboratorsData[selectedIndex].pages[currentPage];
                                                    // Sanitize the URL before using it
                                                    const rawImageSource = currentPageData.img
                                                        ? currentPageData.img
                                                        : collaboratorsData[selectedIndex].detailImg;
                                                    const currentImageSource = sanitizeUrl(rawImageSource);
                                                    return (
                                                        <>
                                                            <img
                                                                src={currentImageSource}
                                                                alt={collaboratorsData[selectedIndex].name}
                                                            />
                                                            <div className="collab-expanded-text">
                                                                <div className="collab-header">
                                                                    <h3>
                                                                        {currentPageData.title || collaboratorsData[selectedIndex].name}
                                                                    </h3>
                                                                </div>
                                                                {currentPageData.socialLinks && (
                                                                    <div className="collab-social-links">
                                                                        {Object.keys(currentPageData.socialLinks).map(platform => (
                                                                            <a
                                                                                key={platform}
                                                                                href={sanitizeSocialUrl(currentPageData.socialLinks[platform])}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                            >
                                                                                <img
                                                                                    src={socialIcons[platform.toLowerCase()] || '#'}
                                                                                    alt={platform}
                                                                                />
                                                                            </a>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                                <p>
                                                                    {currentPageData.content || collaboratorsData[selectedIndex].description}
                                                                </p>
                                                            </div>
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                            <div className="collab-nav-arrow right" onClick={handleNext}>
                                                <img src={nextButton} style={{ filter: 'invert(1)' }} />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className={`slide-container ${slideDirection ? "slide-" + slideDirection : ""}`}>
                                                {(() => {
                                                    const currentPageData = collaboratorsData[selectedIndex].pages[currentPage];
                                                    const rawImageSource = currentPageData.img
                                                        ? currentPageData.img
                                                        : collaboratorsData[selectedIndex].detailImg;
                                                    const currentImageSource = sanitizeUrl(rawImageSource);
                                                    return (
                                                        <>
                                                            <img
                                                                src={currentImageSource}
                                                                alt={collaboratorsData[selectedIndex].name}
                                                            />
                                                            <div className="collab-expanded-text">
                                                                <div className="collab-header">
                                                                    <h3>
                                                                        {currentPageData.title || collaboratorsData[selectedIndex].name}
                                                                    </h3>
                                                                </div>
                                                                {currentPageData.socialLinks && (
                                                                    <div className="collab-social-links">
                                                                        {Object.keys(currentPageData.socialLinks).map(platform => (
                                                                        <a
                                                                            key={platform}
                                                                            href={sanitizeSocialUrl(currentPageData.socialLinks[platform])}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                        >
                                                                            <img
                                                                            src={socialIcons[platform.toLowerCase()] || '/images/default-social-icon.png'}
                                                                            alt={platform}
                                                                            />
                                                                        </a>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                                <p>
                                                                    {currentPageData.content || collaboratorsData[selectedIndex].description}
                                                                </p>
                                                            </div>
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                            <div className="collab-nav-arrows-mobile">
                                                <div className="collab-nav-arrow" onClick={handlePrev}>
                                                    <img src={backButton} style={{ filter: 'invert(1)' }} />
                                                </div>
                                                <div className="collab-nav-arrow" onClick={handleNext}>
                                                    <img src={nextButton} style={{ filter: 'invert(1)' }} />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default React.memo(Collaborators);
