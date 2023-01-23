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
        { name: "Waldo", image: Waldo, found: false }
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
  const [leaderboard, setLeaderboard] = useState([]);

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

  function handleSubmitToLeaderboard(playerName, time, level) {
    let newLeaderboard = [...leaderboard];
    newLeaderboard.push({ name: playerName, time: time, level: level });

    setLeaderboard(newLeaderboard);
  }

  useEffect(() => {
    console.log(leaderboard);
  }, [leaderboard]);

  return (
    <BrowserRouter>
      <div className="container">
        <Nav />

        <div className="content">
          <Routes>
            <Route path="/" element={<HomePage levels={levels} handlePickLevel={handlePickLevel} />} />
            <Route path="/game" element={<GamePage level={getLevel(gameLevel)} handleSubmitToLeaderboard={handleSubmitToLeaderboard}/>} />
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
