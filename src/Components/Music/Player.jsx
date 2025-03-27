import React, { useState, useRef, useEffect } from "react";
import "./MusicMain.css";
import avatar from "../../assets/artwork_me.webp";
import { fetchArtistReleases } from './getShepArtistRelease';
import HamsterLoadingUI from "../LoadingUI/HamsterLoader";

const MusicPlayer = ({
  src,
  title,
  artist,
  artwork_link,
  releaseType,
  releases,
  onSortChange,
  onTrackSelect,
  selectedTrack
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const [notPlaying, setNotPlaying] = useState(true);

  const [displayedArtwork, setDisplayedArtwork] = useState(artwork_link);
  const [discAnimationClass, setDiscAnimationClass] = useState("");
  const animationDuration = 600;

  const playAudio = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setNotPlaying(false);
    } else {
      audioRef.current.pause();
      setNotPlaying(true);
    }
  };

  useEffect(() => {
    const updateProgress = () => {
      setCurrentTime(audioRef.current.currentTime);
    };

    const setAudioDuration = () => {
      setDuration(audioRef.current.duration);
    };

    const audio = audioRef.current;
    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", setAudioDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", setAudioDuration);
    };
  }, []);

  // Trigger disc animation when selectedTrack changes
  useEffect(() => {
    if (selectedTrack && selectedTrack.artwork_link !== displayedArtwork) {
      setDiscAnimationClass("slide-out");
      setTimeout(() => {
        setDisplayedArtwork(selectedTrack.artwork_link || avatar);
        setDiscAnimationClass("slide-in");

        if (audioRef.current) {
          audioRef.current.play();
          setNotPlaying(false);
        }

        setTimeout(() => {
          setDiscAnimationClass("");
        }, animationDuration);
      }, animationDuration);
    }
  }, [selectedTrack, displayedArtwork]);

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  const percentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="player">
      <audio ref={audioRef} src={src} />
      <div className="disc-wrapper">
        <div className={`disc-container ${discAnimationClass}`}>
          <svg
            key={displayedArtwork}
            viewBox="0 0 500 500"
            width="400"
            height="400"
            xmlns="http://www.w3.org/2000/svg"
            className={`disc ${notPlaying ? 'paused' : 'spinning'} ${discAnimationClass}`}
          >
            <defs>
              <radialGradient id="vinylLight" cx="50%" cy="0%" r="70%">
                <stop offset="0%" stopColor="#333" stopOpacity="0.3" />
                <stop offset="25%" stopColor="#555" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#000" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="vinylLight2" cx="50%" cy="70%" r="90%">
                <stop offset="0%" stopColor="#333" stopOpacity="0.4" />
                <stop offset="25%" stopColor="#222" stopOpacity="0.0" />
                <stop offset="100%" stopColor="#000" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="250" cy="250" r="240" fill="url(#vinylLight)" stroke="#111" strokeWidth="5" />
            <circle cx="250" cy="250" r="245" fill="url(#vinylLight2)" stroke="#ccc" strokeWidth="1"/>
            {[...Array(20)].map((_, i) => (
              <circle
                key={i}
                cx="250"
                cy="250"
                r={235 - i * 6}
                fill="url(#vinylLight)"
                stroke="gray"
                strokeWidth="0.9"
                opacity="0.6"
              />
            ))}

            {/* Center Label */}
            <clipPath id="labelClip">
              <circle cx="250" cy="250" r="100" fill="none" />
            </clipPath>
            <image href={displayedArtwork} x="135" y="135" width="225" height="225" clipPath="url(#labelClip)" />

            {/* Center Hole */}
            <circle cx="250" cy="250" r="8" fill="lightgray" />
            <circle cx="250" cy="250" r="4" fill="black" />
          </svg>
        </div>
        <svg viewBox="0 0 500 500" width="100%" height="400" xmlns="http://www.w3.org/2000/svg" className="vinylplayer">
          <line x1="450" y1="50" x2="370" y2="140" stroke="#aaa" strokeWidth="5" />
          <polygon points="352.5, 140 377.5,140 365,170" fill="#ddd" />
          <circle cx="450" cy="50" r="16" fill="#eee" />
          <circle cx="450" cy="50" r="15" fill="#555" />
          <circle cx="365" cy="147.5" r="15" fill="#999" />

          <rect x="20" y="460" width="25" height="25" fill="#c972f1" />
          <rect x="60" y="460" width="25" height="25" fill="#b32191" />
          <rect x="100" y="460" width="25" height="25" fill="#ea3b3b" />
        </svg>
      </div>
      <div className="playercpanel">
        <div className="playerinfo">
          <p className="np-text">Now Playing ▶ </p>
          <h3>{title}</h3>
          <h4 className="release-type">{releaseType}</h4>
          <h4 className="release-artists">{artist}</h4>
          <div className="progress-container">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={(e) => (audioRef.current.currentTime = e.target.value)}
              className="progress-bar"
              style={{
                background: `linear-gradient(to right, rgba(197, 95, 244, 1) 0%, rgba(234, 59, 59, 1) ${percentage}%,#888888 ${percentage}%,#888888 100%)`,
              }}
            />
            <span>{formatTime(duration)}</span>
          </div>
          <div className="player-buttons">
            <button>⏮</button>
            <button onClick={playAudio} className="play-button">
              {notPlaying ? '⏵' : '⏸'}
            </button>
            <button>⏭</button>
          </div>
        </div>
        <div className="playerbrowser">
          <div className="release-explorer">
            <h3>Releases</h3>
            {releases && releases.map((release, index) => (
              <div
                key={release.id || index}
                className="release-row"
                onClick={() => onTrackSelect(release)}
                style={
                  selectedTrack && selectedTrack.title === release.title
                    ? {
                        background:
                          "linear-gradient(270deg, rgba(197, 95, 244, 1) 0%, rgba(234, 59, 59, 1) 100%)",
                        borderLeft: "2px solid #fff",
                        borderRight: "2px solid #fff",
                      }
                    : {}
                }
              >
                <span className="release-title">{"♪ " + release.title}</span>
                <span className="release-length">
                  {release.length && release.length.formatted ? release.length.formatted : ""}
                </span>
              </div>
            ))}
          </div>
          <div className="release-filter">
            <h3>Sort</h3>
            <div className="sort-container">
              <button onClick={() => onSortChange("title-asc")}>A-Z▲</button>
              <button onClick={() => onSortChange("title-desc")}>Z-A▼</button>
              <button onClick={() => onSortChange("length-asc")}>⏱▲</button>
              <button onClick={() => onSortChange("length-desc")}>⏱▼</button>
              <button onClick={() => onSortChange("date-asc")}>📅▲</button>
              <button onClick={() => onSortChange("date-desc")}>📅▼</button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PlayerContainer = () => {
  const [releases, setReleases] = useState([]);
  const [sortOption, setSortOption] = useState("title-asc");
  const [selectedTrack, setSelectedTrack] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchArtistReleases();
        setReleases(data);
        const latest = data.find(release => release.latest_release);
        if (latest) {
          setSelectedTrack(latest);
        }
      } catch (error) {
        console.error("Error fetching releases:", error);
      }
    }
    fetchData();
  }, []);

  if (!selectedTrack) {
    return (
      <div className="player-loader">
        <HamsterLoadingUI />
      </div>
    );
  }

  const getTotalSeconds = (lengthObj) => {
    if (typeof lengthObj === 'object' && 'minutes' in lengthObj && 'seconds' in lengthObj) {
      return lengthObj.minutes * 60 + lengthObj.seconds;
    }
    return 0;
  };

  const sortedReleases = [...releases].sort((a, b) => {
    switch (sortOption) {
      case "title-asc":
        return a.title.localeCompare(b.title);
      case "title-desc":
        return b.title.localeCompare(a.title);
      case "length-asc":
        return getTotalSeconds(a.length) - getTotalSeconds(b.length);
      case "length-desc":
        return getTotalSeconds(b.length) - getTotalSeconds(a.length);
      case "date-asc":
        return new Date(a.release_date) - new Date(b.release_date);
      case "date-desc":
        return new Date(b.release_date) - new Date(a.release_date);
      default:
        return 0;
    }
  });

  const artistString =
    "By: Shep" +
    (selectedTrack.featured_artists && selectedTrack.featured_artists.length > 0
      ? ", " + selectedTrack.featured_artists.join(", ")
      : "");

  const releaseType = selectedTrack.cover_song ? "(Cover)" : "(Original)";

  return (
    <MusicPlayer
      src={selectedTrack.mp3_link}
      title={selectedTrack.title}
      artist={artistString}
      artwork_link={selectedTrack.artwork_link}
      releaseType={releaseType}
      releases={sortedReleases}
      onSortChange={setSortOption}
      onTrackSelect={setSelectedTrack}
      selectedTrack={selectedTrack}
    />
  );
};

export default PlayerContainer;
