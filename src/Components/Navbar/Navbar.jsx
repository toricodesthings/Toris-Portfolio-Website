import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import avatar from "../../assets/logo.png";
import { ToriStatIndicator } from './statIndicator';

const Navbar = ({ onNavStateChange }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [navVisible, setNavVisible] = useState(!isMobile);
  const location = useLocation();

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

  useEffect(() => {
    if (isMobile) {
      onNavStateChange(navVisible);
    } else {
      onNavStateChange(false);
    }
  }, [navVisible, isMobile, onNavStateChange]);

  const toggleNav = () => {
    if (isMobile) {
      requestAnimationFrame(() => {
        setNavVisible(!navVisible);
      });
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <>
      {isMobile && <div className={`mobile-overlay ${navVisible ? "active" : ""}`} />}
      <div className={`navbar ${isMobile && navVisible ? "active" : ""}`}>
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
            <li className={isActive('/') ? 'active' : ''}><Link to="/" onClick={isMobile ? toggleNav : undefined}>Home</Link></li>
          </div>
          <div className='pop-up'>
            <li className={isActive('/projects') ? 'active' : ''}><Link to="/projects" onClick={isMobile ? toggleNav : undefined}>Programming</Link></li>
          </div>
          <div className='pop-up'>
            <li className={isActive('/music') ? 'active' : ''}><Link to="/music" onClick={isMobile ? toggleNav : undefined}>Music</Link></li>
          </div>
          <div className='pop-up'>
            <li className={isActive('/about') ? 'active' : ''}><Link to="/about" onClick={isMobile ? toggleNav : undefined}>About</Link></li>
          </div>
          <div className='pop-up'>
            <li className={isActive('/misc') ? 'active' : ''}><Link to="/misc" onClick={isMobile ? toggleNav : undefined}>WebApps</Link></li>
          </div>
        </ul>
          <div className={`nav-connect-wrapper ${isMobile && navVisible ? "active" : ""}`}>
            <Link to="/contact" className="nav-connect-link" onClick={isMobile ? toggleNav : undefined}>
              <div className="nav-connect">Let's Connect!</div>
            </Link>
            <ToriStatIndicator />
          </div>
        </div>
    </>
  );
};

export default React.memo(Navbar);
