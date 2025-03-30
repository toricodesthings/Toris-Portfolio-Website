import { Suspense, lazy, React } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Navbar from './Components/Navbar/Navbar';
import HamsterLoader from './Components/LoadingUI/HamsterLoader';
import Home from './Pages/Home';
import PulsatingStars from './Stars';

const MusicPage = lazy(() => import( './Pages/Music'));
const Projects = lazy(() => import('./Pages/CSProjects'));
const About = lazy(() => import('./Pages/About'));
const Misc = lazy(() => import('./Pages/Misc'));
const Contact = lazy(() => import('./Pages/Contact'));

const App = () => {
  return (
    <Router>
      <Analytics />
      <SpeedInsights />
      <div className="app">
        <PulsatingStars />
        <Navbar />
        <Suspense fallback={<div className='main-loading'>
                              <p>Loading...</p>
                              <HamsterLoader />
                              </div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/music" element={<MusicPage />} />
            <Route path="/musiclinks" element={<MusicPage />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/about" element={<About />} />
            <Route path="/misc" element={<Misc />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Suspense>
      </div>
    </Router>

  );
};

export default App;
