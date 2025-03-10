import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react"
import Navbar from './Components/Navbar/Navbar';
import Home from './Pages/Home';
import MusicPage from './Pages/Music'; // renamed import to reflect its use as MusicPage
import Projects from './Pages/Projects';
import About from './Pages/About';
import Misc from './Pages/Misc';
import Contact from './Pages/Contact';

const App = () => {
  return (
    <Router>
      <div>
        <Analytics />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Both /music and /musiclinks will render MusicPage */}
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
