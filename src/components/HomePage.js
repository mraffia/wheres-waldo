import React from 'react';
import '../styles/HomePage.css';
import GameCard from './GameCard.js';

function HomePage({ levels, handlePickLevel }) {
  return (
    <div className="home-container">
      <div className="home-subcontainer">
        {
          levels.map((level, i) => {
            return (
              <div key={i}>
                <GameCard level={level} handlePickLevel={handlePickLevel} />
              </div>
            )
          })
        }
      </div>
    </div>
  );
}

export default HomePage;