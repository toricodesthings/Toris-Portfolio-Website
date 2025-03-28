import React, { useRef, useState, useEffect, useMemo } from 'react';
import { forceSimulation, forceCollide, forceX, forceY } from 'd3-force';
import './CSMain.css';

import pythonImg from "../../assets/skills/python.svg";
import javaImg from "../../assets/skills/java.svg";
import htmlImg from "../../assets/skills/html.svg";
import cssImg from "../../assets/skills/css.svg";
import jsImg from "../../assets/skills/javascript.svg";
import tsImg from "../../assets/skills/typescript.svg";
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
  { name: 'JavaScript', Logo: jsImg, proficiency: 6 },
  { name: 'TypeScript', Logo: tsImg, proficiency: 4 },
  { name: 'CSS', Logo: cssImg, proficiency: 8 },
  { name: 'Python', Logo: pythonImg, proficiency: 9 },
  { name: 'Java', Logo: javaImg, proficiency: 3 },
  { name: 'C#', Logo: csharpImg, proficiency: 2 },
  { name: 'Vite', Logo: viteImg, proficiency: 5 },
  { name: 'NodeJS', Logo: nodejsImg, proficiency: 7 },
  { name: 'HTML', Logo: htmlImg, proficiency: 10 },
  { name: 'Git', Logo: gitImg, proficiency: 7 },
  { name: 'MySQL', Logo: mysqlImg, proficiency: 3 },
  { name: 'GraphQL', Logo: gqlImg, proficiency: 2 },
  { name: 'Supabase', Logo: supabaseImg, proficiency: 8 },
  { name: 'Tensorflow', Logo: tensorflowImg, proficiency: 1 },
];

const TechStack = () => {
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 500 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const clientWidth = containerRef.current.clientWidth;
        const clientHeight = containerRef.current.clientWidth;
        const newHeight = clientWidth/clientHeight < 1 ? 800 : 600;
        setContainerSize({ width: clientWidth, height: newHeight });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  const baseScale = Math.min(containerSize.width / 800, containerSize.height / 600);
  const isPortrait = containerSize.width < containerSize.height;
  const minScale = 0.75; 
  const scaleFactor = Math.max(isPortrait ? baseScale * 0.75 : baseScale, minScale);

  const nodes = useMemo(() => {
    const padding = 20;

    const itemCount = techItems.length;
    const initialNodes = techItems.map((item, i) => {
      const imageSize = Math.max((35 + item.proficiency * 1) * scaleFactor, 50 * scaleFactor);
      const textSizePx = (16 + item.proficiency * 2) * scaleFactor;
      const textWidth = item.name.length * textSizePx * 0.7;
      const bubbleWidth = imageSize + textWidth;
      const bubbleHeight = imageSize;
      const targetY =
        padding +
        ((containerSize.height - padding * 2) * (i + 1)) / (itemCount + 1);
      return {
        ...item,
        imageSize,
        textSizePx,
        bubbleWidth,
        bubbleHeight,
        targetY,
        x: padding + Math.random() * (containerSize.width - bubbleWidth - padding),
        y: targetY,
        animDelay: Math.random() * 5,
        animDuration: 5 + Math.random() * 5,
      };
    });
  
    const aspectRatio = containerSize.width / containerSize.height;
    const collisionPadding = aspectRatio < 1 ? 10 : 20;
    const tickCount = aspectRatio < 1 ? 300 : 150;
    const forceXStrength = 0.02;
  
    const simulation = forceSimulation(initialNodes)
      .force(
        'x',
        forceX((d, i) =>
          ((containerSize.width - padding * 2) * (i + 0.5)) / (itemCount + 1)
        ).strength(forceXStrength)
      )
      .force(
        'y',
        aspectRatio < 1
          ?
            forceY(d => d.targetY).strength(1)
          : forceY(containerSize.height / 2).strength(0.5)
      )
      .force(
        'collide',
        forceCollide()
          .radius(d => Math.max(d.bubbleWidth, d.bubbleHeight) / 2 + collisionPadding)
          .iterations(15)
      )
      .stop();
  
    // Run simulation ticks and enforce boundaries.
    for (let i = 0; i < tickCount; i++) {
      simulation.tick();
      initialNodes.forEach(node => {
        node.x = Math.max(
          node.bubbleWidth / 2 + padding,
          Math.min(containerSize.width - node.bubbleWidth / 2 - padding, node.x)
        );
        node.y = Math.max(
          node.bubbleHeight / 2 + padding,
          Math.min(containerSize.height - node.bubbleHeight / 2 - padding, node.y)
        );
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
      <div className='bubble-group'>
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
                style={{ width: `${(50 + node.proficiency * 3) * scaleFactor}px` }}
              />
            </div>
            <span
              className="tech-name"
              style={{ fontSize: `${(1 + node.proficiency * 0.1) * scaleFactor}rem` }}
            >
              {node.name}
            </span>

          </div>
        </div>
      ))}
      </div>
    </div>
  );
};

export default React.memo(TechStack);
