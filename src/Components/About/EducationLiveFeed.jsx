import { React, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "./About.css";

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
  const [displayMode, setDisplayMode] = useState("learning"); // "learning" or "courses"
  const [displayedTopics, setDisplayedTopics] = useState([]);
  const [currentText, setCurrentText] = useState("");
  const [index, setIndex] = useState(0);
  const contentRef = useRef(null);
  const containerRef = useRef(null);
  const [maxLines, setMaxLines] = useState(4);
  
  const [coursesSet, setCoursesSet] = useState(0);
  const [hasMoreCourses, setHasMoreCourses] = useState(false);

  useEffect(() => {
    const calculateVisibleLines = () => {
      if (!contentRef.current || !containerRef.current) return;
      const lineHeight = 50;
      const containerHeight = containerRef.current.clientHeight - lineHeight;
      const availableLines = Math.floor(containerHeight / lineHeight); 
      setMaxLines(Math.max(1, availableLines));
      setHasMoreCourses(coursesList.length > availableLines);
    };
    calculateVisibleLines();
    
    const resizeObserver = new ResizeObserver(calculateVisibleLines);
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (displayMode !== "courses") return;
    
    const updateCourses = () => {
      if (hasMoreCourses) {
        const totalSets = Math.ceil(coursesList.length / maxLines);
        const startIdx = (coursesSet % totalSets) * maxLines;
        const endIdx = Math.min(startIdx + maxLines, coursesList.length);
        return coursesList.slice(startIdx, endIdx);
      } else {
        return coursesList.slice(0, maxLines);
      }
    };

    const newCourses = updateCourses();
    setDisplayedTopics([]); 
    setTimeout(() => {
      setDisplayedTopics(newCourses);
    }, 300);
  }, [maxLines, coursesSet, hasMoreCourses, displayMode]);

  useEffect(() => {
    if (displayMode !== "courses" || !hasMoreCourses) return;
    
    const rotationTimer = setInterval(() => {
      setCoursesSet(prev => prev + 1);
    }, 4000); 
    
    return () => clearInterval(rotationTimer);
  }, [displayMode, hasMoreCourses]);

  const toggleMode = (mode) => {
    if (mode === displayMode) return;
    
    setDisplayMode(mode);
    setCurrentText("");
    
    if (mode === "learning") {
      setDisplayedTopics([]);
      setIndex(0);
    } else {
      setCoursesSet(0);
    }
  };

  useEffect(() => {
    if (displayMode !== "learning") return;
  
    if (index < learningTopics.length) {
      let charIndex = 0;
      const typingInterval = setInterval(() => {
        if (charIndex <= learningTopics[index].length) {
          setCurrentText(learningTopics[index].slice(0, charIndex));
          charIndex++;
        } else {
          clearInterval(typingInterval);
          setTimeout(() => {
            setDisplayedTopics(prev => {
              // Only remove the top line if we've exceeded the max lines.
              const newTopics = [...prev, learningTopics[index]];
              return newTopics.length > maxLines
                ? newTopics.slice(1)
                : newTopics;
            });
            setCurrentText("");
            setIndex(prevIndex => (prevIndex + 1) % learningTopics.length);
          }, 500);
        }
      }, 40);
  
      return () => clearInterval(typingInterval);
    }
  }, [index, displayMode]);

  useEffect(() => {
    if (displayMode === "learning") {
      setDisplayedTopics([]);
      setCurrentText("");
      setIndex(0);
    }
  }, [displayMode]);

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
        {displayMode === "learning" ? (
          // Learning mode content
          <>
            {displayedTopics.map((topic, i) => (
              <motion.div
                key={`learning-${topic}-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
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
          // Courses mode content
          <>
            {displayedTopics.map((course, i) => (
              <motion.div
                key={`course-${course}-${coursesSet}-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
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
      </div>
    </div>
  );
}
