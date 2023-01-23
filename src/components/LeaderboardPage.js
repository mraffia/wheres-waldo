import React, { useState, useEffect } from 'react';
import '../styles/LeaderboardPage.css';

function LeaderboardPage({ levels, gameLevel, leaderboard }) {
  const [currentLevel, setCurrentLevel] = useState(gameLevel);

  function handleClickLeaderboardLevel(level) {
    setCurrentLevel(level);
  }

  useEffect(() => {
    console.log(currentLevel);
  })

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
        <table className="leaderboard-table" style={{ width: "100%" }}>
          <tr>
            <th style={{ width: "70%" }}>Name</th>
            <th style={{ width: "30%" }}>Time (seconds)</th>
          </tr>
          {leaderboard.map((data, i) => {
            if (data.level === currentLevel) {
              return (
                <tr key={i}>
                  <td>{data.name}</td>
                  <td>{Math.floor((data.time / 1000)) + "." + ((data.time / 10) % 100)}</td>
                </tr>
              )
            }
            return '';
          })}
        </table>
      </div>
    </div>
  );
}

export default LeaderboardPage;