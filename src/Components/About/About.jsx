import React, { useEffect, useRef, useState } from "react";
import "./About.css";
import LiveFeed from "./EducationLiveFeed";
import profile_img from "../../assets/temp_profileimg.png";
import pythonImg from "../../assets/skills/python.svg";
import javaImg from "../../assets/skills/java.svg";
import htmlImg from "../../assets/skills/html.svg";
import cssImg from "../../assets/skills/css.svg";
import jsImg from "../../assets/skills/javascript.svg";
import reactImg from "../../assets/skills/react.svg";
import nodejsImg from "../../assets/skills/nodejs.svg";
import gitImg from "../../assets/skills/git.svg";
import mysqlImg from "../../assets/skills/mysql.svg";

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
  const [scrollDirection, setScrollDirection] = useState(1); // 1 for right, -1 for left
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const scrollLeftStart = useRef(0);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    let scrollInterval;

    const startAutoScroll = () => {
      if (scrollContainer.scrollWidth > scrollContainer.clientWidth) {
        scrollInterval = setInterval(() => {
          if (!isUserScrolling && !isDragging) {
            scrollContainer.scrollLeft += scrollDirection * 4; // Adjust speed

            // Reverse direction at edges
            if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 5) {
              setScrollDirection(-1); // Scroll left
            } else if (scrollContainer.scrollLeft <= 0) {
              setScrollDirection(1); // Scroll right
            }
          }
        }, 35);
      }
    };

    // Detect manual scroll and stop auto-scroll
    const handleUserScroll = () => {
      setIsUserScrolling(true);
      clearInterval(scrollInterval);
      setTimeout(() => setIsUserScrolling(false), 3000); // Resume after 3s
    };

    // Drag-based scrolling
    const handleMouseDown = (e) => {
      setIsDragging(true);
      dragStartX.current = e.pageX;
      scrollLeftStart.current = scrollContainer.scrollLeft;
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = e.pageX - dragStartX.current;
      scrollContainer.scrollLeft = scrollLeftStart.current - deltaX;
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    scrollContainer.addEventListener("wheel", handleUserScroll);
    scrollContainer.addEventListener("touchstart", handleUserScroll);
    scrollContainer.addEventListener("mousedown", handleMouseDown);
    scrollContainer.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    startAutoScroll();

    return () => {
      clearInterval(scrollInterval);
      scrollContainer.removeEventListener("wheel", handleUserScroll);
      scrollContainer.removeEventListener("touchstart", handleUserScroll);
      scrollContainer.removeEventListener("mousedown", handleMouseDown);
      scrollContainer.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isUserScrolling, scrollDirection, isDragging]);

  return (
    <div className="about">
      <div className="about-title">
        <h1 className="pop-in">About me</h1>
      </div>

      <section className="intro-section pop-in">
        <div className="about-intro-left">
          <img src={profile_img} alt="Profile" className="aboutprofileimg" />
        </div>
        <div className="about-intro-right">
          <div className="about-para">
            <h2>Who am I?</h2>
            <p>
              Many may know me as Tori. I am a passionate first-year Computer
              Science student at Carleton University dedicated to learning and
              growing in the field of technology. I also dedicate a ton of my
              free time into my side project in Music Production and Audio
              Engineering.
            </p>
          </div>
        </div>
      </section>

      <section className="cs-section pop-in">
        <div className="cs-education">
          <h2>Current Education</h2>
          <div className="education-panel">
            <p>
              Since I was young, I enjoyed experimenting and pushing tech to its
              limit. Currently, I am pursuing my first-year Bachelor’s in
              Computer Science at Carleton University in the software
              engineering stream, but my focus is quite general involving AI,
              programming, web development, and software development. One of my
              first projects started out as multi-purpose Discord bots built for
              specific servers. I am now branching it out to create general
              purpose programs, web API wrappers, and AI wrappers.
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
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="music-section pop-in">
        <div className="music-para">
          <h2>My Music Career</h2>
          <p>
            Aside from coding, I am a professional musician. I play the drums,
            the bass guitar, and the piano. I also produce music and regularly
            do audio-engineering work for both covers and originals.
          </p>
        </div>
        <div className="music-image">
          <img src="" alt="Music" />
        </div>
        <div className="music-stat-box" ref={scrollRef}>
          <div className="music-stat-item">
            <h3>7+</h3>
            <p>Years & Counting...</p>
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
