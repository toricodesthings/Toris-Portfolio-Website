import { useState, useRef, useEffect } from "react";
import "./MusicMain.css";
import avatar from "../../assets/artwork_me.webp";
import { fetchArtistReleases } from './getShepArtistRelease'; // Your API file

// Updated MusicPlayer accepts additional props for artwork and releaseType.
const MusicPlayer = ({ src, title, artist, artwork_link, releaseType }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const [notPlaying, setNotPlaying] = useState(true);

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

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  const percentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  const handleChange = (e) => {
    if (audioRef.current) {
      audioRef.current.currentTime = e.target.value;
    }
  };

  return (
    <div className="player">
      <audio ref={audioRef} src={src} />
      <div className="disc-wrapper">
        <svg
          viewBox="0 0 500 500"
          width="100%"
          height="400"
          xmlns="http://www.w3.org/2000/svg"
          className={`disc ${notPlaying ? 'paused' : 'spinning'}`}
        >
          <defs>
            <radialGradient id="vinylLight" cx="20%" cy="2.0%" r="70%">
              <stop offset="0%" stopColor="#555" stopOpacity="0.4" />
              <stop offset="30%" stopColor="#222" stopOpacity="0.07" />
              <stop offset="100%" stopColor="#000" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="vinylLight2" cx="75%" cy="70%" r="80%">
              <stop offset="0%" stopColor="#555" stopOpacity="0.3" />
              <stop offset="40%" stopColor="#222" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#000" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* Outer Disc */}
          <circle cx="250" cy="250" r="240" fill="url(#vinylLight)" stroke="gray" strokeWidth="4" />
          <circle cx="250" cy="250" r="240" fill="url(#vinylLight2)" />

          {/* Grooves */}
          {[...Array(20)].map((_, i) => (
            <circle
              key={i}
              cx="250"
              cy="250"
              r={235 - i * 6}
              fill="url(#vinylLight)"
              stroke="lightgray"
              strokeWidth="0.9"
              opacity="0.6"
            />
          ))}

          {/* Center Label */}
          <clipPath id="labelClip">
            <circle cx="250" cy="250" r="100" fill="none" />
          </clipPath>
          <image href={artwork_link || avatar} x="150" y="150" width="200" height="200" clipPath="url(#labelClip)" />

          {/* Center Hole */}
          <circle cx="250" cy="250" r="8" fill="white" />
          <circle cx="250" cy="250" r="4" fill="black" />
        </svg>

        <svg viewBox="0 0 500 500" width="100%" height="400" xmlns="http://www.w3.org/2000/svg" className="vinylplayer">
          {/* Transparent background — just remove the <rect /> */}
          


          {/* Tonearm */}
          <line x1="450" y1="50" x2="370" y2="140" stroke="#aaa" strokeWidth="5" />

          {/* Tonearm base */}
          <circle cx="450" cy="50" r="16" fill="#eee" />

          {/* Tonearm base */}
          <circle cx="450" cy="50" r="15" fill="#555" />

          <circle cx="365" cy="147.5" r="15" fill="#999" />

          <polygon points="350, 140 380,140 365,160" fill="#ccc" />


          {/* Controls (bottom-left corner) */}
          <rect x="20" y="460" width="25" height="25" fill="purple" />
          <rect x="60" y="460" width="25" height="25" fill="pink" />
          <rect x="100" y="460" width="25" height="25" fill="orange" />
        </svg>

      </div>
      <div className="playercpanel">
        <div className="playerinfo">
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
                background: `linear-gradient(to right, rgba(197, 95, 244, 1) 0%, rgba(234, 59, 59, 1) ${percentage}%,#888888 ${percentage}%,#888888 100%)`
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
          <h3>/Music</h3>
        </div>
      </div>
    </div>
  );
};

// Container component that fetches all releases and preloads the latest one.
const PlayerContainer = () => {
  const [latestRelease, setLatestRelease] = useState(null);
  const [releases, setReleases] = useState([])

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchArtistReleases();
        setReleases(data);
        // Find the release marked as latest
        const latest = data.find(release => release.latest_release);
        if (latest) {
          setLatestRelease(latest);
        }
      } catch (error) {
        console.error("Error fetching releases:", error);
      }
    }
    fetchData();
  }, []);

  if (!latestRelease) {
    return <div>Loading Data...</div>;
  }

  const artistString =
    "By: Shep" +
    (latestRelease.featured_artists && latestRelease.featured_artists.length > 0
      ? ", " + latestRelease.featured_artists.join(", ")
      : "");

  const releaseType = latestRelease.cover_song ? "(Cover)" : "(Original)";

  return (
    <MusicPlayer
      src={latestRelease.mp3_link}
      title={latestRelease.title}
      artist={artistString}
      artwork_link={latestRelease.artwork_link}
      releaseType={releaseType}
    />
  );
};

export default PlayerContainer;
