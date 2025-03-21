import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Navbar from './Components/Navbar/Navbar';
import Home from './Pages/Home';
import MusicPage from './Pages/Music';
import Projects from './Pages/CSProjects';
import About from './Pages/About';
import Misc from './Pages/Misc';
import Contact from './Pages/Contact';

const App = () => {
  return (
    <Router>
      <Analytics />
      <SpeedInsights />
      <div className = "app">
        <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/music" element={<MusicPage />} />
            <Route path="/musiclinks" element={<MusicPage />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/about" element={<About />} />
            <Route path="/misc" element={<Misc />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
      </div>
    </Router>
  );
};

export default App;
