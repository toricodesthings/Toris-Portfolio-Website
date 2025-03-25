import React, { useState, useEffect } from 'react';
import "./MusicMain.css";

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

export default React.memo(FunFactTerminal);