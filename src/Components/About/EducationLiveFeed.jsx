import { React, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "./About.css";

const learningTopics = [
  "🚀 Building AI-powered APIs...",
  "⚛️ Mastering React & Next.js...",
  "🧠 Diving into Neural Networks with Music...",
  "🌐 Exploring Web3 & Blockchain...",
  "🎨 Learning to build Stunning UI/UX...",
  "🤖 Creating more Discord Bots...",
];

const coursesList = [
  "📚 COMP 1405: Introduction to Computer Science I",
  "📚 COMP 1406: Introduction to Computer Science II",
  "📚 COMP 1805: Discrete Mathematics I",
  "📚 MATH 1007: Elementary Calculus I",
  "📚 MATH 1104: Linear Algebra for Engineering",
  "📚 CGSC 1001: Mysteries of the Mind",
];

export default function LiveFeed() {
  const [displayMode, setDisplayMode] = useState("learning"); // "learning" or "courses"
  const [displayedTopics, setDisplayedTopics] = useState([]);
  const [currentText, setCurrentText] = useState("");
  const [index, setIndex] = useState(0);
  const contentRef = useRef(null);
  const containerRef = useRef(null);
  const [maxLines, setMaxLines] = useState(4);
  
  // State for courses rotation
  const [coursesSet, setCoursesSet] = useState(0);
  const [hasMoreCourses, setHasMoreCourses] = useState(false);

  // Calculate available lines based on container height
  useEffect(() => {
    const calculateVisibleLines = () => {
      if (!contentRef.current || !containerRef.current) return;
      const lineHeight = 50;
      const containerHeight = containerRef.current.clientHeight - lineHeight;
      const availableLines = Math.floor(containerHeight / lineHeight) - 1;
      setMaxLines(Math.max(1, availableLines));
      
      // Check if we have more courses than can fit
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

  // Update displayed courses when maxLines or coursesSet changes
  useEffect(() => {
    if (displayMode !== "courses") return;
    
    const updateCourses = () => {
      if (hasMoreCourses) {
        // Calculate how many sets we need
        const totalSets = Math.ceil(coursesList.length / maxLines);
        // Calculate which courses to show in the current set
        const startIdx = coursesSet % totalSets * maxLines;
        const endIdx = Math.min(startIdx + maxLines, coursesList.length);
        return coursesList.slice(startIdx, endIdx);
      } else {
        // If all courses fit, just show them all
        return coursesList.slice(0, maxLines);
      }
    };
    
    // Apply the new courses with a small animation delay
    const newCourses = updateCourses();
    setDisplayedTopics([]); // Clear first to trigger animation
    setTimeout(() => {
      setDisplayedTopics(newCourses);
    }, 300);
  }, [maxLines, coursesSet, hasMoreCourses, displayMode]);

  // Rotation timer for courses
  useEffect(() => {
    if (displayMode !== "courses" || !hasMoreCourses) return;
    
    const rotationTimer = setInterval(() => {
      setCoursesSet(prev => prev + 1);
    }, 2000); // Rotate every 2 seconds
    
    return () => clearInterval(rotationTimer);
  }, [displayMode, hasMoreCourses]);

  // Mode Toggle Function Handle
  const toggleMode = (mode) => {
    if (mode === displayMode) return;
    
    // Reset states when toggling
    setDisplayMode(mode);
    setCurrentText("");
    
    if (mode === "learning") {
      setDisplayedTopics([]);
      setIndex(0);
    } else {
      // For courses, reset to first set
      setCoursesSet(0);
    }
  };

  // Typing effect when in learning mode
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
              const newTopics = [...prev, learningTopics[index]];
              return newTopics.slice(-Math.min(maxLines, newTopics.length));
            });
            setCurrentText("");
            setIndex((prevIndex) => (prevIndex + 1) % learningTopics.length);
          }, 500);
        }
      }, 40);

      return () => clearInterval(typingInterval);
    }
  }, [index, maxLines, displayMode]);

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
                initial={{ opacity: 0, y: 5 }}
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
                initial={{ opacity: 0, y: 5 }}
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