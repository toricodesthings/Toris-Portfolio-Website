import React, { useMemo } from "react";
import { motion } from "framer-motion";

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
    // Feel free to replace these placeholders with your real courses
    const courses = ["Comp 1405", "Comp 1406", "Comp 1805", "Math 1007", "Math 1104"];

    // Define a cubic Bézier for an S‑shaped trunk.
    const trunkPoints = useMemo(() => {
        const p0 = { x: 50, y: 500 }; // base (unchanged)
        const p1 = { x: 20, y: 320 }; // control point 1 (higher)
        const p2 = { x: 80, y: 120 }; // control point 2 (higher)
        const p3 = { x: 50, y: 40 };  // top point (much higher)
        const path = `M${p0.x},${p0.y} C${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`;
        return { p0, p1, p2, p3, path };
    }, []);
    
    const foliage = useMemo(() => {
        const centerX = trunkPoints.p3.x;
        const centerY = trunkPoints.p3.y; // Top of trunk
    
        // Different green shades for variation
        const greenShades = ["#2E8B57", "#3CB371", "#228B22", "#006400", "#32CD32"];
    
        const segments = [];
    
        // Main wide, tall oval shape using two cubic Bézier curves
        segments.push({
            pathData: `
              M${centerX-5},${centerY-50}
              C${centerX-160},${centerY-80} ${centerX-190},${centerY+50} ${centerX-5},${centerY+60}
              C${centerX+180},${centerY+50} ${centerX+150},${centerY-80} ${centerX-5},${centerY-50} Z
            `,
            fill: greenShades[0],
            delay: 2
        });
    
        // Left side cluster - extended outward for extra width and height
        segments.push({
            pathData: `
              M${centerX-80},${centerY-40} 
              Q${centerX-150},${centerY-70} ${centerX-210},${centerY+10} 
              Q${centerX-220},${centerY+30} ${centerX-170},${centerY+70} 
              Q${centerX-110},${centerY+40} ${centerX-80},${centerY+10} 
              Q${centerX-100},${centerY-10} ${centerX-80},${centerY-40} Z
            `,
            fill: greenShades[1],
            delay: 2.1
        });
    
        // Right side cluster - extended outward for extra width and height
        segments.push({
            pathData: `
              M${centerX+80},${centerY-40} 
              Q${centerX+150},${centerY-70} ${centerX+210},${centerY+10} 
              Q${centerX+220},${centerY+30} ${centerX+170},${centerY+70} 
              Q${centerX+110},${centerY+40} ${centerX+80},${centerY-40} Z
            `,
            fill: greenShades[2],
            delay: 2.4
        });
    
        // Top oval segment for added height and extra fluffiness
        segments.push({
            pathData: `
              M${centerX-5},${centerY-80} 
              Q${centerX-110},${centerY-140} ${centerX-5},${centerY-30} 
              Q${centerX+110},${centerY-140} ${centerX-5},${centerY-80} Z
            `,
            fill: greenShades[3],
            delay: 2.5
        });
    
        // Bottom segment to widen the canopy
        segments.push({
            pathData: `
              M${centerX-110},${centerY+50} 
              Q${centerX-50},${centerY+110} ${centerX+0},${centerY+100} 
              Q${centerX+50},${centerY+110} ${centerX+110},${centerY+50} 
              Q${centerX+50},${centerY+45} ${centerX-50},${centerY+45} 
              Q${centerX-110},${centerY+50} Z
            `,
            fill: greenShades[4],
            delay: 2.3
        });
    
        // Additional random clusters for texture – larger and more spread out for extra fluff
        for (let i = 0; i < 45; i++) {
            const angle = (i / 15) * Math.PI * 2;
            const distance = 200 + Math.random() * 50; // Increased distance for wider spread
            const size = 35 + Math.random() * 25; // Increased size for a more robust appearance
            const offsetX = centerX + Math.cos(angle) * distance;
            const offsetY = centerY + Math.sin(angle) * (distance * 0.6); // Adjusted for taller fluff
    
            segments.push({
                pathData: `
                  M${offsetX},${offsetY}
                  Q${offsetX-size},${offsetY-size/1.8} ${offsetX-size/2},${offsetY-size*1.1}
                  Q${offsetX+size/2},${offsetY-size*1.1} ${offsetX+size},${offsetY-size/1.8}
                  Q${offsetX+size*1.2},${offsetY+size/2} ${offsetX+size/2},${offsetY+size}
                  Q${offsetX-size/2},${offsetY+size*0.8} ${offsetX},${offsetY} Z
                `,
                fill: greenShades[i % greenShades.length],
                delay: 2.5 + (i * 0.05)
            });
        }
    
        return segments;
    }, [trunkPoints]);

    // Compute branch endpoints and add curvature to the branch paths.
    const branches = useMemo(() => {
        // First, compute basic branch positions
        let branchesArr = courses.map((course, index) => {
            const { p0, p1, p2, p3 } = trunkPoints;
            // Place branches lower on the trunk to avoid foliage.
            const t = 0.03 + ((index + 0.75) / (courses.length + 1)) * 0.6;
            const trunkPoint = getCubicBezierPoint(t, p0, p1, p2, p3);
            
            // Determine side based on index
            const isLeftSide = index % 2 === 0;
            // Base angle for branch direction
            const baseAngle = isLeftSide ? -175 : 5;
            const angleDeviation = (Math.random() * 20) - 10;
            const branchAngleRad = ((baseAngle + angleDeviation) * Math.PI) / 180;
            
            // Increased branch length range for a wider spread
            const minLength = 100;
            const maxLength = 240;
            const branchLength = minLength + Math.random() * (maxLength - minLength);
            
            // Calculate branch endpoint using trigonometry
            const endX = trunkPoint.x + branchLength * Math.cos(branchAngleRad);
            const endY = trunkPoint.y + branchLength * Math.sin(branchAngleRad);
            
            // Increase text offset to keep text away from the branch
            const textDistanceFromEnd = 80;
            const textX = endX + textDistanceFromEnd * Math.cos(branchAngleRad);
            const textY = endY + textDistanceFromEnd * Math.sin(branchAngleRad);
            
            // Compute branch curvature using a quadratic Bézier curve:
            const midX = (trunkPoint.x + endX) / 2;
            const midY = (trunkPoint.y + endY) / 2;
            const dx = endX - trunkPoint.x;
            const dy = endY - trunkPoint.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const curvatureFactor = 0.1; // Adjust for subtle curvature
            const offset = curvatureFactor * length;
            const normX = -dy / length;
            const normY = dx / length;
            const sign = isLeftSide ? -1 : 1;
            const controlX = midX + sign * offset * normX;
            const controlY = midY + sign * offset * normY;
            const pathData = `M${trunkPoint.x},${trunkPoint.y} Q${controlX},${controlY} ${endX},${endY}`;
            
            return {
                course,
                trunkPoint: { x: trunkPoint.x, y: trunkPoint.y },
                startX: trunkPoint.x,
                startY: trunkPoint.y,
                endX,
                endY,
                textX,
                textY, // initial textY before adjustment
                isLeftSide,
                branchLength,
                pathData
            };
        });

        // Adjust text positions to avoid overlaps – process separately for left and right branches
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

        const leftBranches = adjustLabels(branchesArr.filter(b => b.isLeftSide));
        const rightBranches = adjustLabels(branchesArr.filter(b => !b.isLeftSide));

        const adjustMap = {};
        leftBranches.concat(rightBranches).forEach(b => {
            adjustMap[b.course] = b.textY;
        });
        branchesArr = branchesArr.map(b => ({
            ...b,
            textY: adjustMap[b.course]
        }));
        
        return branchesArr;
    }, [courses, trunkPoints]);

    return (
        <div className="education-tree-container">
            {/* Expanded viewBox to fit the wider tree */}
            <svg width="100%" height="600" viewBox="-300 -150 700 700">
                {/* Tree trunk */}
                <motion.path
                    d={trunkPoints.path}
                    fill="none"
                    stroke="#8B4513"
                    strokeWidth="60"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                />
            

                {/* Curved branches */}
                {branches.map((branch, index) => (
                    <motion.path
                        key={`branch-${index}`}
                        d={branch.pathData}
                        fill="none"
                        stroke="#8B4513"
                        strokeWidth="20"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, delay: 1 + index * 0.2, ease: "easeOut" }}
                    />
                ))}

                {/* Tree foliage */}
                {foliage.map((segment, i) => (
                    <motion.path
                        key={`foliage-${i}`}
                        d={segment.pathData}
                        fill={segment.fill}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: segment.delay, ease: "backOut" }}
                    />
                ))}

                {/* Course labels */}
                {branches.map((branch, index) => (
                    <motion.g key={`label-${index}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 2 + index * 0.2 }}
                    >
                        <rect
                            x={branch.textX - 45}
                            y={branch.textY - 15}
                            width="100"
                            height="20"
                            rx="10"
                            ry="10"
                        />
                        <text 
                            x={branch.textX} 
                            y={branch.textY + 5} 
                            textAnchor="middle" 
                            fontSize="24" 
                            fill="white"
                        >
                            {branch.course}
                        </text>
                    </motion.g>
                ))}
                
                {/* Enhanced soil with dramatic base */}
                <motion.g
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    <ellipse cx="50" cy="520" rx="250" ry="30" fill="#5D4037" />
                    <ellipse cx="50" cy="510" rx="180" ry="25" fill="#8B6914" />
                    <ellipse cx="50" cy="505" rx="150" ry="20" fill="#A0522D" />
                    <ellipse cx="0"  cy="500" rx="15" ry="4"  fill="#704214" />
                    <ellipse cx="100" cy="495" rx="20" ry="5"  fill="#704214" />
                    <ellipse cx="50" cy="492" rx="18" ry="4"  fill="#704214" />
                    <ellipse cx="-80" cy="499" rx="12" ry="3"  fill="#704214" />
                    <ellipse cx="160" cy="498" rx="18" ry="4"  fill="#704214" />
                </motion.g>
            </svg>
        </div>
    );
};

export default EducationTree;
