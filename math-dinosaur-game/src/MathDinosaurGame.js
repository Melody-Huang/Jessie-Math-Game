import React, { useState, useEffect } from 'react';
import './MathDinosaurGame.css';

import eggImage from './images/egg.png';
import hatchedImage from './images/hatched.png';
import babyImage from './images/baby.png';
import adultImage from './images/adult.png';

const ANIMATION_DURATION = 2000;

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

const generateBalloon = (containerWidth, containerHeight, balloonWidth, balloonHeight, isCorrect, correctAnswer) => {
  const left = Math.random() * (containerWidth - balloonWidth);
  const top = Math.random() * (containerHeight - balloonHeight);
  const speed = 0.5 + Math.random() * 1.5; // Slightly reduced max speed
  const direction = Math.random() < 0.5 ? -1 : 1;
  const number = isCorrect ? correctAnswer : Math.floor(Math.random() * 20) + 1;
  const color = `hsl(${Math.random() * 360}, 80%, 75%)`; // Brighter colors

  return {
    left: `${left}%`,
    top: `${top}%`,
    speed,
    direction,
    number,
    color,
  };
};

const generateBalloons = (correctAnswer) => {
  const containerWidth = 100;
  const containerHeight = 100;
  const balloonWidth = 12; // Increased width
  const balloonHeight = 15; // Slightly taller than wide for oval shape

  const balloons = [];
  const correctIndex = Math.floor(Math.random() * 5);

  for (let i = 0; i < 5; i++) {
    balloons.push(generateBalloon(containerWidth, containerHeight, balloonWidth, balloonHeight, i === correctIndex, correctAnswer));
  }

  return balloons;
};


const MathDinosaurGame = () => {
  const [problem, setProblem] = useState(generateMathProblem());
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('egg');
  const [eggs, setEggs] = useState(1);
  const [rewards, setRewards] = useState([]);
  const [balloons, setBalloons] = useState([]);
  const [showRewards, setShowRewards] = useState(false);
  const [graduatingDino, setGraduatingDino] = useState(null);
  const [newEgg, setNewEgg] = useState(null);

  useEffect(() => {
    generateNewProblem();
    const intervalId = setInterval(updateBalloonPositions, 50); // Update positions every 50ms
    return () => clearInterval(intervalId);
  }, []);


  const updateBalloonPositions = () => {
    setBalloons(prevBalloons =>
      prevBalloons.map(balloon => {
        let newLeft = parseFloat(balloon.left) + (balloon.speed * balloon.direction * 0.1);
        let newTop = parseFloat(balloon.top);

        // Bounce off the sides
        if (newLeft < 0 || newLeft > 90) { // 90 is 100 - balloonSize
          balloon.direction *= -1; // Reverse direction
          newLeft = Math.max(0, Math.min(newLeft, 90));
        }

        // Bounce off the top and bottom
        if (newTop < 0 || newTop > 90) {
          balloon.verticalDirection = (balloon.verticalDirection || 1) * -1; // Reverse vertical direction
          newTop = Math.max(0, Math.min(newTop, 90));
        }

        // Add slight vertical movement
        newTop += balloon.verticalDirection * 0.05;

        return { ...balloon, left: `${newLeft}%`, top: `${newTop}%` };
      })
    );
  };

  const generateNewProblem = () => {
    const newProblem = generateMathProblem();
    setProblem(newProblem);
    setBalloons(generateBalloons(newProblem.result));
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
        setGraduatingDino({ top: '50%', left: '50%' });
        setTimeout(() => {
          setRewards(prev => [...prev, 'adult']);
          setGraduatingDino(null);
          setNewEgg({ top: '100%', left: '50%' });
          setTimeout(() => {
            setNewEgg(null);
            setEggs(prev => prev + 1);
            setGameState('egg');
            setScore(0);
          }, ANIMATION_DURATION);
        }, ANIMATION_DURATION);
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
    switch (gameState) {
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
      <div className="problem-container">
        <div className="problem">{problem.problem} = ?</div>
      </div>
      <div
        className="balloons-container"
        style={{
          backgroundImage: `url(${getDinosaurImage()})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain'
        }}
      >
        {balloons.map((balloon, index) => (
          <Balloon
            key={index}
            number={balloon.number}
            onClick={() => handleAnswer(balloon.number)}
            style={{ left: balloon.left, top: balloon.top, backgroundColor: balloon.color }}
          />
        ))}
        {graduatingDino && (
          <div
            className="graduating-dino"
            style={{
              backgroundImage: `url(${adultImage})`,
              top: graduatingDino.top,
              left: graduatingDino.left
            }}
          />
        )}
        {newEgg && (
          <div
            className="new-egg"
            style={{
              backgroundImage: `url(${eggImage})`,
              top: newEgg.top,
              left: newEgg.left
            }}
          />
        )}
      </div>
      <div className="bottom-container">
        <div className="treasure-chest nest-chest">
          <h3>Egg Nest</h3>
          <p>{eggs} egg{eggs !== 1 ? 's' : ''}</p>
        </div>
        <button className="reset-button" onClick={resetGame}>Reset Game</button>
        <div className="treasure-chest rewards-chest">
          <h3>Rewards</h3>
          <p>{rewards.length} dragon{rewards.length !== 1 ? 's' : ''}</p>
        </div>
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