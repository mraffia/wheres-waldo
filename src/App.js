import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { getFirebaseConfig } from './firebase-config.js';
import Nav from './components/Nav.js';
import HomePage from './components/HomePage.js';
import GamePage from './components/GamePage.js';
import LeaderboardPage from './components/LeaderboardPage.js';
import './App.css';
import Waldo from './images/waldo.jpg';
import Odlaw from './images/odlaw.jpg';
import Wenda from './images/wenda.jpeg';
import Wizard from './images/wizard.jpeg';
import Easy from './images/easyCropped.jpg';
import Medium from './images/mediumCropped.jpg';
import Hard from './images/hardCropped.jpg';

const firebaseApp = initializeApp(getFirebaseConfig());
const db = getFirestore(firebaseApp);

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
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
    saveLeaderboardData(playerName, time, level);

    (async () => {
      setIsLoading(true);

      const leaderboardData = await getLeaderboard(db);
      setLeaderboard(leaderboardData);

      setIsLoading(false);
    })();
  }

  // Saves a new leaderboard data to Cloud Firestore.
  async function saveLeaderboardData(playerName, time, level) {
    // Add a new leaderboard data entry to the Firebase database.
    try {
      await addDoc(collection(db, 'leaderboard'), {
        name: playerName,
        time: time,
        level: level,
      });
    }
    catch(error) {
      console.error('Error writing new leaderboard data to Firebase Database', error);
    }
  }

  // Get a list of all leaderboard data from database
  async function getLeaderboard(db) {
    const leaderboardQuery = query(collection(db, "leaderboard"), orderBy("time"));
    const leaderboardSnapshot = await getDocs(leaderboardQuery);
    const leaderboardList = leaderboardSnapshot.docs.map(doc => doc.data());
    return leaderboardList;
  }

  useEffect(() => {
    (async () => {
      setIsLoading(true);

      const leaderboardData = await getLeaderboard(db);
      setLeaderboard(leaderboardData);
      
      setIsLoading(false);
    })();
  }, []);

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
            <Route path="/leaderboard" element={<LeaderboardPage levels={levels} gameLevel={gameLevel} leaderboard={leaderboard} isLoading={isLoading}/>} />
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
