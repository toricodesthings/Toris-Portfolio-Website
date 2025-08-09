import React, { useEffect } from "react";
import "./Webapp.css";

const Webapp = () => {
        // Webapp data - easy to edit, add, or remove items
        const webapps = [
                {
                        id: 1,
                        name: "Convertifile",
                        description: "All-in-one File Suite",
                        url: "https://convertifile.toridoesthings.xyz",
                        status: { text: "(Completed! (Offline))", color: "lightgreen" }
                },
                {
                        id: 2,
                        name: "Loudornot",
                        description: "Local Audio Analysis",
                        url: "https://loudornot.toridoesthings.xyz",
                        status: { text: "(Completed!)", color: "lightgreen" }
                },
                {
                        id: 3,
                        name: "TranscrAIb",
                        description: "Speech-Text AI transcriber",
                        url: "https://transcraib.toridoesthings.xyz",
                        status: { text: "(Building!)", color: "lightgray" }
                },

                {
                        id: 4,
                        name: "ModernTorrent",
                        description: "Electron Torrent Client",
                        url: "https://example.com"
                },
                {
                        id: 5,
                        name: "AImage Toolbox",
                        description: "Image Upscale & Processing",
                        url: "https://aimagetoolbox.example.com"
                },
                {
                        id: 6,
                        name: "Tapefi",
                        description: "Lofi Synthesizer Plugin",
                        url: "https://myplugins.toridoesthings.xyz"
                },
                {
                        id: 7,
                        name: "Medbase AI",
                        description: "Medicine & Healthbase AI",
                        url: "https://medbaseai.example.com"
                },
                {
                        id: 8,
                        name: "WealthTracker",
                        description: "Stock Portfolio Tracker",
                        url: "https://wealthtracker.example.com"
                },
                {
                        id: 9,
                        name: "Chatily",
                        description: "A realtime ChatAPP",
                        url: "https://chatily.example.com"
                },
                {
                        id: 10,
                        name: "Mutils",
                        description: "AIO Utility & Monitoring Plugin",
                        url: "https://myplugins.toridoesthings.xyz",
                }
        ];

        // Animation logic extracted to separate function
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

        useEffect(() => {
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
        const renderWebappCard = (webapp) => (
                <div key={webapp.id} className="webapp-card">
                        <a href={webapp.url} className="card-link" target="_blank" rel="noopener noreferrer">
                                <h3>{webapp.name}</h3>
                                <p>{webapp.description}</p>
                                {webapp.status && (
                                        <p style={{ color: webapp.status.color, fontSize: "0.8rem" }}>
                                                {webapp.status.text}
                                        </p>
                                )}
                        </a>
                </div>
        );

        return (
                <div className="webapp-browser">
                        <div className="webapp-title">
                                <h1 className="pop-in">My WebApps</h1>
                        </div>
                        <section className="webapp-section">
                                <div className="webapp-grid">
                                        {webapps.map(renderWebappCard)}
                                </div>
                        </section>
                </div>
        );
};

export default Webapp;