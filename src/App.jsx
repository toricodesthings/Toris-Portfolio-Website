import { Suspense, lazy, useEffect, React } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Navbar from './Components/Navbar/Navbar';
import HamsterLoader from './Components/LoadingUI/HamsterLoader';
import Home from './Pages/Home';

const MusicPage = lazy(() => import(/* webpackPrefetch: true */ './Pages/Music'));
const Projects = lazy(() => import(/* webpackPrefetch: true */'./Pages/CSProjects'));
const About = lazy(() => import('./Pages/About'));
const Misc = lazy(() => import('./Pages/Misc'));
const Contact = lazy(() => import('./Pages/Contact'));

const App = () => {
  useEffect(() => {
    import("@vercel/analytics/react").then(({ Analytics }) => Analytics());
    import("@vercel/speed-insights/react").then(({ SpeedInsights }) => SpeedInsights());
  }, []);
  
  return (
    <Router>
      <Analytics />
      <SpeedInsights />
      <div className="app">
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
