import React, { useEffect, useMemo, useState, useCallback } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim"; 
import { useLocation } from "react-router-dom";

const PulsatingStars = () => {
  const [init, setInit] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    let isMounted = true;
    
    if (!init) {
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
    };
  }, [init]);

  const particlesLoaded = useCallback((container) => {
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
            value: 0.25,
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
              speed: 1,
              minimumValue: 0.5,
              sync: false,
            },
          },
          twinkle: {
            particles: {
              enable: true,
              color: "#ffffff",
              frequency: 0.8,
              opacity: 0.5,
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
          limit: 40,
        },
        opacity: {
          value: 0.2,
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

  if (!init) {
    return null;
  }

  return (
    <Particles
      id="tsparticles"
      particlesLoaded={particlesLoaded}
      options={options}
      className="fixed inset-0 -z-10"
    />
  );
}

export default React.memo(PulsatingStars);