import React, { useState, useEffect } from 'react';
import { Routes, Route, HashRouter } from "react-router-dom";
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
} from 'firebase/firestore';
import { getFirebaseConfig } from './firebase-config.js';
import Nav from './components/Nav.js';
import HomePage from './components/HomePage.js';
import GamePage from './components/GamePage.js';
import LeaderboardPage from './components/LeaderboardPage.js';
import './App.css';

const firebaseApp = initializeApp(getFirebaseConfig());
const db = getFirestore(firebaseApp);

function App() {
  const [levels, setLevels] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [gameLevel, setGameLevel] = useState(localStorage.getItem("current_level") ? localStorage.getItem("current_level") : 'Easy');
  const [defaultLevel, setDefaultLevel] = useState({
    difficulty: "Easy",
    imageUrl: "",
    characters: [
      { name: "Waldo", imageUrl: "" }
    ]
  })
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  function getLevel(gameLevel) {
    let level;
    for (let i = 0; i < levels.length; i++) {
      if (levels[i].difficulty === gameLevel) {
        level = levels[i];
      }
    }
    return level ? level : defaultLevel;
  }

  function handleCurrentLevel(difficulty) {
    localStorage.setItem("current_level", difficulty);
    setGameLevel(difficulty);
  }

  function handleSubmitToLeaderboard(playerName, time, level) {
    saveLeaderboardData(playerName, time, level);
    fetchLeaderboardData();
  }

  // Saves a new leaderboard data to Cloud Firestore.
  async function saveLeaderboardData(playerName, time, level) {
    // Add a new leaderboard data entry to the Firebase database.
    setIsError(false);

    try {
      await addDoc(collection(db, 'leaderboard'), {
        name: playerName,
        time: time,
        level: level,
        date: Date.now(),
      });
    }
    catch(error) {
      console.error('Error writing new leaderboard data to Firebase Database', error);
      setIsError(true);
    }
  }

  // Get a list of all leaderboard data from database
  async function getLeaderboard(db) {
    const leaderboardQuery = query(collection(db, "leaderboard"), orderBy("time"));
    const leaderboardSnapshot = await getDocs(leaderboardQuery);
    const leaderboardList = leaderboardSnapshot.docs.map(doc => doc.data());
    return leaderboardList;
  }

  // Get a list of all levels from database
  async function getLevels(db) {
    const levelsQuery = query(collection(db, "levels"));
    const levelsSnapshot = await getDocs(levelsQuery);
    const levelsList = levelsSnapshot.docs.map(doc => doc.data());
    return levelsList;
  }

  async function fetchLevelsData() {
    setIsError(false);
    setIsLoading(true);

    try {
      const levelsData = await getLevels(db);
      setLevels(levelsData);
    } catch (error) {
      console.error('Error fetching levels data from Firebase Database', error);
      setIsError(true);
    }

    setIsLoading(false);
  }

  async function fetchLeaderboardData() {
    setIsError(false);
    setIsLoading(true);

    try {
      const leaderboardData = await getLeaderboard(db);
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Error fetching leaderboard data from Firebase Database', error);
      setIsError(true);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    fetchLevelsData();
    fetchLeaderboardData();
  }, []);

  return (
    <HashRouter>
      <div className="container">
        <Nav />

        <div className="content">
          <Routes>
            <Route path="/" element={<HomePage levels={levels} handleCurrentLevel={handleCurrentLevel} isLoading={isLoading} isError={isError} />} />
            <Route path="/game" element={<GamePage level={getLevel(gameLevel)} handleSubmitToLeaderboard={handleSubmitToLeaderboard} isLoading={isLoading} isError={isError} />} />
            <Route path="/leaderboard" element={<LeaderboardPage levels={levels} gameLevel={gameLevel} leaderboard={leaderboard} isLoading={isLoading} isError={isError} />} />
          </Routes>
        </div>

        <div className="footer">
          By yours truly,&nbsp;<a href="https://github.com/mraffia"><strong>mraffia</strong></a>
        </div>
      </div>
    </HashRouter>
  );
}

export default App;
