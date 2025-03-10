import React, { useState } from "react";
import "../Components/ForUnderConstructionPage/underconstruction.css";
import DinoGame from "../Components/ForUnderConstructionPage/DinoGame";

const Home = () => {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div className="home-container">
      {gameStarted ? (
        <DinoGame />
      ) : (
        <h1
          className="under-construction"
          onClick={() => setGameStarted(true)}
        >
          Hi there :P this page is Under Construction.
        </h1>
      )}
    </div>
  );
};

export default Home;
