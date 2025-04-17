import React, { useEffect } from "react";
import "./Webapp.css";


const Webapp = () => {
        useEffect(() => {
                const initFadeInObserver = () => {
                        const animatedElements = document.querySelectorAll('.webapp-card');
                        const observer = new IntersectionObserver((entries, obs) => {
                                entries.forEach(entry => {
                                        if (entry.isIntersecting) {
                                                if (entry.target.classList.contains("webapp-card")) {
                                                        const cards = Array.from(document.querySelectorAll(".webapp-card"));
                                                        const index = cards.indexOf(entry.target);
                                                        setTimeout(() => {
                                                                entry.target.classList.add("visible");
                                                        }, index * 75);
                                                } else {
                                                        entry.target.classList.add("visible");
                                                }
                                                obs.unobserve(entry.target);
                                        }
                                });
                        }, { threshold: 0.3 });

                        animatedElements.forEach(el => observer.observe(el));
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
        return (
                <div className="webapp-browser">
                        <div className="webapp-title">
                                <h1 className="pop-in">My WebApps</h1>
                        </div>
                        <section className="webapp-section">
                                <div className="webapp-grid">
                                        <div className="webapp-card">
                                                <a href="https://convertifile.toridoesthings.xyz" className="card-link" target="_blank" rel="noopener noreferrer">
                                                        <h3>Convertifile</h3>
                                                        <p>All-in-one File Suite</p>
                                                        <p style={{ color: "lightgray", fontSize: "0.8rem" }}>(Under Construction!)</p>
                                                </a>
                                        </div>
                                        <div className="webapp-card">
                                                <a href="https://dailistai.example.com" className="card-link" target="_blank" rel="noopener noreferrer">
                                                        <h3>DailistAI</h3>
                                                        <p>AI meets Daily Planner</p>
                                                </a>
                                        </div>
                                        <div className="webapp-card">
                                                <a href="https://example.com" className="card-link" target="_blank" rel="noopener noreferrer">
                                                        <h3>ModernTorrent</h3>
                                                        <p>Electron Torrent Client</p>
                                                </a>
                                        </div>
                                        <div className="webapp-card">
                                                <a href="https://aimagetoolbox.example.com" className="card-link" target="_blank" rel="noopener noreferrer">
                                                        <h3>AImage Toolbox</h3>
                                                        <p>Image Upscale & Processing</p>
                                                </a>
                                        </div>
                                        <div className="webapp-card">
                                                <a href="https://transcraib.example.com" className="card-link" target="_blank" rel="noopener noreferrer">
                                                        <h3>TranscrAIb</h3>
                                                        <p>S-T-T AI transcriber</p>
                                                </a>
                                        </div>
                                        <div className="webapp-card">
                                                <a href="https://loudernot.example.com" className="card-link" target="_blank" rel="noopener noreferrer">
                                                        <h3>Loudernot</h3>
                                                        <p>Audio Loudness Penalty</p>
                                                </a>
                                        </div>
                                        <div className="webapp-card">
                                                <a href="https://medbaseai.example.com" className="card-link" target="_blank" rel="noopener noreferrer">
                                                        <h3>Medbase AI</h3>
                                                        <p>Medicine Databse</p>
                                                </a>
                                        </div>
                                        <div className="webapp-card">
                                                <a href="https://cryptolyzer.example.com" className="card-link" target="_blank" rel="noopener noreferrer">
                                                        <h3>Cryptolyzer</h3>
                                                        <p>Cryptocurrency Analyzer</p>
                                                </a>
                                        </div>
                                        <div className="webapp-card">
                                                <a href="https://summaraize.example.com" className="card-link" target="_blank" rel="noopener noreferrer">
                                                        <h3>SummarAIze</h3>
                                                        <p>Source aggregate summary generator</p>
                                                </a>
                                        </div>
                                        <div className="webapp-card">
                                                <a href="https://typetest.example.com" className="card-link" target="_blank" rel="noopener noreferrer">
                                                        <h3>TypeTest</h3>
                                                        <p>Just a Typing Test</p>
                                                </a>
                                        </div>
                                        <div className="webapp-card">
                                                <a href="https://idlegame.example.com" className="card-link" target="_blank" rel="noopener noreferrer">
                                                        <h3>IDLE Game</h3>
                                                        <p>...</p>
                                                </a>
                                        </div>
                                        <div className="webapp-card">
                                                <a href="https://chatily.example.com" className="card-link" target="_blank" rel="noopener noreferrer">
                                                        <h3>Chatily</h3>
                                                        <p>A realtime ChatAPP</p>
                                                </a>
                                        </div>
                                </div>
                        </section>
                </div>
        );
}

export default Webapp;
