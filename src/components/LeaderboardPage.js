import React, { useState, useEffect } from 'react';
import { Rings } from 'react-loader-spinner';
import '../styles/LeaderboardPage.css';

function LeaderboardPage({ levels, gameLevel, leaderboard, isLoading, isError }) {
  const [currentLevel, setCurrentLevel] = useState(gameLevel);

  function handleClickLeaderboardLevel(level) {
    setCurrentLevel(level);
  }

  return (
    <div className="leaderboard-container">
      <h1 className="leaderboard-title">Leaderboard</h1>
      <div className="leaderboard-levels">
        {levels.map((level, i) => {
          return (
            <button 
              key={i} 
              className={"button btn-level " + (currentLevel === level.difficulty ? "current" : "")}
              onClick={() => handleClickLeaderboardLevel(level.difficulty)} 
            >
              {level.difficulty}
            </button>
          )
        })}
      </div>
      <div className="leaderboard-table-container">
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
          <table className="leaderboard-table" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th style={{ width: "70%" }}>NAME</th>
                <th style={{ width: "30%" }}>TIME (SECONDS)</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(leaderboard).map((item, i) => {
                if (leaderboard[item].level === currentLevel) {
                  return (
                    <tr key={i}>
                      <td>{leaderboard[item].name}</td>
                      <td>{Math.floor((leaderboard[item].time / 1000)) + "." + ((leaderboard[item].time / 10) % 100)}</td>
                    </tr>
                  )
                }
                return '';
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default LeaderboardPage;