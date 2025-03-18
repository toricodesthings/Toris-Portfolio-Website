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

    // We'll define a single cubic Bézier that creates an S‑shaped trunk.
    // Adjusted control points for better trunk shape
    const trunkPoints = useMemo(() => {
        const p0 = { x: 50, y: 500 }; // base (unchanged)
        const p1 = { x: 20, y: 320 }; // control point 1 (higher)
        const p2 = { x: 80, y: 120 }; // control point 2 (higher)
        const p3 = { x: 50, y: 40 };  // top point (much higher)
        const path = `M${p0.x},${p0.y} C${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`;
        return { p0, p1, p2, p3, path };
    }, []);
    
    // Generate foliage with wider oval shape and slightly increased height
    const foliage = useMemo(() => {
        const centerX = trunkPoints.p3.x;
        const centerY = trunkPoints.p3.y; // Top of trunk
        
        // Different green shades for variation
        const greenShades = ["#2E8B57", "#3CB371", "#228B22", "#006400", "#32CD32"];
        
        // Create different foliage segments
        const segments = [];
        
        // Main wide oval shape - with slightly increased height
        segments.push({
            pathData: `M${centerX-5},${centerY-35} 
                      Q${centerX-120},${centerY-60} ${centerX-150},${centerY-5} 
                      Q${centerX-160},${centerY+20} ${centerX-130},${centerY+40} 
                      Q${centerX-80},${centerY+60} ${centerX-5},${centerY+40} 
                      Q${centerX+70},${centerY+60} ${centerX+130},${centerY+40} 
                      Q${centerX+160},${centerY+20} ${centerX+150},${centerY-5} 
                      Q${centerX+120},${centerY-60} ${centerX-5},${centerY-35} Z`,
            fill: greenShades[0],
            delay: 2
        });
        
        // Left side cluster - extended outward with slightly increased height
        segments.push({
            pathData: `M${centerX-60},${centerY-25} 
                      Q${centerX-130},${centerY-40} ${centerX-170},${centerY+5} 
                      Q${centerX-175},${centerY+25} ${centerX-140},${centerY+45} 
                      Q${centerX-100},${centerY+30} ${centerX-60},${centerY+15} 
                      Q${centerX-80},${centerY+0} ${centerX-60},${centerY-25} Z`,
            fill: greenShades[1],
            delay: 2.1
        });
        
        // Right side cluster - extended outward with slightly increased height
        segments.push({
            pathData: `M${centerX+60},${centerY-25} 
                      Q${centerX+130},${centerY-40} ${centerX+170},${centerY+5} 
                      Q${centerX+175},${centerY+25} ${centerX+140},${centerY+45} 
                      Q${centerX+100},${centerY+30} ${centerX+60},${centerY+15} 
                      Q${centerX+80},${centerY+0} ${centerX+60},${centerY-25} Z`,
            fill: greenShades[2],
            delay: 2.4
        });
        
        // Top oval segment - higher and wider
        segments.push({
            pathData: `M${centerX-5},${centerY-60} 
                      Q${centerX-90},${centerY-95} ${centerX-5},${centerY-20} 
                      Q${centerX+90},${centerY-95} ${centerX-5},${centerY-60} Z`,
            fill: greenShades[3],
            delay: 2.5
        });
        
        // Bottom segment - wider
        segments.push({
            pathData: `M${centerX-90},${centerY+30} 
                      Q${centerX-30},${centerY+70} ${centerX+0},${centerY+65} 
                      Q${centerX+30},${centerY+70} ${centerX+90},${centerY+30} 
                      Q${centerX+30},${centerY+25} ${centerX-30},${centerY+25} 
                      Q${centerX-90},${centerY+30} Z`,
            fill: greenShades[4],
            delay: 2.3
        });
        
        // Additional random smaller clusters for texture with slightly increased heights
        for (let i = 0; i < 75; i++) {
            const angle = (i / 15) * Math.PI * 2;
            const distance = 200 + Math.random() * 30; // Extended distance for dramatically wider canopy
            const size = 35 + Math.random() * 25;
            const offsetX = centerX + Math.cos(angle) * distance;
            const offsetY = centerY + Math.sin(angle) * (distance * 0.5); // Slightly flatter vertically for taller oval shape
            
            segments.push({
                pathData: `M${offsetX},${offsetY}
                          Q${offsetX-size},${offsetY-size/1.8} ${offsetX-size/2},${offsetY-size*1.1}
                          Q${offsetX+size/2},${offsetY-size*1.1} ${offsetX+size},${offsetY-size/1.8}
                          Q${offsetX+size*1.2},${offsetY+size/2} ${offsetX+size/2},${offsetY+size}
                          Q${offsetX-size/2},${offsetY+size*0.8} ${offsetX},${offsetY} Z`,
                fill: greenShades[i % greenShades.length],
                delay: 2.5 + (i * 0.05)
            });
        }
        
        return segments;
    }, [trunkPoints]);

    // Compute branch endpoints with better positioning and lowered to avoid foliage
    const branches = useMemo(() => {
        const { p0, p1, p2, p3 } = trunkPoints;
        
        return courses.map((course, index) => {
            // Move branches lower on the trunk to avoid foliage
            // Distribute over the bottom 70% of the trunk instead of full trunk
            const t = 0.05 + ((index + 0.75) / (courses.length + 1)) * 0.6;
            const trunkPoint = getCubicBezierPoint(t, p0, p1, p2, p3);
            
            // Determine side based on index
            const isLeftSide = index % 2 === 0;
            
            // Base angle depends on side (left/right)
            const baseAngle = isLeftSide ? -175 : 5;
            
            // Greater angle deviation for more randomness
            const angleDeviation = (Math.random() * 30) - 10;
            const branchAngleRad = ((baseAngle + angleDeviation) * Math.PI) / 180;
            
            // Better randomized branch lengths - avoid very short branches
            const minLength = 90;
            const maxLength = 220;
            const branchLength = minLength + Math.random() * (maxLength - minLength);
            
            // Calculate endpoint using trigonometry
            const endX = trunkPoint.x + branchLength * Math.cos(branchAngleRad);
            const endY = trunkPoint.y + branchLength * Math.sin(branchAngleRad);
            
            // Calculate text position with increased margin from branch endpoint
            // Increased distance from 35 to 50
            const textDistanceFromEnd = 60;
            const textAngleRad = branchAngleRad;
            const textX = endX + textDistanceFromEnd * Math.cos(textAngleRad);
            const textY = endY + textDistanceFromEnd * Math.sin(textAngleRad);
            
            return {
                course,
                trunkPoint: {x: trunkPoint.x, y: trunkPoint.y},
                startX: trunkPoint.x,
                startY: trunkPoint.y,
                endX,
                endY,
                textX,
                textY,
                isLeftSide,
                branchLength
            };
        });
    }, [courses, trunkPoints]);

    return (
        <div className="education-tree-container">
            {/* Adjusted viewBox to fit the entire tree without clipping */}
            <svg width="100%" height="600" viewBox="-250 -150 600 700">
                {/* Tree trunk */}
                <motion.path
                    d={trunkPoints.path}
                    fill="none"
                    stroke="#8B4513"
                    strokeWidth="50"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ 
                        duration: 1, 
                        ease: "easeInOut" 
                    }}
                />
                
                {/* Tree foliage - wider oval pattern with slightly increased height */}
                {foliage.map((segment, i) => (
                    <motion.path
                        key={`foliage-${i}`}
                        d={segment.pathData}
                        fill={segment.fill}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                            duration: 0.5, 
                            delay: segment.delay,
                            ease: "backOut" 
                        }}
                    />
                ))}

                {/* Branches with randomized lengths */}
                {branches.map((branch, index) => (
                    <motion.line
                        key={`branch-${index}`}
                        x1={branch.startX}
                        y1={branch.startY}
                        x2={branch.startX}
                        y2={branch.startY}
                        stroke="#8B4513"
                        strokeWidth="16"
                        strokeLinecap="round"
                        initial={{ x2: branch.startX, y2: branch.startY }}
                        animate={{ x2: branch.endX, y2: branch.endY }}
                        transition={{ 
                            duration: 1, 
                            delay: 1 + index * 0.2,
                            ease: "easeOut" 
                        }}
                    />
                ))}

                {/* Course labels - positioned with increased margin from branch endpoints */}
                {branches.map((branch, index) => (
                    <motion.g key={`label-${index}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 2 + index * 0.2 }}
                    >
                        {/* Course label background with increased width to improve readability */}
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
                
                {/* Enhanced soil with dramatically wider base and 3D depth effects */}
                <motion.g
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    {/* Much wider soil base with shadows for depth */}
                    <ellipse
                        cx="50"
                        cy="520"
                        rx="250"
                        ry="30"
                        fill="#5D4037"
                    />
                    
                    {/* Soil middle layer for 3D effect */}
                    <ellipse
                        cx="50"
                        cy="510"
                        rx="180"
                        ry="25"
                        fill="#8B6914"
                    />
                    
                    {/* Soil top surface */}
                    <ellipse
                        cx="50"
                        cy="505"
                        rx="150"
                        ry="20"
                        fill="#A0522D"
                    />
                    
                    {/* Soil surface details and textures */}
                    <ellipse
                        cx="0"
                        cy="500"
                        rx="15"
                        ry="4"
                        fill="#704214"
                    />
                    <ellipse
                        cx="100"
                        cy="495"
                        rx="20"
                        ry="5"
                        fill="#704214"
                    />
                    <ellipse
                        cx="50"
                        cy="492"
                        rx="18"
                        ry="4"
                        fill="#704214"
                    />
                    <ellipse
                        cx="-80"
                        cy="499"
                        rx="12"
                        ry="3"
                        fill="#704214"
                    />
                    <ellipse
                        cx="160"
                        cy="498"
                        rx="18"
                        ry="4"
                        fill="#704214"
                    />
                </motion.g>
            </svg>
        </div>
    );
};

export default EducationTree;