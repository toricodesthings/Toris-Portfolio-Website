import { Suspense, lazy, React, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Navbar from './Components/Navbar/Navbar';
import HamsterLoader from './Components/LoadingUI/HamsterLoader';
import { useAnimationStore } from './store/animationStore';

const Home = lazy(() => import('./Pages/Home'));
const MusicPage = lazy(() => import('./Pages/Music'));
const Projects = lazy(() => import('./Pages/CSProjects'));
const About = lazy(() => import('./Pages/About'));
const Misc = lazy(() => import('./Pages/Misc'));
const Contact = lazy(() => import('./Pages/Contact'));
const PulsatingStars = lazy(() => import('./Stars'));

const RouteHandler = () => {
  const location = useLocation();
  const [prevPath, setPrevPath] = useState(location.pathname);

  useEffect(() => {
    const body = document.body;

    // Don't animate on mobile
    if (window.innerWidth <= 768) return;

    // Pause grid on non-home pages
    if (location.pathname !== '/') {
      body.classList.add('pause-grid');
    } else {
      body.classList.remove('pause-grid');
    }

    setPrevPath(location.pathname);
  }, [location, prevPath]);

  return null;
};

const AppContent = () => {
  const [isNavbarActive, setIsNavbarActive] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { hasTypingAnimationPlayed } = useAnimationStore();

  const handleNavbarStateChange = (isActive) => {
    setIsNavbarActive(isActive);
  };

  // Determine when to show stars based on location:
  // - On home page: only after typing animation completes
  // - On other pages: immediately
  const shouldShowStars = isHome ? hasTypingAnimationPlayed : true;

  return (
    <div className={`app ${isNavbarActive ? 'navbar-active' : ''}`}>
      <RouteHandler />
      {shouldShowStars && (
        <Suspense fallback={null}>
          <PulsatingStars />
        </Suspense>
      )}
      <Navbar onNavStateChange={handleNavbarStateChange} />
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
  );
};

const App = () => {
  return (
    <Router>
      <Analytics />
      <SpeedInsights />
      <AppContent />
    </Router>
  );
};

export default App;
