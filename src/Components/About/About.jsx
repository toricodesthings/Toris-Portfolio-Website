import React, { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import "./About.css";
import LiveFeed from "./EducationLiveFeed";

import pythonImg from "../../assets/skills/python.svg";
import javaImg from "../../assets/skills/java.svg";
import htmlImg from "../../assets/skills/html.svg";
import cssImg from "../../assets/skills/css.svg";
import jsImg from "../../assets/skills/javascript.svg";
import tsImg from "../../assets/skills/typescript.svg";
import reactImg from "../../assets/skills/react.svg";
import nodejsImg from "../../assets/skills/nodejs.svg";
import gitImg from "../../assets/skills/git.svg";
import mysqlImg from "../../assets/skills/mysql.svg";
import viteImg from "../../assets/skills/vite.svg";
import csharpImg from "../../assets/skills/csharp.svg";
import gqlImg from "../../assets/skills/gql.svg";
import supabaseImg from "../../assets/skills/supabase.svg";
import tensorflowImg from "../../assets/skills/tensorflow.svg";
import dockerImg from "../../assets/skills/docker.svg";

import wrapped2023 from "../../assets/Wrapped2023.jpg";
import wrapped2024 from "../../assets/Wrapped2024.jpg";

const PROFILE_IMG = "/aboutpage/profile_img.webp";

const skills = [
  { name: "Python", img: pythonImg },
  { name: "Java", img: javaImg },
  { name: "HTML", img: htmlImg },
  { name: "CSS", img: cssImg },
  { name: "JavaScript", img: jsImg },
  { name: "TypeScript", img: tsImg },
  { name: "React", img: reactImg },
  { name: "Node.js", img: nodejsImg },
  { name: "Git/GitHub", img: gitImg },
  { name: "MySQL", img: mysqlImg },
  { name: "C#", img: csharpImg },
  { name: "Vite", img: viteImg },
  { name: "Supabase", img: supabaseImg },
  { name: "Tensorflow", img: tensorflowImg },
  { name: "GraphQL", img: gqlImg },
  { name: "Docker", img: dockerImg },
];

const About = () => {
  const [activeImage, setActiveImage] = useState(1);
  const statBoxRef = useRef(null);
  const isInView = useInView(statBoxRef);
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start({
        x: [0, -window.innerWidth * 0.1],
        transition: {
          duration: 2,
          ease: "linear",
          repeat: Infinity,
          repeatType: "reverse",
        },
      });
    } else {
      controls.stop();
    }
  }, [isInView, controls]);

  useEffect(() => {
    const initFadeInObserver = () => {
      const animatedElements = document.querySelectorAll(
        ".about-intro-left, .about-intro-right, " +
          ".cs-education, .cs-skills-panel, .education-panel, .skills-grid, " +
          ".music-para, .music-panel, .music-timeline, .music-flip, .music-stat-box"
      );

      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (entry.target.classList.contains("skills-grid")) {
                const skillItems = Array.from(
                  entry.target.querySelectorAll(".skill-text")
                );
                skillItems.forEach((item, index) => {
                  setTimeout(() => {
                    item.classList.add("visible");
                  }, index * 50);
                });
              } else if (entry.target.classList.contains("music-timeline")) {
                entry.target.classList.add("line-visible");
                const timelineItems = Array.from(
                  entry.target.querySelectorAll(".timeline-item")
                );
                timelineItems.forEach((item, index) => {
                  setTimeout(() => {
                    item.classList.add("visible");
                  }, 300 + index * 200);
                });
              } else if (entry.target.classList.contains("music-stat-box")) {
                const statItems = Array.from(
                  entry.target.querySelectorAll(".music-stat-item")
                );
                statItems.forEach((item, index) => {
                  setTimeout(() => {
                    item.classList.add("visible");
                  }, index * 100);
                });
              } else {
                setTimeout(() => {
                  entry.target.classList.add("visible");
                }, 50);
              }
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );

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

  return (
    <div className="about">
      <div className="about-title">
        <h1 className="pop-in">About me</h1>
      </div>

      <section className="intro-section">
        <div className="about-intro-left">
          <img src={PROFILE_IMG} alt="Profile" className="aboutprofileimg" />
        </div>
        <div className="about-intro-right">
          <div className="about-para">
            <h2>Who am I?</h2>
            <p>
              Many may know me as Tori. I am a passionate first-year Computer
              Science student in Ottawa dedicated to learning and growing in
              the field of technology. I also dedicate a ton of my free time
              into my side project in Music Production and Audio Engineering.
            </p>
          </div>
        </div>
      </section>

      <section className="cs-section">
        <div className="cs-education">
          <h2>Current Education</h2>
          <div className="education-panel">
            <p>
              Since I was young, I enjoyed experimenting and pushing tech to
              its limit. Currently, I am pursuing my first-year Bachelor’s in
              Computer Science at Carleton University in the software
              engineering stream, but my focus is quite general involving AI,
              programming, web development, and software development. One of my
              first projects started out as multi-purpose Discord bots built
              for specific servers. I am now branching it out to create general
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
              Aside from coding, I am a passionate and professional musician
              with a deep love for rhythm, melody, and sound design. Music has
              always been my escape, my therapy, and my way of understanding the
              world. My journey into music started over 7 years ago when I was
              first discovered Ableton and EDM Production. Now, I play many
              instruments, including the drums, bass guitar, and piano. I have
              worked on numerous projects as a producer, produced in all genres
              from Lofi to EDM to Pop to Metal, pushing creative boundaries to
              craft unique sounds. Additionally, I specialize in
              audio-engineering, mixing, and mastering, helping other artists
              bring their visions to life with polished and professional audio
              quality.
            </p>
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
        <h2 className="stats-current">Current Metrics</h2>
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
        <motion.div
          className="music-stat-box"
          ref={statBoxRef}
          animate={controls}
        >
          <div className="music-stat-item">
            <h3>7+</h3>
            <p>Years &amp; Counting</p>
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
        </motion.div>
      </section>
    </div>
  );
};

export default About;
