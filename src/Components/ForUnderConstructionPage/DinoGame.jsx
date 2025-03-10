import React, { useEffect, useRef, useState } from "react";
import "./DinoGame.css";

const DinoGame = () => {
  const [isJumping, setIsJumping] = useState(false);
  const [cactusLeft, setCactusLeft] = useState(100);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(0.5);
  const dinoRef = useRef(null);

  // Handle jump logic on left click
  useEffect(() => {
    const handleJump = (event) => {
      if (event.button === 0 && !isJumping && !gameOver) { // Left click only
        setIsJumping(true);
        setTimeout(() => setIsJumping(false), 500);
      }
    };

    window.addEventListener("mousedown", handleJump);
    return () => window.removeEventListener("mousedown", handleJump);
  }, [isJumping, gameOver]);

  // Move cactus and increase speed gradually
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setCactusLeft((prev) => {
        if (prev <= -5) {
          setScore((prevScore) => {
            const newScore = prevScore + 1;
            if (newScore % 10 === 0) {
              setSpeed((prevSpeed) => Math.min(prevSpeed + 0.2, 4)); // Increase speed every 10 points
            }
            return newScore;
          });
          return 100; // Reset cactus position
        }
        return prev - speed;
      });
    }, 10);

    return () => clearInterval(interval);
  }, [gameOver, speed]);

  // Check for collision
  useEffect(() => {
    const checkCollision = setInterval(() => {
      if (cactusLeft < 20 && cactusLeft > 0 && !isJumping) {
        setGameOver(true);
      }
    }, 10);

    return () => clearInterval(checkCollision);
  }, [cactusLeft, isJumping]);

  // Restart game without reloading
  const restartGame = () => {
    setGameOver(false);
    setCactusLeft(100);
    setScore(0);
    setSpeed(0.5);
  };

  return (
    <div className="game-overlay" onClick={gameOver ? restartGame : undefined}>
      <div className="score">Score: {score}</div>
      {gameOver ? (
        <h1 className="game-over">Game Over! Left Click Anywhere to Restart</h1>
      ) : (
        <div className="game-container">
          <div ref={dinoRef} className={`dino ${isJumping ? "jump" : ""}`} />
          <div className="cactus" style={{ left: `${cactusLeft}%` }} />
        </div>
      )}
    </div>
  );
};

export default DinoGame;