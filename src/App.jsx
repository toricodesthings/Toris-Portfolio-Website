import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar'
import Home from './Pages/Home';
import Music from './Pages/Music';
import Projects from './Pages/Projects';
import About from './Pages/About';
import Misc from './Pages/Misc';

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/music" element={<Music />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/about" element={<About />} />
          <Route path="/misc" element={<Misc />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
