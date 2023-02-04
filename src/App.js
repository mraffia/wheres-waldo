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
          <a href="https://github.com/mraffia">
            <strong>mraffia</strong>
            &nbsp;
            <svg aria-hidden="true" className="octicon octicon-mark-github" height="16" width="16" version="1.1" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
            </svg> 
          </a>
        </div>
      </div>
    </HashRouter>
  );
}

export default App;
