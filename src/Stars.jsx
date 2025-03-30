import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";

export default function PulsatingStars() {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadFull(engine);
        }).then(() => {
            setInit(true);
            console.log("Particles engine initialized successfully");
        }).catch(err => {
            console.error("Failed to initialize particles engine:", err);
        });
    }, []);

    const particlesLoaded = (container) => {
        console.log("Particles container loaded:", container);
    };

    const options = useMemo(() => ({
        particles: {
            color: {
                value: ["#ffffff", "#ffecd3", "#dafff7", "#d4f2ff"],
            },
            links: {
                enable: false,
            },
            move: {
                direction: "none",
                enable: true,
                outModes: {
                    default: "bounce",
                },
                random: true,
                speed: 0.3,
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
                value: 0.2,
                animation: {
                    enable: true,
                    speed: 1,
                    minimumValue: 0.2,
                    sync: false
                }
            },
            shape: {
                type: "circle",
            },
            size: {
                value: { min: 0.5, max: 2 },
                animation: {
                    enable: true,
                    speed: 1,
                    minimumValue: 0.5,
                    sync: false
                }
            },
            twinkle: {
                particles: {
                    enable: true,
                    color: "#ffffff",
                    frequency: 0.9,
                    opacity: 0.4
                },
            }
        },
        detectRetina: true,
    }), []);

    if (init) {
        return (
            <Particles
                id="tsparticles"
                particlesLoaded={particlesLoaded}
                options={options}
            />
        );
    }
}