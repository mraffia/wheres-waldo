import React, { useRef, useState, useEffect } from 'react';
import '../styles/GamePage.css';

function GamePage({ level }) {
  const [openCharacterDropdown, setOpenCharacterDropdown] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ left: 0, top: 0 });
  const [activeAreas, setActiveAreas] = useState({
    Easy: { Waldo: false },
    Medium: { Odlaw: false },
    Hard: { Wenda: false, Wizard: false  },
  });
  const [foundStatus, setFoundStatus] = useState({
    Easy: { Waldo: false },
    Medium: { Odlaw: false },
    Hard: { Wenda: false, Wizard: false  },
  });
  const [time, setTime] = useState(0);
  const intervalRef = useRef();

  function handleClickDropdownAppear(e, character = null) {
    let newActiveAreas = {...activeAreas};
    Object.keys(newActiveAreas[level.difficulty]).forEach(value => newActiveAreas[level.difficulty][value] = false);
    setActiveAreas(newActiveAreas);

    if (character) {
      newActiveAreas[level.difficulty] = { ...newActiveAreas[level.difficulty], [character.name]: true }
      setActiveAreas(newActiveAreas);
    }

    setCursorPosition({ left: e.pageX, top: e.pageY });
    setOpenCharacterDropdown(!openCharacterDropdown);
  }

  function handleChooseCharacter(character, time) {
    if (activeAreas[level.difficulty][character.name] === true) {
      let newFoundStatus = {...foundStatus};
      newFoundStatus[level.difficulty][character.name] = true;

      setFoundStatus(newFoundStatus)
      setOpenCharacterDropdown(!openCharacterDropdown);

      console.log(time);
      console.log(`You've found ${character.name}!`);
    } else {
      setOpenCharacterDropdown(!openCharacterDropdown);

      console.log(`Whoops! That's not ${character.name}!`);
    }
  }

  function checkIfFoundAll(foundStatusLevel) {
    let foundAllStatus = false;

    for (const character in foundStatusLevel) {
      if (foundStatusLevel[character] === false) {
        foundAllStatus = false;
      } else {
        foundAllStatus = true;
      }
    }

    return foundAllStatus;
  }

  useEffect(() => {
    let foundAll = checkIfFoundAll(foundStatus[level.difficulty]);

    if (foundAll === false) {
      intervalRef.current = setInterval(() => {
        setTime((time) => time + 10);
      }, 10);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [foundStatus, level.difficulty]);

  return (
    <div className="game-container">
        <div>{time}</div>
        <div className="game-characters">
          {level.characters.map((character, i) => {
            return (
              <div key={i} className="game-character-container" style={foundStatus[level.difficulty][character.name] ? { opacity: 0.5 } : { opacity: 1 }}>
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
                  <div key={i} className="dropdown-character-container" onClick={() => { handleChooseCharacter(character, time) }}>
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