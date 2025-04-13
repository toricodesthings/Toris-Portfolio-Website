import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim"; 
import { useLocation } from "react-router-dom";

const PulsatingStars = () => {
  const [init, setInit] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false); 
  const location = useLocation();
  const isHome = location.pathname === "/";
  const particlesContainerRef = useRef(null);

  useEffect(() => {

    const mediaQuery = window.matchMedia('(min-width: 768px)');
    setShouldRender(mediaQuery.matches || isHome);

  }, [isHome]);

  // Simplified fade-in effect 
  useEffect(() => {
    if (shouldRender) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [shouldRender]);

  useEffect(() => {
    let isMounted = true;
    
    if (!init && shouldRender) {
      initParticlesEngine(async (engine) => {
        await loadSlim(engine);
      })
        .then(() => {
          if (isMounted) {
            setInit(true);
          }
        })
        .catch((err) => {
          console.error("Failed to initialize particles engine:", err);
        });
    }
    
    return () => {
      isMounted = false;
      if (particlesContainerRef.current) {
        particlesContainerRef.current.destroy();
      }
    };
  }, [init, shouldRender]);

  const particlesLoaded = useCallback((container) => {
    particlesContainerRef.current = container;
    if (process.env.NODE_ENV === 'development') {
      console.log("Particles container loaded:", container);
    }
  }, []);

  const options = useMemo(() => {
    const baseOptions = {
      particles: {
        color: {
          value: ["#ffffff", "#ffecd3", "#dafff7", "#d4f2ff"],
        },
        links: {
          enable: false,
        },
        shape: {
          type: "circle",
        },
        detectRetina: true,
      }
    };

    if (isHome) {
      return {
        ...baseOptions,
        particles: {
          ...baseOptions.particles,
          move: {
            direction: "none",
            enable: true,
            random: true,
            speed: 0.5,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 1000,
            },
            value: 100,
            limit: 200,
          },
          opacity: {
            value: 0.4,
            animation: {
              enable: true,
              speed: 1,
              minimumValue: 0.2,
              sync: false,
            },
          },
          size: {
            value: { min: 0.5, max: 2.5 },
            animation: {
              enable: true,
              speed: 0.7,
              minimumValue: 0.5,
              sync: false,
            },
          },
          twinkle: {
            particles: {
              enable: true,
              color: "#ffffff",
              frequency: 0.5,
              opacity: 0.4,
            },
          },
        },
      };
    } 
    
    return {
      ...baseOptions,
      particles: {
        ...baseOptions.particles,
        move: {
          enable: false,
        },
        number: {
          density: {
            enable: true,
            area: 1000,
          },
          value: 30,
          limit: 35,
        },
        opacity: {
          value: 0.25,
        },
        size: {
          value: { min: 0.5, max: 2 },
        },
        twinkle: {
          particles: {
            enable: false,
          },
        },
      },
    };
  }, [isHome]);

  if (!init || !shouldRender) {
    return null;
  }

  return (
    <div className={`${isVisible ? 'stars-fade-in' : ''}`}>
      <Particles
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        options={options}
      />
    </div>
  );
}

export default React.memo(PulsatingStars);