import React, { useEffect, useRef, useState, useCallback } from "react";
import "./About.css";
import LiveFeed from "./EducationLiveFeed";
import profile_img from "../../assets/temp_profileimg.webp";
import pythonImg from "../../assets/skills/python.svg";
import javaImg from "../../assets/skills/java.svg";
import htmlImg from "../../assets/skills/html.svg";
import cssImg from "../../assets/skills/css.svg";
import jsImg from "../../assets/skills/javascript.svg";
import reactImg from "../../assets/skills/react.svg";
import nodejsImg from "../../assets/skills/nodejs.svg";
import gitImg from "../../assets/skills/git.svg";
import mysqlImg from "../../assets/skills/mysql.svg";
import wrapped2023 from "../../assets/Wrapped2023.jpg";
import wrapped2024 from "../../assets/Wrapped2024.jpg";

const skills = [
  { name: "Python", img: pythonImg },
  { name: "Java", img: javaImg },
  { name: "HTML", img: htmlImg },
  { name: "CSS", img: cssImg },
  { name: "JavaScript", img: jsImg },
  { name: "React", img: reactImg },
  { name: "Node.js", img: nodejsImg },
  { name: "Git/GitHub", img: gitImg },
  { name: "MySQL", img: mysqlImg },
];

const About = () => {
  const scrollRef = useRef(null);
  // Use refs for values that control scrolling to avoid re-renders in the animation loop.
  const scrollDirectionRef = useRef(1);
  const isUserScrollingRef = useRef(false);
  const isDraggingRef = useRef(false);
  const dragStartX = useRef(0);
  const scrollLeftStart = useRef(0);
  const [activeImage, setActiveImage] = useState(1);
  const animationFrameId = useRef(null);

  // Auto-scroll function using requestAnimationFrame for smoother scrolling.
  const autoScroll = useCallback(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      if (!isUserScrollingRef.current && !isDraggingRef.current) {
        scrollContainer.scrollLeft += scrollDirectionRef.current * 5;
        // Reverse direction when reaching the ends.
        if (
          scrollContainer.scrollLeft + scrollContainer.clientWidth >=
          scrollContainer.scrollWidth - 5
        ) {
          scrollDirectionRef.current = -1;
        } else if (scrollContainer.scrollLeft <= 0) {
          scrollDirectionRef.current = 1;
        }
      }
      animationFrameId.current = requestAnimationFrame(autoScroll);
    }
  }, []);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer && scrollContainer.scrollWidth > scrollContainer.clientWidth) {
      animationFrameId.current = requestAnimationFrame(autoScroll);
    }

    // When the user scrolls manually, pause auto-scrolling temporarily.
    const handleUserScroll = () => {
      isUserScrollingRef.current = true;
      setTimeout(() => {
        isUserScrollingRef.current = false;
      }, 3000);
    };

    // Handle flipping music images inside the .music-flip container.
    const handleMusicFlipScroll = (event) => {
      const musicFlipContainer = document.querySelector(".music-flip");
      if (musicFlipContainer && musicFlipContainer.contains(event.target)) {
        event.preventDefault(); // Prevent page scrolling.
        setActiveImage(event.deltaY > 0 ? 2 : 1);
      }
    };

    // Drag-based scrolling for the stats section.
    const handleMouseDown = (e) => {
      isDraggingRef.current = true;
      dragStartX.current = e.pageX;
      scrollLeftStart.current = scrollContainer.scrollLeft;
    };

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.pageX - dragStartX.current;
      scrollContainer.scrollLeft = scrollLeftStart.current - deltaX;
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    // Touch event handlers for mobile and iPad support.
    const handleTouchStart = (e) => {
      isDraggingRef.current = true;
      dragStartX.current = e.touches[0].pageX;
      scrollLeftStart.current = scrollContainer.scrollLeft;
    };

    const handleTouchMove = (e) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.touches[0].pageX - dragStartX.current;
      scrollContainer.scrollLeft = scrollLeftStart.current - deltaX;
    };

    const handleTouchEnd = () => {
      isDraggingRef.current = false;
    };

    // Attach event listeners.
    scrollContainer.addEventListener("wheel", handleUserScroll, { passive: true });
    scrollContainer.addEventListener("touchstart", handleUserScroll, { passive: true });
    scrollContainer.addEventListener("mousedown", handleMouseDown);
    scrollContainer.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    scrollContainer.addEventListener("touchstart", handleTouchStart, { passive: true });
    scrollContainer.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
    document
      .querySelector(".music-flip")
      ?.addEventListener("wheel", handleMusicFlipScroll, { passive: false });

    return () => {
      cancelAnimationFrame(animationFrameId.current);
      scrollContainer.removeEventListener("wheel", handleUserScroll);
      scrollContainer.removeEventListener("touchstart", handleUserScroll);
      scrollContainer.removeEventListener("mousedown", handleMouseDown);
      scrollContainer.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      scrollContainer.removeEventListener("touchstart", handleTouchStart);
      scrollContainer.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      document
        .querySelector(".music-flip")
        ?.removeEventListener("wheel", handleMusicFlipScroll);
    };
  }, [autoScroll]);

  return (
    <div className="about">
      <div className="about-title">
        <h1 className="pop-in">About me</h1>
      </div>

      <section className="intro-section">
        <div className="about-intro-left">
          <img src={profile_img} alt="Profile" className="aboutprofileimg" />
        </div>
        <div className="about-intro-right">
          <div className="about-para">
            <h2>Who am I?</h2>
            <p>
              Many may know me as Tori. I am a passionate first-year Computer
              Science student in Ottawa dedicated to learning and growing in the field of technology. I also dedicate a ton of my free time into my side project in Music Production and Audio Engineering.
            </p>
          </div>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-education">
          <h2>Current Education</h2>
          <div className="education-panel">
            <p>
              Since I was young, I enjoyed experimenting and pushing tech to its limit. Currently, I am pursuing my first-year Bachelor’s in Computer Science at Carleton University in the software engineering stream, but my focus is quite general involving AI, programming, web development, and software development. One of my first projects started out as multi-purpose Discord bots built for specific servers. I am now branching it out to create general purpose programs, web API wrappers, and AI wrappers.
            </p>
            <div className="live-feed-element">
              <LiveFeed />
            </div>
          </div>
        </div>

        <div className="cs-skills-panel">
          <h2>Programming Technical Skills</h2>
          <div className="skills-grid">
            {skills.map((skill) => (
              <span key={skill.name} className="skill-text">
                <img src={skill.img} alt={skill.name} className="skill-icon" />
                <span className="skill-label">{skill.name}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="music-section">
        <div className="music-para">
          <h2>My Music Career</h2>
          <div className="music-panel">
            <p>
              Aside from coding, I am a passionate and professional musician with a deep love for rhythm, melody, and sound design. Music has always been my escape, my therapy, and my way of understanding the world. My journey into music started over 7 years ago when I was first discovered Ableton and EDM Production. Now, I play many instruments, including the drums, bass guitar, and piano. I have worked on numerous projects as a producer, produced in all genres from Lofi to EDM to Pop to Metal, pushing creative boundaries to craft unique sounds. Additionally, I specialize in audio-engineering, mixing, and mastering, helping other artists bring their visions to life with polished and professional audio quality.
            </p>
            {/* Vertical Timeline */}
            <div className="music-timeline">
              <div className="timeline-container">
                <div className="timeline-item">
                  <div className="circle"></div>
                  <div className="timeline-text">
                    <span className="timeline-year">2017</span>
                    <span className="timeline-description">
                      Discovered EDM Music Production for the first time
                    </span>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="circle"></div>
                  <div className="timeline-text">
                    <span className="timeline-year">2020</span>
                    <span className="timeline-description">
                      Released first track to the public
                    </span>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="circle"></div>
                  <div className="timeline-text">
                    <span className="timeline-year">2021</span>
                    <span className="timeline-description">
                      Made a series of Cover Songs
                    </span>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="circle"></div>
                  <div className="timeline-text">
                    <span className="timeline-year">2022</span>
                    <span className="timeline-description">
                      Started merging genres and got into metal
                    </span>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="circle"></div>
                  <div className="timeline-text">
                    <span className="timeline-year">2024</span>
                    <span className="timeline-description">
                      Hit peak 50K monthly listeners and 2M+ streams
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <h2 className="stats-current">Current Stats</h2>
        {/* Music Image Flip Section */}
        <div className="music-flip">
          <div
            className={`flip-image left ${activeImage === 1 ? "active" : ""}`}
            onClick={() => setActiveImage(1)}
          >
            <img src={wrapped2023} alt="Music Image 1" />
          </div>

          <div
            className={`flip-image right ${activeImage === 2 ? "active" : ""}`}
            onClick={() => setActiveImage(2)}
          >
            <img src={wrapped2024} alt="Music Image 2" />
          </div>
        </div>

        <div
          className="music-stat-box"
          ref={scrollRef}
          style={{
            overflowX: "auto",
            display: "flex",
            willChange: "scroll-position",
            WebkitTransform: "translateZ(0)",
            transform: "translateZ(0)",
          }}
        >
          <div className="music-stat-item">
            <h3>7+</h3>
            <p>Years &amp; Counting...</p>
          </div>
          <div className="music-stat-item">
            <h3>50+</h3>
            <p>Projects</p>
          </div>
          <div className="music-stat-item">
            <h3>2M+</h3>
            <p>Streams</p>
          </div>
          <div className="music-stat-item">
            <h3>20k+</h3>
            <p>Monthly Audience</p>
          </div>
          <div className="music-stat-item">
            <h3>5+</h3>
            <p>Collaborators</p>
          </div>
          <div className="music-stat-item">
            <h3>20+</h3>
            <p>Client Projects</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
