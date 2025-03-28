import React, { useState, useEffect, useRef, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";

const learningTopics = [
  "🚀 Building useful APIs...",
  "⚛️ Learning React & Vite...",
  "🧠 Diving into AI Neural Networks with Music...",
  "🌐 Exploring Web3 & Blockchain...",
  "🎨 Learning frontend and optimizing UI/UX...",
  "🤖 Creating Discord Bots...",
];

const coursesList = [
  "📚 COMP 1405: Intro to Computer Science I",
  "📚 COMP 1406: Intro to Computer Science II",
  "📚 COMP 1805: Discrete Mathematics I",
  "📚 MATH 1007: Elementary Calculus I",
  "📚 MATH 1104: Linear Algebra I",
  "📚 CGSC 1001: Mysteries of the Mind",
  "📚 BIOL 1902: Natural History",
];

export default function LiveFeed() {
  const [displayMode, setDisplayMode] = useState("learning");
  const [displayedTopics, setDisplayedTopics] = useState([]);
  const [currentText, setCurrentText] = useState("");
  const [topicIndex, setTopicIndex] = useState(0);
  const [coursesPage, setCoursesPage] = useState(0);

  const containerRef = useRef(null);
  const contentRef = useRef(null);

  // Dynamically calculate max lines based on container height
  const [maxLines, setMaxLines] = useState(4);

  useEffect(() => {
    const calculateMaxLines = () => {
      if (containerRef.current && contentRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        const lineHeight = parseFloat(
          window.getComputedStyle(contentRef.current).lineHeight
        );
        
        // Subtract some padding to prevent overflow
        const availableLines = Math.max(
          1, 
          Math.floor((containerHeight - 100) / lineHeight)
        );
        
        setMaxLines(availableLines);
      }
    };

    calculateMaxLines();
    window.addEventListener('resize', calculateMaxLines);
    return () => window.removeEventListener('resize', calculateMaxLines);
  }, []);

  // Learning Mode Logic
  useEffect(() => {
    if (displayMode !== "learning") return;

    const currentTopic = learningTopics[topicIndex];
    let charIndex = 0;

    const typingInterval = setInterval(() => {
      if (charIndex <= currentTopic.length) {
        setCurrentText(currentTopic.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        
        // Add new topic and maintain max lines
        setDisplayedTopics(prev => {
          const newTopics = [...prev, currentTopic];
          return newTopics.slice(-maxLines);
        });

        // Reset for next topic
        setCurrentText("");
        setTopicIndex(prev => (prev + 1) % learningTopics.length);
      }
    }, 30);

    return () => clearInterval(typingInterval);
  }, [topicIndex, displayMode, maxLines]);

  const displayedCourses = useMemo(() => {
    if (displayMode !== "courses") return [];

    const totalPages = Math.ceil(coursesList.length / maxLines);
    const startIndex = coursesPage * maxLines;
    const endIndex = startIndex + maxLines;

    return coursesList.slice(startIndex, endIndex);
  }, [coursesPage, maxLines, displayMode]);

  useEffect(() => {
    if (displayMode !== "courses") return;

    const rotationTimer = setInterval(() => {
      setCoursesPage(prev => (prev + 1) % Math.ceil(coursesList.length / maxLines));
    }, 4000);

    return () => clearInterval(rotationTimer);
  }, [displayMode]);

  const toggleMode = (mode) => {
    if (mode === displayMode) return;

    setDisplayMode(mode);
    setDisplayedTopics([]);
    setCurrentText("");
    setTopicIndex(0);
    setCoursesPage(0);
  };

  return (
    <div ref={containerRef} className="terminal-container">
      <div className="terminal-header">
        <div className="terminal-dots">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
        </div>
        <div className="terminal-buttons">
          <button 
            className={`terminal-btn ${displayMode === "learning" ? "active" : ""}`}
            onClick={() => toggleMode("learning")}
          >
            Learning
          </button>
          <button 
            className={`terminal-btn ${displayMode === "courses" ? "active" : ""}`}
            onClick={() => toggleMode("courses")}
          >
            Courses
          </button>
        </div>
      </div>
      <div ref={contentRef} className="terminal-content">
        <AnimatePresence>
          {displayMode === "learning" ? (
            <>
              {displayedTopics.map((topic, i) => (
                <motion.div
                  key={`learning-${topic}-${i}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="terminal-line"
                >
                  {topic}
                </motion.div>
              ))}
              <div className="terminal-line">
                {currentText}<span className="blinking-cursor">█</span>
              </div>
            </>
          ) : (
            <>
              {displayedCourses.map((course, i) => (
                <motion.div
                  key={`course-${course}-${i}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="terminal-line"
                >
                  {course}
                </motion.div>
              ))}
              <div className="terminal-line">
                <span className="blinking-cursor">█</span>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}