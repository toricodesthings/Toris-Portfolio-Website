import { useState, useRef, useEffect } from "react";
import "./MusicMain.css";
import avatar from "../../assets/artwork_me.webp";

const MusicPlayer = ({ src, title, artist }) => {
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0); // Store song length
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

    return (
        <div className="player">
            <audio ref={audioRef} src={src} />
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
                        strokeWidth="0.8"
                        opacity="0.5"
                    />
                ))}

                {/* Center Label */}
                <clipPath id="labelClip">
                    <circle cx="250" cy="250" r="100" fill="none" />
                </clipPath>
                <image href={avatar} x="150" y="150" width="200" height="200" clipPath="url(#labelClip)" />

                {/* Center Hole */}
                <circle cx="250" cy="250" r="8" fill="white" />
                <circle cx="250" cy="250" r="4" fill="black" />
            </svg>

            <div className="playerinfo">
                <h3>{title}</h3>
                <h4>{artist}</h4>
                <div className="progress-container">
                    <span>{formatTime(currentTime)}</span>
                    <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={(e) => (audioRef.current.currentTime = e.target.value)}
                        className="progress-bar"
                    />
                    <span>{formatTime(duration)}</span>
                </div>
                <div className="player-buttons">
                    <button>⏮</button>
                    <button onClick={playAudio} className="play-button">{notPlaying ? '⏵' : '⏸'}</button>
                    <button>⏭</button>
                </div>
            </div>
        </div>
    );
};

export default MusicPlayer;
