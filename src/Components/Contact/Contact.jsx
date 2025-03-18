import React, { useEffect } from "react";
import "./Contact.css";
import HamsterLoadingUI from "../LoadingUI/HamsterLoader";

import xImg from "../../assets/contact/xlogo.svg";
import githubImg from "../../assets/contact/githublogo.svg";
import linkedinImg from "../../assets/contact/linkedinlogo.svg";
import mailImg from "../../assets/contact/mail.svg";

const contactLinks = [
  { name: "X/Twitter", url: "https://x.com/shepysmusic", img: xImg },
  { name: "Github", url: "https://github.com/toricodesthings", img: githubImg },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/tori-sirak/", img: linkedinImg },
  { name: "Email", url: "mailto:pitoursirak@gmail.com", img: mailImg },
];

const Contact = () => {
  useEffect(() => {
    const initObserver = () => {
      // Select all elements that should animate:
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
      }, { threshold: 0.6 });
      
      animatedElements.forEach(el => observer.observe(el));
    };

    if (document.readyState === "complete") {
      initObserver();
    } else {
      window.addEventListener("load", initObserver);
      return () => window.removeEventListener("load", initObserver);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

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
                  className={`link-icon ${link.invert ? "invert" : ""}`}
                />
                <span className="link-text">{link.name}</span>
                <span className="arrow-indicator">▲</span>
              </a>
            ))}
          </div>
          <h2>Or...</h2>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <input type="text" name="name" placeholder="Your Name" required />
            </div>
            <div className="form-group">
              <input type="email" name="email" placeholder="Your Email" required />
            </div>
            <div className="form-group">
              <textarea name="message" placeholder="Your Message" rows="6" required></textarea>
            </div>
            <div className="contact-form-buttons">
              <button type="submit">Send Message</button>
              <button type="reset">Clear</button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Contact;
