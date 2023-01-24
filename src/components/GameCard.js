import React from 'react';
import '../styles/GameCard.css';

function GameCard({ level, handlePickLevel }) {
  return (
    <div className="card-container" onClick={() => handlePickLevel(level.difficulty)}>
      <div className="card-image-container">
        <img className="card-image" src={level.imageUrl} alt={level.difficulty} />
      </div>
      <div className="card-info-container">
        <div className="card-difficulty">{level.difficulty}</div>
        <div className="card-characters">
          {level.characters.map((character, i) => {
            return <img key={i} className="card-character-image" src={character.imageUrl} alt={character.name} />
          })}
        </div>
      </div>
    </div>
  );
}

export default GameCard;