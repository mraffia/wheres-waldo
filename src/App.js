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

const firebaseAppConfig = getFirebaseConfig();
const app = initializeApp(firebaseAppConfig);

function App() {
  const [levels, setLevels] = useState([
    { difficulty: "Easy", characters: [
      { name: "Waldo", image: Waldo }
    ]},
    { difficulty: "Medium", characters: [
      { name: "Waldo", image: Waldo },
      { name: "Odlaw", image: Odlaw }
    ]},
    { difficulty: "Hard", characters: [
      { name: "Waldo", image: Waldo },
      { name: "Odlaw", image: Odlaw },
      { name: "Wenda", image: Wenda },
      { name: "Wizard", image: Wizard }
    ]},
  ]);
  const [gameLevel, setGameLevel] = useState('');

  function handlePickLevel(difficulty) {
    setGameLevel(difficulty);
  }

  return (
    <BrowserRouter>
      <div className="container">
        <Nav />

        <div className="content">
          <Routes>
            <Route path="/" element={<HomePage levels={levels} handlePickLevel={handlePickLevel} />} />
            {/* <Route path="/game" element={<GamePage gameLevel={gameLevel} />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} /> */}
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
