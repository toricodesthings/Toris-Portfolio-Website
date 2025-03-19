import React from "react";

import jsImg from "../../assets/skills/javascript.svg";
import nodejsImg from "../../assets/skills/nodejs.svg";
import csharpImg from "../../assets/skills/csharp.svg";
import tensorflowImg from "../../assets/skills/tensorflow.svg";

// Example data array for upcoming projects and learning items.
const projectLearningItems = [
  { img: jsImg, name: "Video Extractors" },
  { img: jsImg, name: "Cryptocurrency Analyzers" },
  { img: tensorflowImg, name: "AI Models" },
  { img: jsImg, name: "Typing Test" },
  { img: nodejsImg, name: "Useful APIs" },
  { img: csharpImg, name: "Unity & C#" }
  // Add more items as needed
];

const UpcomingProjectsAndLearningStack = () => {
  return (
    <div className="project-learning-stack-container">
      <div className="project-learning-stack">
        <div className="scrolling-items">
          {[...projectLearningItems, ...projectLearningItems].map((item, index) => (
            <div key={index} className="project-learning-item">
              <img
                src={item.img}
                alt={item.name}
                className="project-learning-icon"
              />
              <span className="project-learning-text">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UpcomingProjectsAndLearningStack;