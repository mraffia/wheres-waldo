import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';
import GameCard from './GameCard.js';

function HomePage({ levels, handlePickLevel }) {
  return (
    <div className="home-container">
      <h1>Choose A Level:</h1>
      <div className="home-subcontainer">
        {levels.map((level, i) => {
          return (
            <div key={i}>
              <Link to="/game" className="game-link">
                <GameCard level={level} handlePickLevel={handlePickLevel} />
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  );
}

export default HomePage;