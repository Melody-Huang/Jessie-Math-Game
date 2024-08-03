import React, { useState, useEffect } from 'react';
import './MathDinosaurGame.css';

import eggImage from './images/egg.png';
import hatchedImage from './images/hatched.png';
import babyImage from './images/baby.png';
import adultImage from './images/adult.png';

const generateMathProblem = () => {
  const operations = ['+', '-', '*', '/'];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  let num1, num2, result;

  switch (operation) {
    case '+':
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * 10) + 1;
      result = num1 + num2;
      break;
    case '-':
      num1 = Math.floor(Math.random() * 10) + 1;
      num2 = Math.floor(Math.random() * num1) + 1;
      result = num1 - num2;
      break;
    case '*':
      num1 = Math.floor(Math.random() * 5) + 1;
      num2 = Math.floor(Math.random() * 5) + 1;
      result = num1 * num2;
      break;
    case '/':
      num2 = Math.floor(Math.random() * 5) + 1;
      result = Math.floor(Math.random() * 5) + 1;
      num1 = num2 * result;
      break;
  }

  return { problem: `${num1} ${operation} ${num2}`, result };
};

const generateBalloonPositions = () => {
  const positions = [];
  const gridSize = 3; // 3x3 grid
  const cellWidth = 100 / gridSize;
  const cellHeight = 100 / gridSize;
  const balloonSize = 100; // Approximate size of balloon in pixels
  const containerWidth = 400; // Approximate width of container in pixels
  const containerHeight = 300; // Approximate height of container in pixels

  // Convert balloon size to percentage of container
  const balloonWidthPercent = (balloonSize / containerWidth) * 100;
  const balloonHeightPercent = (balloonSize / containerHeight) * 100;

  const usedCells = [];

  for (let i = 0; i < 5; i++) {
    let cell;
    do {
      cell = {
        row: Math.floor(Math.random() * gridSize),
        col: Math.floor(Math.random() * gridSize)
      };
    } while (usedCells.some(usedCell => usedCell.row === cell.row && usedCell.col === cell.col));

    usedCells.push(cell);

    let left = cell.col * cellWidth + Math.random() * (cellWidth - balloonWidthPercent);
    let top = cell.row * cellHeight + Math.random() * (cellHeight - balloonHeightPercent);

    // Ensure balloons stay within container bounds
    left = Math.max(0, Math.min(left, 100 - balloonWidthPercent));
    top = Math.max(0, Math.min(top, 100 - balloonHeightPercent));

    positions.push({
      left: `${left}%`,
      top: `${top}%`,
      animationDuration: `${15 + Math.random() * 10}s`,
      animationDelay: `${-Math.random() * 15}s`,
    });
  }
  return positions;
};

const MathDinosaurGame = () => {
  const [problem, setProblem] = useState(generateMathProblem());
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('egg');
  const [eggs, setEggs] = useState(1);
  const [rewards, setRewards] = useState([]);
  const [balloonPositions, setBalloonPositions] = useState(generateBalloonPositions());
  const [showRewards, setShowRewards] = useState(false);

  useEffect(() => {
    generateNewProblem();
  }, []);

  const generateNewProblem = () => {
    setProblem(generateMathProblem());
    setBalloonPositions(generateBalloonPositions());
  };

  const handleAnswer = (userAnswer) => {
    if (userAnswer === problem.result) {
      setScore(prevScore => prevScore + 1);
      if (gameState === 'egg' && score + 1 >= 3) {
        setGameState('hatched');
        setScore(0);
      } else if (gameState === 'hatched' && score + 1 >= 3) {
        setGameState('baby');
        setScore(0);
      } else if (gameState === 'baby' && score + 1 >= 3) {
        setGameState('adult');
        setScore(0);
      } else if (gameState === 'adult' && score + 1 >= 3) {
        setRewards(prev => [...prev, 'adult']);
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

  const getDinosaurImage = () => {
    switch(gameState) {
      case 'egg': return eggImage;
      case 'hatched': return hatchedImage;
      case 'baby': return babyImage;
      case 'adult': return adultImage;
      default: return eggImage;
    }
  };

  return (
    <div className="math-dinosaur-game">
      <h1 className="game-title">Dragon Math Game</h1>
      <div className="game-area">
        <TreasureChest title="Egg Nest" content={`${eggs} egg${eggs !== 1 ? 's' : ''}`} />
        <div className="center-area">
          <div className="problem-container">
            <div className="problem">{problem.problem} = ?</div>
          </div>
          <img src={getDinosaurImage()} alt={gameState} className="dinosaur-image" />
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
        </div>
        <TreasureChest
          title="Rewards"
          content={`${rewards.length} dragon${rewards.length !== 1 ? 's' : ''}`}
          onClick={() => setShowRewards(!showRewards)}
        />
      </div>
      {showRewards && (
        <div className="rewards-window">
          <h3>Collected Dragons</h3>
          <div className="rewards-stickers">
            {rewards.map((reward, index) => (
              <img key={index} src={adultImage} alt="Adult Dragon" className="reward-sticker" />
            ))}
          </div>
        </div>
      )}
      <button className="reset-button" onClick={resetGame}>Reset Game</button>
    </div>
  );
};

export default MathDinosaurGame;

const Balloon = ({ number, onClick, style }) => (
  <div
    onClick={onClick}
    className="balloon"
    style={{
      width: '60px',
      height: '80px',
      borderRadius: '50%',
      backgroundColor: `hsl(${Math.random() * 360}, 70%, 80%)`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      ...style
    }}
  >
    {number}
  </div>
);

const TreasureChest = ({ title, content }) => (
  <div className="treasure-chest">
    <h3>{title}</h3>
    <p>{content}</p>
  </div>
);