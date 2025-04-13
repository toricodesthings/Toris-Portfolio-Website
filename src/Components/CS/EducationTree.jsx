import React, { useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import "./CSMain.css";

import nextButton from "../../assets/cspage/next.svg";
import backButton from "../../assets/cspage/back.svg";

// Helper: evaluate a cubic Bézier at parameter t
function getCubicBezierPoint(t, p0, p1, p2, p3) {
  const x =
    Math.pow(1 - t, 3) * p0.x +
    3 * Math.pow(1 - t, 2) * t * p1.x +
    3 * (1 - t) * Math.pow(t, 2) * p2.x +
    Math.pow(t, 3) * p3.x;
  const y =
    Math.pow(1 - t, 3) * p0.y +
    3 * Math.pow(1 - t, 2) * t * p1.y +
    3 * (1 - t) * Math.pow(t, 2) * p2.y +
    Math.pow(t, 3) * p3.y;
  return { x, y };
}

const EducationTree = () => {
  const { ref, inView } = useInView({
    rootMargin: "0px 0px -10% 0px",
    triggerOnce: true,
    threshold: 0.3,
  });

  // Safari detection via user agent
  const isSafari =
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  const coursesList = [
    ["Comp 1405", "Comp 1406", "Comp 1805", "Math 1007", "Math 1104"],
    [
      "Comp 2401",
      "Comp 2402",
      "Math 2107",
      "Comp 2804",
      "Comp 2404",
      "Comp 2406",
    ],
    [
      "Comp 3000",
      "Comp 3004",
      "Comp 3005",
      "Comp 3804",
      "Comp 3007",
      "Comp 3008",
    ],
    ["Sysc 3003", "Comp 4004", "Comp 4905", "Comp 4106", "Comp 4111"],
  ];

  const [currentTreeIndex, setCurrentTreeIndex] = useState(0);
  const courses = coursesList[currentTreeIndex];

  // Define color variables for course labels
  const courseCompleteColor = "white";
  const courseIncompleteColor = "gray";

  const handlePrev = () => {
    setCurrentTreeIndex(
      (prev) => (prev - 1 + coursesList.length) % coursesList.length
    );
  };

  const handleNext = () => {
    setCurrentTreeIndex((prev) => (prev + 1) % coursesList.length);
  };

  // Define a cubic Bézier for an S‑shaped trunk.
  const trunkPoints = useMemo(() => {
    const p0 = { x: 50, y: 500 }; // base
    const p1 = { x: 20, y: 320 }; // control point 1
    const p2 = { x: 80, y: 120 }; // control point 2
    const p3 = { x: 50, y: 40 }; // top point
    const path = `M${p0.x},${p0.y} C${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`;
    return { p0, p1, p2, p3, path };
  }, []);

  const foliage = useMemo(() => {
    const centerX = trunkPoints.p3.x;
    const centerY = trunkPoints.p3.y;
    const sakuraFoliageShades = [
      "#FFC0CB",
      "#FFB6C1",
      "#FF69B4",
      "#C71585",
      "#8B008B",
    ];
    const segments = [];

    // Main central foliage - reduced vertical spread
    segments.push({
      pathData: `M${centerX - 5},${centerY - 50} C${centerX - 180},${centerY - 80} ${centerX - 220},${centerY + 40} ${centerX - 5},${centerY + 60} C${centerX + 200},${centerY + 40} ${centerX + 170},${centerY - 80} ${centerX - 5},${centerY - 50} Z`,
      fill: sakuraFoliageShades[0],
      delay: 1,
    });

    // Left foliage cluster - adjusted height
    segments.push({
      pathData: `M${centerX - 100},${centerY - 40} Q${centerX - 190},${centerY - 70} ${centerX - 250},${centerY + 10} Q${centerX - 260},${centerY + 30} ${centerX - 210},${centerY + 70} Q${centerX - 150},${centerY + 40} ${centerX - 100},${centerY + 10} Q${centerX - 120},${centerY - 20} ${centerX - 100},${centerY - 40} Z`,
      fill: sakuraFoliageShades[1],
      delay: 1.1,
    });

    // Right foliage cluster - made slightly smaller
    segments.push({
      pathData: `M${centerX + 90},${centerY - 35} Q${centerX + 170},${centerY - 65} ${centerX + 230},${centerY + 10} Q${centerX + 240},${centerY + 30} ${centerX + 190},${centerY + 65} Q${centerX + 130},${centerY + 35} ${centerX + 90},${centerY + 10} Q${centerX + 110},${centerY - 15} ${centerX + 90},${centerY - 35} Z`,
      fill: sakuraFoliageShades[2],
      delay: 1.4,
    });

    segments.push({
      pathData: `M${centerX - 5},${centerY - 80} Q${centerX - 130},${centerY - 140} ${centerX - 5},${centerY - 30} Q${centerX + 130},${centerY - 140} ${centerX - 5},${centerY - 80} Z`,
      fill: sakuraFoliageShades[3],
      delay: 1.5,
    });

    segments.push({
      pathData: `M${centerX - 130},${centerY + 50} Q${centerX - 70},${centerY + 100} ${centerX + 0},${centerY + 90} Q${centerX + 70},${centerY + 100} ${centerX + 130},${centerY + 50} Q${centerX + 70},${centerY + 45} ${centerX - 70},${centerY + 45} Q${centerX - 130},${centerY + 50} Z`,
      fill: sakuraFoliageShades[4],
      delay: 1.3,
    });

    for (let i = 0; i < 15; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const distance = 200 + Math.random() * 50;  // Reduced max distance
      const size = 50 + Math.random() * 35;
      const offsetX = centerX + Math.cos(angle) * distance;
      const offsetY = centerY + Math.sin(angle) * (distance * 0.5);  // Reduced vertical spread
      segments.push({
        // Fix path data by removing newlines and extra spaces
        pathData: `M${offsetX},${offsetY} Q${offsetX - size},${offsetY - size / 1.8} ${offsetX - size / 2},${offsetY - size} Q${offsetX + size / 2},${offsetY - size} ${offsetX + size},${offsetY - size / 1.8} Q${offsetX + size},${offsetY + size / 2} ${offsetX + size / 2},${offsetY + size} Q${offsetX - size / 2},${offsetY + size} ${offsetX},${offsetY} Z`,
        fill: sakuraFoliageShades[i % sakuraFoliageShades.length],
        delay: 1.5 + i * 0.08,
      });
    }
    return segments;
  }, [trunkPoints]);

  const branches = useMemo(() => {
    let branchesArr = courses.map((course, index) => {
      const { p0, p1, p2, p3 } = trunkPoints;
      const t = 0.03 + ((index + 0.75) / (courses.length + 1)) * 0.55;
      const trunkPoint = getCubicBezierPoint(t, p0, p1, p2, p3);
      const isLeftSide = index % 2 === 0;
      const baseAngle = isLeftSide ? -175 : 5;
      const angleDeviation = Math.random() * 20 - 10;
      const branchAngleRad = ((baseAngle + angleDeviation) * Math.PI) / 180;
      const minLength = 100;
      const maxLength = 190;
      const branchLength = minLength + Math.random() * (maxLength - minLength);
      const endX = trunkPoint.x + branchLength * Math.cos(branchAngleRad);
      const endY = trunkPoint.y + branchLength * Math.sin(branchAngleRad);
      const textDistanceFromEnd = 80;
      const textX = endX + textDistanceFromEnd * Math.cos(branchAngleRad);
      const textY = endY + textDistanceFromEnd * Math.sin(branchAngleRad);
      const midX = (trunkPoint.x + endX) / 2;
      const midY = (trunkPoint.y + endY) / 2;
      const dx = endX - trunkPoint.x;
      const dy = endY - trunkPoint.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      const curvatureFactor = 0.15;
      const offset = curvatureFactor * length;
      const normX = -dy / length;
      const normY = dx / length;
      const sign = isLeftSide ? -1 : 1;
      const controlX = midX + sign * offset * normX;
      const controlY = midY + sign * offset * normY;
      const pathData = `M${trunkPoint.x},${trunkPoint.y} Q${controlX},${controlY} ${endX},${endY}`;
      
   
      const completed = currentTreeIndex === 0 ? true : false;

      return {
        course,
        trunkPoint: { x: trunkPoint.x, y: trunkPoint.y },
        startX: trunkPoint.x,
        startY: trunkPoint.y,
        endX,
        endY,
        textX,
        textY,
        isLeftSide,
        branchLength,
        pathData,
        completed,
      };
    });

    const minSpacing = 40;
    const adjustLabels = (arr) => {
      const sorted = [...arr].sort((a, b) => a.textY - b.textY);
      for (let i = 1; i < sorted.length; i++) {
        if (sorted[i].textY - sorted[i - 1].textY < minSpacing) {
          sorted[i].textY = sorted[i - 1].textY + minSpacing;
        }
      }
      return sorted;
    };

    const leftBranches = adjustLabels(branchesArr.filter((b) => b.isLeftSide));
    const rightBranches = adjustLabels(branchesArr.filter((b) => !b.isLeftSide));
    const adjustMap = {};
    leftBranches.concat(rightBranches).forEach((b) => {
      adjustMap[b.course] = b.textY;
    });
    branchesArr = branchesArr.map((b) => ({
      ...b,
      textY: adjustMap[b.course],
    }));

    return branchesArr;
  }, [courses, trunkPoints, currentTreeIndex]);

  return (
    <div
      className="education-tree-container"
      ref={ref}
      style={{ 
        transform: 'translate3d(0,0,0)',
        willChange: 'transform'
      }}
    >
      <h3>Year {currentTreeIndex + 1}</h3>

      <svg
        className="sakura"
        key={currentTreeIndex}
        width="100%"
        height="750"
        viewBox="-300 -175 700 750"
        style={{ 
          willChange: 'transform',
          transformBox: 'fill-box',
          backfaceVisibility: 'hidden'
        }}
      >
        <defs>
          {/* Disable or simplify drop shadow for Safari */}
          {!isSafari && (
            <filter id="dropShadow" x="0" y="-10%" width="110%" height="110%">
              <feGaussianBlur
                in="SourceAlpha"
                stdDeviation="2"
                result="blur"
              />
              <feOffset in="blur" dx="2" dy="2" result="offsetBlur" />
              <feMerge>
                <feMergeNode in="offsetBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          )}
        </defs>
        <g filter={!isSafari ? "url(#dropShadow)" : undefined}>
          <motion.path
            d={trunkPoints.path}
            fill="none"
            stroke="#954535"
            strokeWidth="60"
            strokeLinecap="round"
            initial={{ pathLength: 0.1, opacity: 0 }}
            animate={
              inView
                ? { opacity: 1, pathLength: 1 }
                : { opacity: 0, pathLength: 0.1 }
            }
            transition={{ duration: 0.75, ease: "easeInOut", delay: 0.3 }}
          />

          {/* Curved branches */}
          {branches.map((branch, index) => (
            <motion.path
              key={`branch-${index}`}
              style={{
                transformBox: 'fill-box',
              }}
              d={branch.pathData}
              fill="none"
              stroke="#954535"
              strokeWidth="20"
              strokeLinecap="round"
              initial={{ opacity: 0, pathLength: 0.1 }}
              animate={
                inView
                  ? { opacity: 1, pathLength: 1 }
                  : { opacity: 0, pathLength: 0.1 }
              }
              transition={{
                duration: 0.75,
                delay: 1 + index * 0.2,
                ease: "easeOut",
              }}
            />
          ))}

          {/* Tree foliage */}
          {foliage.map((segment, i) => (
            <motion.path
              key={`foliage-${i}`}
              style={{
                transformBox: 'fill-box',
              }}
              d={segment.pathData}
              fill={segment.fill}
              initial={{ opacity: 0, scale: 0.1 }}
              animate={
                inView
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.1 }
              }
              transition={{
                duration: 0.5,
                delay: segment.delay,
                ease: "backOut",
              }}
            />
          ))}

          {/* Course labels */}
          {branches.map((branch, index) => (
            <motion.g
              key={`label-${index}`}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.3, delay: 2 + index * 0.2 }}
            >
              <text
                className="course-label-text"
                fill={
                  branch.completed
                    ? courseCompleteColor
                    : courseIncompleteColor
                }
                x={branch.textX}
                y={branch.textY + 5}
                textAnchor="middle"
              >
                {branch.course}
              </text>
            </motion.g>
          ))}

          {/* Soil at the base */}
          <motion.g>
            <ellipse cx="50" cy="520" rx="250" ry="30" fill="rgb(90, 30, 20)" />
            <ellipse cx="50" cy="510" rx="180" ry="25" fill="rgb(140, 60, 30)" />
            <ellipse cx="50" cy="505" rx="150" ry="20" fill="rgb(130, 70, 40)" />
            <ellipse cx="0" cy="500" rx="15" ry="4" fill="rgb(155, 80, 95)" />
            <ellipse cx="100" cy="495" rx="20" ry="5" fill="rgb(135, 65, 140)" />
            <ellipse cx="50" cy="492" rx="18" ry="4" fill="rgb(125, 55, 100)" />
            <ellipse cx="-80" cy="499" rx="12" ry="3" fill="rgb(115, 45, 80)" />
            <ellipse cx="160" cy="498" rx="18" ry="4" fill="rgb(115, 20, 70)" />
          </motion.g>
        </g>
      </svg>
      <div className="arrow-button-container">
        <button className="arrow-button left" onClick={handlePrev}>
          <img src={backButton} style={{ filter: "invert(1)" }} alt="Previous" />
        </button>
        <button className="arrow-button right" onClick={handleNext}>
          <img src={nextButton} style={{ filter: "invert(1)" }} alt="Next" />
        </button>
      </div>
    </div>
  );
};

export default React.memo(EducationTree);
