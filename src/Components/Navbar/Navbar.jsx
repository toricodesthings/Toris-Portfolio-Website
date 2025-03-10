import React from 'react'
import { Link } from 'react-router-dom';
import './Navbar.css'
import avatar from "../../assets/logo.png"

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="avatar-hovanimate">
        <div className="avatar-wrapper">
          <Link to="/">
            <img src={avatar} alt="Avatar" className="avatar" />
          </Link>
        </div>
      </div>

      <ul className="nav-menu">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/music">Music</Link></li>
        <li><Link to="/projects">Coding Projects</Link></li>
        <li><Link to="/about">About Me</Link></li>
        <li><Link to="/misc">Misc</Link></li>
      </ul>
      
      <div className = "nav-connect-wrapper">
        <Link to="/contact" className="nav-connect-link">
          <div className="nav-connect">Connect with Me!</div>
        </Link>
      </div>
    </div>
  )
}

export default Navbar