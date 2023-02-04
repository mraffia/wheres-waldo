import React, { useState } from 'react';
import { ThreeDots } from 'react-loader-spinner';
import '../styles/LeaderboardPage.css';

function LeaderboardPage({ levels, gameLevel, leaderboard, isLoading, isError }) {
  const [currentLevel, setCurrentLevel] = useState(gameLevel);

  function dateFormatter(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    let newDate = new Date(date);

    return newDate.toLocaleDateString("en-GB", options)
  }

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
          <ThreeDots 
            height="80" 
            width="80" 
            radius="9"
            color="rgba(17, 45, 78, 1)"
            ariaLabel="three-dots-loading"
            wrapperStyle={{}}
            wrapperClassName=""
            visible={true}
          />
        ) : (
          <table className="leaderboard-table" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th style={{ width: "50%" }}>NAME</th>
                <th style={{ width: "30%" }}>TIME (SECONDS)</th>
                <th style={{ width: "20%" }}>DATE</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(leaderboard).map((item, i) => {
                if (leaderboard[item].level === currentLevel) {
                  return (
                    <tr key={i}>
                      <td>{leaderboard[item].name}</td>
                      <td>{Math.floor((leaderboard[item].time / 1000)) + "." + ((leaderboard[item].time / 10) % 100)}</td>
                      <td>{dateFormatter(leaderboard[item].date)}</td>
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