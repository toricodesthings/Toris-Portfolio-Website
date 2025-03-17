import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./CSMain.css";
import { fetchGitHubData } from './getTorisGithubData'; // adjust the import path as needed

// Import language logos
import pythonImg from "../../assets/skills/python.svg";
import htmlImg from "../../assets/skills/html.svg";
import cssImg from "../../assets/skills/css.svg";
import jsImg from "../../assets/skills/javascript.svg";

import terminalImg from "../../assets/cspage/terminallogo.svg";

// Sample response data (normally coming from an API)
const repos = [
    {
        title: "Discord Chatbot Koboldai",
        description: "WIP Discord Chatbot Based on Kobold AI",
        url: "https://github.com/toricodesthings/Discord-Chatbot-Koboldai",
        updatedAt: "2025-03-17T00:20:07Z",
        languages: ["Python"],
        introduction:
            "A WIP Discord Chatbot Based on Kobold's AI. It uses Kobolds API to process users' chat and respond in an intelligent way, either in story form or chat form. It is currently extremely barebones in terms of features as only the base code is laid out. However, it is functional to an extent."
    },
    {
        title: "Discord Yeelight",
        description: "Discord Bot Utilizing Yeelight Python Library (Local Only)",
        url: "https://github.com/toricodesthings/Discord-Yeelight",
        updatedAt: "2025-03-17T00:18:13Z",
        languages: ["Python"],
        introduction:
            "This is an extremely simple WIP bot that utilizes the Yeelight Python Lib. The bot can be added to any server of your choosing but preferably your own private server. However, you'll need to host this bot instance on a server/computer with LAN Access to the Yeelight Devices."
    },
    {
        title: "Discord Bot Statistify",
        description:
            "Spotify Web API wrapped to a Discord Bot with ability to Scrape for Monthly Listener & Track Playcount (Web Application version coming soon)",
        url: "https://github.com/toricodesthings/Discord-Bot-Statistify",
        updatedAt: "2025-03-16T18:32:11Z",
        languages: ["Python"],
        introduction: null
    },
    {
        title: "Toris Portfolio Website",
        description: null,
        url: "https://github.com/toricodesthings/Toris-Portfolio-Website",
        updatedAt: "2025-03-17T00:23:33Z",
        languages: ["JavaScript", "HTML", "CSS"],
        introduction: null
    }
];

// Mapping for language logos and colors.
const languageData = {
    Python: { logo: pythonImg, color: "#61DAFB" },
    JavaScript: { logo: jsImg, color: "#F0DB4F" },
    HTML: { logo: htmlImg, color: "#E34C26" },
    CSS: { logo: cssImg, color: "#264de4" }
};

// Helper to render language logos with custom colors.
const renderLanguageLogos = (languages) => {
    return (
        <div>
            {languages.map((lang, index) => {
                const data = languageData[lang];
                return (
                    <span key={index} style={{
                        color: data ? data.color : "white"
                    }}>
                        {data && (
                            <img
                                src={data.logo}
                                alt={`${lang} logo`}
                            />
                        )}
                        {lang}
                    </span>
                );
            })}
        </div>
    );
};

const CS = () => {
    const [repos, setRepos] = useState([]);
    const [typedText, setTypedText] = useState("");
    const [terminalOpen, setTerminalOpen] = useState(false);
    const [selectedRepo, setSelectedRepo] = useState(null);
    const [transformOrigin, setTransformOrigin] = useState({ x: "50%", y: "50%" });

    // Open terminal overlay, calculate transform origin, and scroll section into view.
    const openTerminal = (repo, event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const originX = rect.left + rect.width / 2;
        const originY = rect.top + rect.height / 2;
        setTransformOrigin({ x: `${originX}px`, y: `${originY}px` });
        setSelectedRepo(repo);
        setTerminalOpen(true);

        // Scroll the projects section into view smoothly.
        const section = document.querySelector(".githubproj-section");
        if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const closeTerminal = () => {
        setTerminalOpen(false);
        setSelectedRepo(null);
        setTypedText("");
    };

    const handlePrevRepo = () => {
        if (!selectedRepo) return;
        const currentIndex = repos.findIndex((repo) => repo.title === selectedRepo.title);
        const newIndex = (currentIndex - 1 + repos.length) % repos.length;
        setSelectedRepo(repos[newIndex]);
    };

    const handleNextRepo = () => {
        if (!selectedRepo) return;
        const currentIndex = repos.findIndex((repo) => repo.title === selectedRepo.title);
        const newIndex = (currentIndex + 1) % repos.length;
        setSelectedRepo(repos[newIndex]);
    };

    const terminalVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 }
    };

    // Helper to create content pieces.
    const createPieces = (repo) => {
        const formattedDate = new Date(repo.updatedAt).toLocaleString();
        return [
            { tag: "h3", text: "/" + repo.title },
            {
                tag: "h4",
                text: "> Language(s): ",
                className: "p-languages",
                languages: repo.languages
            },
            ...(repo.description
                ? [
                    {
                        tag: "p",
                        text: "$ Description: " + repo.description,
                        className: "p-description"
                    }
                ]
                : []),
            ...(repo.introduction
                ? [{ tag: "p", text: repo.introduction, className: "p-intro" }]
                : []),
            { tag: "url", text: repo.url },
            { tag: "p", text: "Last Updated: " + formattedDate, className: "p-updated" }
        ];
    };

    useEffect(() => {
        async function fetchRepos() {
            try {
                const data = await fetchGitHubData();
                // Assuming your fetchGitHubData returns an object with a "repositories" field:
                setRepos(data.repositories);
            } catch (err) {
                console.error(err.message);
            }
        }
        fetchRepos();
    });

    useEffect(() => {
        if (!selectedRepo) return;
        const pieces = createPieces(selectedRepo);
        const piecesWithNL = pieces.map((piece, i) => ({
            ...piece,
            fullText: i < pieces.length - 1 ? piece.text + "\n" : piece.text
        }));

        const fullCombined = piecesWithNL.map((piece) => piece.fullText).join("");

        setTypedText("");
        let currentIndex = 0;
        const interval = setInterval(() => {
            setTypedText(fullCombined.slice(0, currentIndex));
            currentIndex++;
            if (currentIndex > fullCombined.length) {
                clearInterval(interval);
            }
        }, 5); // Adjust typing speed as desired

        return () => clearInterval(interval);
    }, [selectedRepo]);

        useEffect(() => {
        async function fetchRepos() {
            try {
                const data = await fetchGitHubData();
                // Assuming your fetchGitHubData returns an object with a "repositories" field:
                setRepos(data.repositories);
            } catch (err) {
                console.error(err.message);
            }
        }
        fetchRepos();
    });

    // Reconstruct the rendered pieces based on typedText.
    const getRenderedPieces = () => {
        if (!selectedRepo) return [];
        const pieces = createPieces(selectedRepo);
        const piecesWithNL = pieces.map((piece, i) => ({
            ...piece,
            fullText: i < pieces.length - 1 ? piece.text + "\n" : piece.text
        }));

        let remaining = typedText.length;
        const rendered = [];
        for (let piece of piecesWithNL) {
            if (remaining <= 0) break;
            if (remaining >= piece.fullText.length) {
                rendered.push({ ...piece, displayed: piece.text, isComplete: true });
                remaining -= piece.fullText.length;
            } else {
                const partial = piece.text.slice(0, remaining);
                rendered.push({ ...piece, displayed: partial, isComplete: false });
                remaining = 0;
                break;
            }
        }
        return rendered;
    };

    const renderedPieces = getRenderedPieces();

    return (
        <div className="programming">
            <div className="programming-title">
                <h1 className="pop-in">My CS Journey</h1>
            </div>

            <section className="githubproj-section">
                <div className="githubproj-panel">
                    <h2>Published Projects</h2>
                    <div className="repo-grid">
                        {repos.map((repo, index) => (
                            <div
                                key={index}
                                className="repo-item"
                                onClick={(e) => openTerminal(repo, e)}
                            >
                                <div className="repologo">
                                    <img src={terminalImg} alt="terminaldefaultlogo" />
                                </div>
                                <div className="repo-info">
                                    <h3>{repo.title}</h3>
                                    <p>{repo.languages[0]}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <AnimatePresence>
                    {terminalOpen && selectedRepo && (
                        <motion.div
                            className="csterminal-overlay"
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={terminalVariants}
                            transition={{ duration: 0.4, ease: [0.3, 1, 0.4, 1] }}
                            style={{ transformOrigin: `${transformOrigin.x} ${transformOrigin.y}` }}
                        >
                            <div className="csterminal-header">
                                <div className="csterminal-buttons">
                                    <button className="redbtn" onClick={closeTerminal}></button>
                                    <button className="yellowbtn" onClick={handlePrevRepo}></button>
                                    <button className="purplebtn" onClick={handleNextRepo}></button>
                                </div>
                            </div>
                            <div className="csterminal-content">
                                {renderedPieces.map((piece, index) => {
                                    // Special handling for the Languages piece:
                                    if (piece.tag === "h4" && piece.className === "p-languages") {
                                        if (piece.isComplete) {
                                            return (
                                                <h4 key={index} className="p-languages">
                                                    {piece.displayed}
                                                    {renderLanguageLogos(selectedRepo.languages)}
                                                </h4>
                                            );
                                        } else {
                                            return (
                                                <h4 key={index} className="p-languages">
                                                    {piece.displayed}
                                                    <span className="cs-blinking-cursor">█</span>
                                                </h4>
                                            );
                                        }
                                    }

                                    // For URL piece.
                                    if (piece.tag === "url") {
                                        if (piece.isComplete) {
                                            return (
                                                <div key={index} className="terminal-url">
                                                    <a
                                                        href={piece.displayed}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        {piece.displayed}
                                                    </a>
                                                </div>
                                            );
                                        } else {
                                            return (
                                                <div key={index} className="terminal-url">
                                                    <p>
                                                        {piece.displayed}
                                                        <span className="cs-blinking-cursor">█</span>
                                                    </p>
                                                </div>
                                            );
                                        }
                                    }

                                    // Render all other pieces normally.
                                    let Element = "p";
                                    if (piece.tag === "h3") Element = "h3";
                                    if (piece.tag === "h4") Element = "h4";
                                    return (
                                        <Element key={index} className={piece.className || ""}>
                                            {piece.displayed}
                                            {!piece.isComplete && (
                                                <span className="cs-blinking-cursor">█</span>
                                            )}
                                        </Element>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>
        </div>
    );
};

export default CS;
