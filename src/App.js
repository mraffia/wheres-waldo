import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  setDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { getFirebaseConfig } from './firebase-config.js';
import './App.css';
import Nav from './components/Nav.js';
import HomePage from './components/HomePage.js';
import GamePage from './components/GamePage.js';
import LeaderboardPage from './components/LeaderboardPage.js';
import Waldo from './images/waldo.jpg';
import Odlaw from './images/odlaw.jpg';
import Wenda from './images/wenda.jpeg';
import Wizard from './images/wizard.jpeg';
import Easy from './images/easyCropped.jpg';
import Medium from './images/mediumCropped.jpg';
import Hard from './images/hardCropped.jpg';

const firebaseAppConfig = getFirebaseConfig();
const app = initializeApp(firebaseAppConfig);

function App() {
  const [levels, setLevels] = useState([
    { 
      difficulty: "Easy",
      image: Easy,
      characters: [
        { name: "Waldo", image: Waldo }
      ]
    },
    { 
      difficulty: "Medium",
      image: Medium,
      characters: [
        { name: "Odlaw", image: Odlaw }
      ]
    },
    { 
      difficulty: "Hard",
      image: Hard,
      characters: [
        { name: "Wenda", image: Wenda },
        { name: "Wizard", image: Wizard }
      ]
    },
  ]);
  const [gameLevel, setGameLevel] = useState('Easy');
  const [openCharacterDropdown, setOpenCharacterDropdown] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ left: 0, top: 0 });
  const [activeAreas, setActiveAreas] = useState({
    Easy: { Waldo: false },
    Medium: { Odlaw: false },
    Hard: { Wenda: false, Wizard: false  },
  });

  function getLevel(gameLevel) {
    let level;
    for (let i = 0; i < levels.length; i++) {
      if (levels[i].difficulty === gameLevel) {
        level = levels[i];
      }
    }
    return level;
  }

  function handlePickLevel(difficulty) {
    setGameLevel(difficulty);
  }

  function handleClickDropdownAppear(e, character = null) {
    let newActiveAreas = {...activeAreas};
    if (character) {
      newActiveAreas[gameLevel] = { ...newActiveAreas[gameLevel], [character.name]: true }
      setActiveAreas(newActiveAreas);
    } else {
      Object.keys(newActiveAreas[gameLevel]).forEach(v => newActiveAreas[gameLevel][v] = false);
      setActiveAreas(newActiveAreas);
    }

    setCursorPosition({ left: e.pageX, top: e.pageY });
    setOpenCharacterDropdown(!openCharacterDropdown);
  }

  function handleChooseCharacter(character) {
    if (activeAreas[gameLevel][character.name] === true) {
      console.log(`You've found ${character.name}!`);
      setOpenCharacterDropdown(!openCharacterDropdown);
    } else {
      console.log(`Whoops! That's not ${character.name}!`);
      setOpenCharacterDropdown(!openCharacterDropdown);
    }
  }

  return (
    <BrowserRouter>
      <div className="container">
        <Nav />

        <div className="content">
          <Routes>
            <Route path="/" element={<HomePage levels={levels} handlePickLevel={handlePickLevel} />} />
            <Route 
              path="/game" 
              element={
                <GamePage 
                  level={getLevel(gameLevel)} 
                  openCharacterDropdown={openCharacterDropdown}
                  cursorPosition={cursorPosition} 
                  handleClickDropdownAppear={handleClickDropdownAppear} 
                  handleChooseCharacter={handleChooseCharacter} 
                />
              } 
            />
            {/* <Route path="/leaderboard" element={<LeaderboardPage />} /> */}
          </Routes>
        </div>

        <div className="footer">
          By yours truly,&nbsp;<a href="https://github.com/mraffia"><strong>mraffia</strong></a>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
