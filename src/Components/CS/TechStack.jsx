import React, { useRef, useState, useEffect, useMemo } from 'react';
import { forceSimulation, forceCollide, forceX, forceY, forceManyBody } from 'd3-force';
import './CSMain.css';

import pythonImg from "../../assets/skills/python.svg";
import javaImg from "../../assets/skills/java.svg";
import htmlImg from "../../assets/skills/html.svg";
import cssImg from "../../assets/skills/css.svg";
import jsImg from "../../assets/skills/javascript.svg";
import reactImg from "../../assets/skills/react.svg";
import nodejsImg from "../../assets/skills/nodejs.svg";
import gitImg from "../../assets/skills/git.svg";
import mysqlImg from "../../assets/skills/mysql.svg";
import viteImg from "../../assets/skills/vite.svg";
import csharpImg from "../../assets/skills/csharp.svg";
import gqlImg from "../../assets/skills/gql.svg";
import supabaseImg from "../../assets/skills/supabase.svg";
import tensorflowImg from "../../assets/skills/tensorflow.svg";

const techItems = [
  { name: 'React', Logo: reactImg, proficiency: 4 },
  { name: 'JavaScript', Logo: jsImg, proficiency: 5 },
  { name: 'CSS', Logo: cssImg, proficiency: 8 },
  { name: 'Python', Logo: pythonImg, proficiency: 9 },
  { name: 'Java', Logo: javaImg, proficiency: 3 },
  { name: 'C#', Logo: csharpImg, proficiency: 2 },
  { name: 'Vite', Logo: viteImg, proficiency: 5 },
  { name: 'NodeJS', Logo: nodejsImg, proficiency: 7 },
  { name: 'HTML', Logo: htmlImg, proficiency: 10 },
  { name: 'Git', Logo: gitImg, proficiency: 7 },
  { name: 'MySQL', Logo: mysqlImg, proficiency: 3 },
  { name: 'GraphQL', Logo: gqlImg, proficiency: 3 },
  { name: 'Supabase', Logo: supabaseImg, proficiency: 8 },
  { name: 'Tensorflow', Logo: tensorflowImg, proficiency: 1 },
];

const TechStack = () => {
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 500 });

  // Update container size on window resize.
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const clientWidth = containerRef.current.clientWidth;
        const newHeight = clientWidth < 768 ? 750 : 400;
        setContainerSize({ width: clientWidth, height: newHeight });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Compute node positions using a D3 force simulation.
  const nodes = useMemo(() => {
    const padding = 25;
    const itemCount = techItems.length;
    const initialNodes = techItems.map(item => {
      const imageSize = Math.max(40 + item.proficiency * 5, 70);
      const textSizePx = 16 + item.proficiency * 2.4;
      const textWidth = item.name.length * textSizePx * 0.6;
      const bubbleWidth = imageSize + textWidth;
      const bubbleHeight = imageSize;
      return {
        ...item,
        imageSize,
        textSizePx,
        bubbleWidth,
        bubbleHeight,
        // Random initial positions within the container.
        x: padding + Math.random() * (containerSize.width - bubbleWidth - padding),
        y: padding + Math.random() * (containerSize.height - bubbleHeight - padding),
        animDelay: Math.random() * 5,
        animDuration: 5 + Math.random() * 5,
      };
    });

    const aspectRatio = containerSize.width / containerSize.height;
    const collisionPadding = aspectRatio < 1 ? 40 : 20;
    // Increase tick count for taller containers if needed.
    const tickCount = aspectRatio < 1 ? 250 : 150;

    const simulation = forceSimulation(initialNodes)
      .force(
        'x',
        forceX((d, i) =>
          padding + ((containerSize.width - padding * 2) * (i + 1)) / (itemCount + 1)
        ).strength(0.01)
      )
      .force('y', forceY(containerSize.height / 2).strength(0.33))
      // Adjust collision force with dynamic padding.
      .force('collide', forceCollide().radius(d => Math.max(d.bubbleWidth, d.bubbleHeight) / 2 + collisionPadding).iterations(15))
      // Add a repulsive force to further separate nodes.
      .force('charge', forceManyBody().strength(-20))
      .stop();

    // Reset simulation alpha for consistency.
    simulation.alpha(1);

    // Run simulation ticks and enforce boundaries.
    for (let i = 0; i < tickCount; i++) {
      simulation.tick();
      initialNodes.forEach(node => {
        node.x = Math.max(node.bubbleWidth / 2 + padding, Math.min(containerSize.width - node.bubbleWidth / 2 - padding, node.x));
        node.y = Math.max(node.bubbleHeight / 2 + padding, Math.min(containerSize.height - node.bubbleHeight / 2 - padding, node.y));
      });
    }

    return initialNodes;
  }, [containerSize]);

  return (
    <div 
      className="stack-bubble-container" 
      ref={containerRef} 
      style={{ height: containerSize.height }}
    >
      {nodes.map((node, index) => (
        <div className="bubbles" key={index}>
          <div
            className="tech-bubble"
            style={{
              top: node.y - node.bubbleHeight / 2,
              left: node.x - node.bubbleWidth / 2,
              width: node.bubbleWidth,
              height: node.bubbleHeight,
              animationDelay: `${node.animDelay}s`,
              animationDuration: `${node.animDuration}s`,
            }}
          >
            <div className="tech-logo">
              <img
                src={node.Logo}
                alt={`${node.name} logo`}
                style={{ width: 40 + node.proficiency * 3 + "px" }}
              />
            </div>
            <span
              className="tech-name"
              style={{ fontSize: 1 + node.proficiency * 0.1 + "rem" }}
            >
              {node.name}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TechStack;
