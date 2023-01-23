import React from 'react';
import '../styles/GamePage.css';

function GamePage({ 
  level, 
  openCharacterDropdown, 
  cursorPosition, 
  handleClickDropdownAppear, 
  handleChooseCharacter,
}) {
  return (
    <div className="game-container">
        <div className="game-characters">
          {level.characters.map((character, i) => {
            return (
              <div key={i} className="game-character-container">
                <img className="game-character-image" src={character.image} alt={character.name} />
                <div className="game-character-name"><strong>{character.name}</strong></div>
              </div>
            )
          })}
        </div>
        <div className="game-image-container">
          <div className="game-image-subcontainer">
            <img className="game-image" src={level.image} alt={level.difficulty} onClick={(e) => handleClickDropdownAppear(e)} />
            {level.characters.map((character, i) => {
                return (
                  <div 
                    key={i} 
                    id={level.difficulty + "-" + character.name} 
                    className="game-image-character-area" 
                    onClick={(e) => handleClickDropdownAppear(e, character)}>
                  </div>
                )
              })}    
          </div>
          {openCharacterDropdown && (
            <div className="dropdown-characters" style={{left: cursorPosition.left + "px", top: cursorPosition.top + "px"}}>
              {level.characters.map((character, i) => {
                return (
                  <div key={i} className="dropdown-character-container" onClick={() => handleChooseCharacter(character)}>
                    <img className="dropdown-character-image" src={character.image} alt={character.name} />
                    <div className="dropdown-character-name"><strong>{character.name}</strong></div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
    </div>
  );
}

export default GamePage;