import React from 'react';
import '../styles/ProductCard.css';
import Easy from '../images/easy.jpg';
import Medium from '../images/medium.jpg';
import Hard from '../images/hard.jpg';

function GameCard({ level }) {
    const gameDifficulty = level.difficulty;
    const gameCharacters = level.characters.map((character) => {
      return <img className="card-character-image" src={character.image} alt={character.name} />
    });
    let finalImage;

    if (gameDifficulty === "Easy") {
        finalImage = Easy;
    } else if (gameDifficulty === "Medium") {
        finalImage = Medium;
    } else if (gameDifficulty === "Hard") {
        finalImage = Hard;
    }

    return (
        <div className="card-container">
            <div className="card-image-container">
                <img className="card-image" src={finalImage} alt={gameDifficulty} />
            </div>
            <div className="card-info-container">
                <div className="card-difficulty">{gameDifficulty}</div>
                <div className="card-characters">{gameCharacters}</div>
            </div>
        </div>
    );
}

export default GameCard;