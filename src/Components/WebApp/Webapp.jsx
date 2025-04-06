import React from "react";
import "./Webapp.css";


const Webapp = () => {
  return (
    <div className="webapp-browser">
        <div className="webapp-title">
            <h1 className="pop-in">My WebApps</h1>
        </div>
        <section className="webapp-section">
            <div className="webapp-grid">
                <div className="webapp-card">
                    <a href="convertifile.toridoesthings.xyz" className="card-link">
                        <h3>Convertifile</h3>
                        <p>All-in-one File Suite</p>
                        <p style={{color: "lightgray", fontSize: "0.8rem"}}>(Under Construction!)</p>
                    </a>
                </div>
                <div className="webapp-card">
                    <a href="#" className="card-link">
                        <h3>DailistAI</h3>
                        <p>AI meets Daily Planner</p>
                    </a>
                </div>
                <div className="webapp-card">
                    <a href="#" className="card-link">
                        <h3>AImage Toolbox</h3>
                        <p>Image Upscale & Processing</p>
                    </a>
                </div>
                <div className="webapp-card">
                    <a href="#" className="card-link">
                        <h3>TranscrAIb</h3>
                        <p>S-T-T AI transcriber</p>
                    </a>
                </div>
                <div className="webapp-card">
                    <a href="#" className="card-link">
                        <h3>Loudernot</h3>
                        <p>Audio Loudness Penalty</p>
                    </a>
                </div>
                <div className="webapp-card">
                    <a href="#" className="card-link">
                        <h3>Medbase AI</h3>
                        <p>Medicine Databse</p>
                    </a>
                </div>
                <div className="webapp-card">
                    <a href="#" className="card-link">
                        <h3>Cryptolyzer</h3>
                        <p>Cryptocurrency Analyzer</p>
                    </a>
                </div>
                <div className="webapp-card">
                    <a href="#" className="card-link">
                        <h3>SummarAIze</h3>
                        <p>Source aggregate summary generator</p>
                    </a>
                </div>
                <div className="webapp-card">
                    <a href="#" className="card-link">
                         <h3>TypeTest</h3>
                        <p>Just a Typing Test</p>
                    </a>
                </div>
                <div className="webapp-card">
                    <a href="#" className="card-link">
                         <h3>IDLE Game</h3>
                        <p>...</p>
                    </a>
                </div>
                <div className="webapp-card">
                    <a href="#" className="card-link">
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
