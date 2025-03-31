import React, { useEffect } from "react";
import "./Contact.css";
import ContactForm from "./Form";

import xImg from "../../assets/contact/xlogo.svg";
import githubImg from "../../assets/contact/githublogo.svg";
import linkedinImg from "../../assets/contact/linkedinlogo.svg";
import mailImg from "../../assets/contact/mail.svg";

const contactLinks = [
  { name: "X/Twitter", url: "https://x.com/shepysmusic", img: xImg },
  { name: "Github", url: "https://github.com/toricodesthings", img: githubImg },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/tori-sirak/", img: linkedinImg },
  { name: "Email", url: "mailto:pitoursirak26@gmail.com", img: mailImg },
];

const Contact = () => {
  useEffect(() => {
    const initFadeInObserver = () => {
      const animatedElements = document.querySelectorAll('h2, .link-container, .contact-form');
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // For social links, add a stagger based on their index:
            if (entry.target.classList.contains("link-container")) {
              const links = Array.from(document.querySelectorAll(".link-container"));
              const index = links.indexOf(entry.target);
              setTimeout(() => {
                entry.target.classList.add("visible");
              }, index * 200); 
            } else {
              entry.target.classList.add("visible");
            }
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      
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
    <div className="contact">
      <div className="contact-title">
        <h1 className="pop-in">Connect with me!</h1>
      </div>

      <section className="quicklinks-section">
        <div className="quick-links-panel">
          <h2>Quick Links</h2>
          <div className="quick-links-grid">
            {contactLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                className="link-container"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={link.img}
                  alt={link.name}
                  className={`link-icon ${link.invert ? "invert" : ""}`} />
                <span className="link-text">{link.name}</span>
                <span className="arrow-indicator">▲</span>
              </a>
            ))}
          </div>
          <h2>Or...</h2>
          <ContactForm />
        </div>
      </section>
    </div>
  );
};

export default Contact;
