import React from 'react';
import { Link } from 'react-router-dom';
import { Rings } from 'react-loader-spinner';
import '../styles/HomePage.css';
import GameCard from './GameCard.js';

function HomePage({ levels, handlePickLevel, isLoading, isError }) {
  return (
    <div className="home-container">
      <h1>Choose A Level:</h1>
      {isError && <div className="error-message">Something went wrong ...</div>}
      {isLoading ? (
        <Rings
          height="100"
          width="100"
          color="rgba(17, 45, 78, 1)"
          radius="1"
          wrapperStyle={{}}
          wrapperClass=""
          visible={true}
          ariaLabel="rings-loading"
        />
      ) : (
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
      )}
    </div>
  );
}

export default HomePage;