import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import HamsterLoadingUI from "../LoadingUI/HamsterLoader";
import CSTechStack from "./TechStack";
import CSEduTree from "./EducationTree";
import UpcomingProjectsAndLearningStack from "./LnU";
import ReactMarkdown from "react-markdown";
import "./CSMain.css";

//language logos
import pythonImg from "../../assets/skills/python.svg";
import htmlImg from "../../assets/skills/html.svg";
import cssImg from "../../assets/skills/css.svg";
import dockerImg from "../../assets/skills/docker.svg";
import jsImg from "../../assets/skills/javascript.svg";
import tsImg from "../../assets/skills/typescript.svg";
import batchImg from "../../assets/skills/terminal.svg";
import terminalImg from "../../assets/cspage/terminallogo.svg";

// Add preload function
const criticalImages = [terminalImg];

const preloadCriticalImages = () => {
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
};

// Mapping for language logos and colors.
const languageData = {
    Python: { logo: pythonImg, color: "#61DAFB" },
    Dockerfile: { logo: dockerImg, color: "#61DAFB" },
    Batchfile: { logo: batchImg, color: "#D3D3D3" },
    JavaScript: { logo: jsImg, color: "#F0DB4F" },
    TypeScript: { logo: tsImg, color: "#688eff" },
    "HTML": { logo: htmlImg, color: "#E34C26" },
    CSS: { logo: cssImg, color: "#264de4" }
};

const renderLanguageLogos = (languages) => {
    return (
        <div>
            {languages.map((lang, index) => {
                const data = languageData[lang];
                return (
                    <span key={index} style={{ color: data ? data.color : "white" }}>
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const openTerminal = (repo, event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const originX = rect.left + rect.width / 2;
        const originY = rect.top + rect.height / 2;
        setTransformOrigin({ x: `${originX}px`, y: `${originY}px` });
        setSelectedRepo(repo);
        setTerminalOpen(true);

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
            { tag: "h4", text: "Overview", className: "p-overview" },
            ...(repo.introduction
                ? [{ tag: "p", text: repo.introduction, className: "p-intro" }]
                : []),
            { tag: "url", text: repo.url },

            { tag: "p", text: "Last Updated: " + formattedDate, className: "p-updated" }
        ];
    };

    useEffect(() => {
        preloadCriticalImages();
        fetchRepos();
    }, []);

    // Move fetchRepos outside useEffect for reusability
    const fetchRepos = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('/api/gettorisgithubdata');
            if (!response.ok) {
                throw new Error('Failed to fetch repos');
            }
            const data = await response.json();
            setRepos(data.repositories);
            setLoading(false);
        } catch (err) {
            console.error(err.message);
            setError("Live Github data could not be loaded");
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!selectedRepo) return;
        const pieces = createPieces(selectedRepo);
        const piecesWithNL = pieces.map((piece, i) => ({
            ...piece,
            fullText: i < pieces.length - 1 ? piece.text + "\n" : piece.text
        }));

        const fullCombined = piecesWithNL.map(piece => piece.fullText).join("");

        setTypedText("");
        let currentIndex = 0;

        const totalDuration = 2500;
        const updateInterval = 10;
        const totalTicks = totalDuration / updateInterval;
        const charsPerTick = Math.ceil(fullCombined.length / totalTicks);

        const interval = setInterval(() => {
            currentIndex += charsPerTick;
            if (currentIndex >= fullCombined.length) {
                currentIndex = fullCombined.length;
                setTypedText(fullCombined.slice(0, currentIndex));
                clearInterval(interval);
            } else {
                setTypedText(fullCombined.slice(0, currentIndex));
            }
        }, updateInterval);

        return () => clearInterval(interval);
    }, [selectedRepo]);

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

    useEffect(() => {
        const initFadeInObserver = () => {
            const animatedElements = document.querySelectorAll(
                '.githubproj-text, .githubproj-panel, .tech-summary, .summary-text, .keyword-row, ' +
                '.stack-bubble-container, .bubble-group, .techstack-text, .upcoming-text, .project-learning-stack, ' +
                '.eduprog-text, .tree-wrapper'
            );

            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        if (entry.target.classList.contains("bubble-group")) {
                            const skillItems = Array.from(entry.target.querySelectorAll(".bubbles"));
                            skillItems.forEach((item, index) => {
                                setTimeout(() => {
                                    item.classList.add("visible");
                                }, index * 75);
                            });
                        } else if (entry.target.classList.contains("keyword-row")) {
                            const skillItems = Array.from(entry.target.querySelectorAll(".key-mini"));
                            skillItems.forEach((item, index) => {
                                setTimeout(() => {
                                    item.classList.add("visible");
                                }, index * 100);
                            });
                        }
                        else {
                            setTimeout(() => {
                                entry.target.classList.add("visible");
                            }, 50);
                        }
                        obs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });

            animatedElements.forEach((el) => observer.observe(el));
        };

        const initObserver = () => {
            setTimeout(initFadeInObserver, 100);
        };

        if (document.readyState === "complete") {
            initObserver();
        } else {
            window.addEventListener("load", initObserver);
            return () => window.removeEventListener("load", initObserver);
        }
    }, []);

    const renderedPieces = getRenderedPieces();

    return (
        <div className="programming">
            <div className="programming-title">
                <h1 className="pop-in">Computer Science Journey</h1>
            </div>

            <section className="githubproj-section">
                <h2 className="githubproj-text">Published Projects</h2>
                <div className="githubproj-panel">
                    {loading && <div className="grid-loading"><HamsterLoadingUI /></div>}
                    {error && <p className="grid-error-text">{error}</p>}
                    {!loading && !error && (
                        <div className="repo-grid">
                            {repos.map((repo, index) => (
                                <div className="repo-grid-item" key={index}>
                                    <div
                                        className="repo-item"
                                        style={{ animationDelay: `${index * 150}ms` }}
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
                                </div>
                            ))}
                        </div>
                    )}
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
                                    // Special handling for Languages and URL pieces (if needed) remains unchanged.
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

                                    if (piece.tag === "url") {
                                        if (piece.isComplete) {
                                            return (
                                                <div key={index} className="terminal-url">
                                                    <a href={piece.displayed} target="_blank" rel="noopener noreferrer">
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

                                    // For pieces that may contain markdown:
                                    let Element = "p";
                                    if (piece.tag === "h3") Element = "h3";
                                    if (piece.tag === "h4") Element = "h4";

                                    // If the piece is complete, render it with ReactMarkdown so that any markdown syntax is properly parsed.
                                    // Otherwise, render the plain text for the typing animation.
                                    return (
                                        <Element key={index} className={piece.className || ""}>
                                            {piece.isComplete ? (
                                                <ReactMarkdown>{piece.displayed}</ReactMarkdown>
                                            ) : (
                                                <>
                                                    {piece.displayed}
                                                    <span className="cs-blinking-cursor">_</span>
                                                </>
                                            )}
                                        </Element>
                                    );
                                })}

                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            <section className="techstack-section">
                <h2 className="tech-summary">Summary</h2>
                <div className="summary-para">
                    <p className="summary-text">I'm a passionate first-year Software Engineering student at Carleton University with a strong eye for detail and love for appealing, intuitive front-end design. Though, I also enjoy doing backend development and building out the full stack.As of now, my main proficiency is Python which I've put to use by also exploring AI/ML with Tensorflow—after all, I’m all about finding smart, efficient ways to make life easier; anything to put repetitive tasks on autopilot.</p>
                    <div className="section-divider" />
                    <div className="keyword-row">
                        <div className="key-mini">Frontend Engineer</div>
                        <div className="key-mini">UX Centered</div>
                        <div className="key-mini">Software Engineer</div>
                        <div className="key-mini">Full Stack Developer</div>
                        <div className="key-mini">AI/ML Enthusiast</div>
                        <div className="key-mini">Automation-Focused</div>
                    </div>
                </div>
                <h2 className="techstack-text">My Tech Stack</h2>
                <CSTechStack />
                <h2 className="upcoming-text">Learning & Upcoming Projects</h2>

                <UpcomingProjectsAndLearningStack />
            </section>

            {/* New Education Section with animated growth tree */}
            <section className="education-treesection">
                <h2 className="eduprog-text">Education Progress</h2>
                <div className="tree-wrapper">
                    <CSEduTree />
                </div>
            </section>
        </div>
    );
};

export default CS;
