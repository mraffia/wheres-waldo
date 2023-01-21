import React from 'react';
import '../styles/GamePage.css';

function GamePage({ level }) {
  return (
    <div className="game-container">
        <div className="game-characters">
          {
            level.characters.map((character, i) => {
              return (
                <div key={i} className="game-character-container">
                  <img className="game-character-image" src={character.image} alt={character.name} />
                  <div className="game-character-name"><strong>{character.name}</strong></div>
                </div>
              )
            })
          }
        </div>
        <div className="game-image-container">
          <img className="game-image" src={level.image} alt={level.difficulty} />
        </div>
    </div>
  );
}

export default GamePage;