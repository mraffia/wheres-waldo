import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Popup from 'reactjs-popup';
import { Rings } from 'react-loader-spinner';
import 'reactjs-popup/dist/index.css';
import '../styles/GamePage.css';

function GamePage({ level, handleSubmitToLeaderboard, isLoading, isError }) {
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
  const [foundAll, setFoundAll] = useState(false);
  const [time, setTime] = useState(0);
  const [playerName, setPlayerName] = useState('Anonymous');

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

  function handleNameChange(e) {
    setPlayerName(e.target.value);
  }

  function checkIfFoundAll(foundStatusLevel) {
    if (Object.values(foundStatusLevel).every((value) => value === true)) {
      setFoundAll(true);
    } else {
      setFoundAll(false);
    }
  }

  useEffect(() => {
    checkIfFoundAll(foundStatus[level.difficulty])
    
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
  }, [foundStatus, level.difficulty, foundAll]);

  return (
    <div className="game-container">
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
        <div className="game-subcontainer">
          <div className="game-characters">
            {level.characters.map((character, i) => {
              return (
                <div key={i} className="game-character-container" style={foundStatus[level.difficulty][character.name] ? { opacity: 0.3 } : { opacity: 1 }}>
                  <img className="game-character-image" src={character.imageUrl} alt={character.name} />
                  <div className="game-character-name"><strong>{character.name}</strong></div>
                </div>
              )
            })}
          </div>
          <div className="game-image-container">
            <div className="game-image-subcontainer">
              <img className="game-image" src={level.imageUrl} alt={level.difficulty} onClick={(e) => handleClickDropdownAppear(e)} />
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
                      <img className="dropdown-character-image" src={character.imageUrl} alt={character.name} />
                      <div className="dropdown-character-name"><strong>{character.name}</strong></div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
      <Popup
        open={foundAll}
        modal
        closeOnDocumentClick={false}
        closeOnEscape={false}
      >
        <div className="modal">
          <div className="header"><strong>You finished in { Math.floor((time / 1000)) + "." + ((time / 10) % 100) + " seconds!"}</strong></div>
          <div className="content">
            Enter your name to save your score on the leaderboard.
          </div>
          <div className="actions">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" className="input" placeholder="Your name/alias" onChange={(e) => handleNameChange(e)}></input>
            <div className="button-container">
              <Link to="/leaderboard">
                <button className="button btn-submit" onClick={() => handleSubmitToLeaderboard(playerName, time, level.difficulty)}>Submit score</button>
              </Link>
              <Link to="/">
                <button className="button btn-danger">Cancel</button>
              </Link>
            </div>
          </div>
        </div>
      </Popup>
    </div>
  );
}

export default GamePage;