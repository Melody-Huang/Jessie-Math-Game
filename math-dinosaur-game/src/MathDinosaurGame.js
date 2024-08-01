import React, { useState, useEffect } from 'react';
import Balloon from './components/Balloon';
import DinosaurImage from './components/DinosaurImage';
import TreasureChest from './components/TreasureChest';
import './styles.css';
import './MathDinosaurGame.css';

const generateMathProblem = () => {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  return { problem: `${num1} + ${num2}`, result: num1 + num2 };
};

const generateBalloonPositions = () => {
  return Array(5).fill().map(() => ({
    left: `${Math.random() * 80}%`,
    animationDuration: `${15 + Math.random() * 10}s`,
  }));
};

const MathDinosaurGame = () => {
  const [problem, setProblem] = useState(generateMathProblem());
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('egg');
  const [eggs, setEggs] = useState(1);
  const [rewards, setRewards] = useState([]);
  const [balloonPositions, setBalloonPositions] = useState(generateBalloonPositions());
  const [showRewards, setShowRewards] = useState(false);

  const generateNewProblem = () => {
    setProblem(generateMathProblem());
    setBalloonPositions(generateBalloonPositions());
  };

  const handleAnswer = (userAnswer) => {
    if (userAnswer === problem.result) {
      setScore(prevScore => prevScore + 1);
      if (gameState === 'egg' && score + 1 >= 3) {
        setGameState('baby');
      } else if (gameState === 'baby' && score + 1 >= 6) {
        setGameState('adult');
      } else if (gameState === 'adult' && score + 1 >= 9) {
        setRewards(prev => [...prev, 'dinosaur']);
        setEggs(prev => prev + 1);
        setGameState('egg');
        setScore(0);
      }
    } else {
      if (gameState !== 'egg') {
        setGameState('egg');
        setScore(0);
      } else if (eggs > 1) {
        setEggs(prev => prev - 1);
      } else {
        alert('Game Over!');
        resetGame();
      }
    }
    generateNewProblem();
  };

  const resetGame = () => {
    setScore(0);
    setEggs(1);
    setRewards([]);
    setGameState('egg');
    generateNewProblem();
  };

  return (
    <div className="math-dinosaur-game">
      <h1 className="game-title">Dragon Math Game</h1>
      <div className="problem">{problem.problem} = ?</div>
      <div className="balloons-container">
        {balloonPositions.map((position, index) => (
          <Balloon
            key={index}
            number={index === 0 ? problem.result : Math.floor(Math.random() * 20) + 1}
            onClick={() => handleAnswer(index === 0 ? problem.result : Math.floor(Math.random() * 20) + 1)}
            style={position}
          />
        ))}
      </div>
      <div className="game-area">
        <TreasureChest title="Egg Nest" content={`${eggs} egg${eggs !== 1 ? 's' : ''}`} />
        <DinosaurImage stage={gameState} size={score} />
        <TreasureChest
          title="Rewards"
          content={`${rewards.length} dragon${rewards.length !== 1 ? 's' : ''}`}
          onClick={() => setShowRewards(!showRewards)}
        />
      </div>
      {showRewards && (
        <div className="rewards-window">
          {rewards.map((reward, index) => (
            <div key={index} className="reward-sticker">🦕</div>
          ))}
        </div>
      )}
      <button className="reset-button" onClick={resetGame}>Reset Game</button>
    </div>
  );
};

export default MathDinosaurGame;