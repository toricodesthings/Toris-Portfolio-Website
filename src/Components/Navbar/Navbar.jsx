import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import avatar from "../../assets/logo.png";

const Navbar = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [navVisible, setNavVisible] = useState(!isMobile);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      const portrait = window.matchMedia('(orientation: portrait)').matches;
      const isMobileOrPortrait = mobile || portrait;
      setIsMobile(isMobileOrPortrait);
      setNavVisible(!isMobileOrPortrait);
    };
    

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleNav = () => {
    if (isMobile) {
      setNavVisible(!navVisible);
    }
  };

  return (
    <div className="navbar">
      {isMobile ? (
        <div className="avatar-hovanimate" onClick={toggleNav}>
          <div className="avatar-wrapper">
            <img src={avatar} alt="Avatar" className="avatar" />
          </div>
        </div>
      ) : (
        <div className="avatar-hovanimate">
          <div className="avatar-wrapper">
            <Link to="/">
              <img src={avatar} alt="Avatar" className="avatar" />
            </Link>
          </div>
        </div>
      )}

      <ul className={`nav-menu ${isMobile && navVisible ? "active" : ""}`}>
        <div className='pop-up'>
          <li><Link to="/">Home</Link></li>
        </div>
        <div className='pop-up'>
          <li><Link to="/projects">Programming</Link></li>
        </div>
        <div className='pop-up'>
          <li><Link to="/music">Music</Link></li>
        </div>
        <div className='pop-up'>
          <li><Link to="/about">About</Link></li>
        </div>
        <div className='pop-up'>
          <li><Link to="/misc">Projects</Link></li>
        </div>
      </ul>

      <div className={`nav-connect-wrapper ${isMobile && navVisible ? "active" : ""}`}>
        <Link to="/contact" className="nav-connect-link">
          <div className="nav-connect">Let's Connect!</div>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
