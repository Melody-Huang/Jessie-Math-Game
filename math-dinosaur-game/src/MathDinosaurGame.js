import React, { useState, useEffect } from 'react';
import './MathDinosaurGame.css';

// Import all dinosaur images
import egg from './images/egg.png';
import hatched from './images/hatched.png';
import baby from './images/baby.png';
import young from './images/young.png';
import adult from './images/adult.png';

import hatched2 from './images/hatched2.png';
import baby2 from './images/baby2.png';
import young2 from './images/young2.png';
import adult2 from './images/adult2.png';

import hatched3 from './images/hatched3.png';
import baby3 from './images/baby3.png';
import young3 from './images/young3.png';
import adult3 from './images/adult3.png';

import hatched4 from './images/hatched4.png';
import baby4 from './images/baby4.png';
import young4 from './images/young4.png';
import adult4 from './images/adult4.png';

import hatched5 from './images/hatched5.png';
import baby5 from './images/baby5.png';
import young5 from './images/young5.png';
import adult5 from './images/adult5.png';

const ANIMATION_DURATION = 2000;

const dinosaurGroups = [
  { hatched, baby, young, adult },
  { hatched: hatched2, baby: baby2, young: young2, adult: adult2 },
  { hatched: hatched3, baby: baby3, young: young3, adult: adult3 },
  { hatched: hatched4, baby: baby4, young: young4, adult: adult4 },
  { hatched: hatched5, baby: baby5, young: young5, adult: adult5 },
];

const generateMathProblem = () => {
  const operations = ['+', '-', '*', '/'];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  let num1, num2, result;

  switch (operation) {
    case '+':
      num1 = Math.floor(Math.random() * 9) + 1; // 1-9
      num2 = Math.floor(Math.random() * 90) + 10; // 10-99
      result = num1 + num2;
      break;
    case '-':
      num1 = Math.floor(Math.random() * 90) + 10; // 10-99
      num2 = Math.floor(Math.random() * 9) + 1; // 1-9
      result = num1 - num2;
      break;
    case '*':
      num1 = Math.floor(Math.random() * 9) + 1; // 1-9
      num2 = Math.floor(Math.random() * 9) + 1; // 1-9
      result = num1 * num2;
      break;
    case '/':
      num2 = Math.floor(Math.random() * 9) + 1; // 1-9
      result = Math.floor(Math.random() * 9) + 1; // 1-9
      num1 = num2 * result; // This ensures the division always results in a whole number
      break;
  }

  return { problem: `${num1} ${operation} ${num2}`, result };
};

const generateBalloon = (containerWidth, containerHeight, balloonWidth, balloonHeight, isCorrect, correctAnswer) => {
  const left = Math.random() * (containerWidth - balloonWidth);
  const top = Math.random() * (containerHeight - balloonHeight);
  const speed = 0.5 + Math.random() * 1.5;
  const direction = Math.random() < 0.5 ? -1 : 1;
  const number = isCorrect ? correctAnswer : Math.floor(Math.random() * 50) + 1;
  const color = `hsl(${Math.random() * 360}, 80%, 75%)`;

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
  const balloonWidth = 12;
  const balloonHeight = 15;

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
  const [showRewardsModal, setShowRewardsModal] = useState(false);
  const [showEggsModal, setShowEggsModal] = useState(false);
  const [graduatingDino, setGraduatingDino] = useState(null);
  const [newEgg, setNewEgg] = useState(null);
  const [currentDinoGroup, setCurrentDinoGroup] = useState(dinosaurGroups[0]);

  useEffect(() => {
    startNewRound();
    const intervalId = setInterval(updateBalloonPositions, 50);
    return () => clearInterval(intervalId);
  }, []);

  const startNewRound = () => {
    setCurrentDinoGroup(dinosaurGroups[Math.floor(Math.random() * dinosaurGroups.length)]);
    setGameState('egg');
    setScore(0);
    generateNewProblem();
  };

  const updateBalloonPositions = () => {
    setBalloons(prevBalloons =>
      prevBalloons.map(balloon => {
        let newLeft = parseFloat(balloon.left) + (balloon.speed * balloon.direction * 0.1);
        let newTop = parseFloat(balloon.top);

        if (newLeft < 0 || newLeft > 90) {
          balloon.direction *= -1;
          newLeft = Math.max(0, Math.min(newLeft, 90));
        }

        if (newTop < 0 || newTop > 90) {
          balloon.verticalDirection = (balloon.verticalDirection || 1) * -1;
          newTop = Math.max(0, Math.min(newTop, 90));
        }

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
        setGameState('young');
        setScore(0);
      } else if (gameState === 'young' && score + 1 >= 3) {
        setGameState('adult');
        setScore(0);
      } else if (gameState === 'adult' && score + 1 >= 3) {
        setGraduatingDino({ top: '50%', left: '50%' });
        setTimeout(() => {
          setRewards(prev => [...prev, currentDinoGroup.adult]);
          setGraduatingDino(null);
          setNewEgg({ top: '100%', left: '50%' });
          setTimeout(() => {
            setNewEgg(null);
            setEggs(prev => prev + 1);
            startNewRound();
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
    setEggs(1);
    setRewards([]);
    startNewRound();
  };

  const getDinosaurImage = () => {
    switch (gameState) {
      case 'egg': return egg;
      case 'hatched': return currentDinoGroup.hatched;
      case 'baby': return currentDinoGroup.baby;
      case 'young': return currentDinoGroup.young;
      case 'adult': return currentDinoGroup.adult;
      default: return egg;
    }
  };

  const toggleRewardsModal = () => {
    setShowRewardsModal(!showRewardsModal);
  };

  const toggleEggsModal = () => {
    setShowEggsModal(!showEggsModal);
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
              backgroundImage: `url(${currentDinoGroup.adult})`,
              top: graduatingDino.top,
              left: graduatingDino.left
            }}
          />
        )}
        {newEgg && (
          <div
            className="new-egg"
            style={{
              backgroundImage: `url(${egg})`,
              top: newEgg.top,
              left: newEgg.left
            }}
          />
        )}
      </div>
      <div className="bottom-container">
        <div className="treasure-chest nest-chest" onClick={toggleEggsModal}>
          <h3>Egg Nest</h3>
          <p>{eggs} egg{eggs !== 1 ? 's' : ''}</p>
        </div>
        <button className="reset-button" onClick={resetGame}>Reset Game</button>
        <div className="treasure-chest rewards-chest" onClick={toggleRewardsModal}>
          <h3>Rewards</h3>
          <p>{rewards.length} dragon{rewards.length !== 1 ? 's' : ''}</p>
        </div>
      </div>
      {showRewardsModal && (
        <Modal title="Collected Dragons" onClose={toggleRewardsModal}>
          <div className="rewards-stickers">
            {rewards.map((rewardImage, index) => (
              <img key={index} src={rewardImage} alt="Adult Dragon" className="reward-sticker" />
            ))}
          </div>
        </Modal>
      )}
      {showEggsModal && (
        <Modal title="Egg Collection" onClose={toggleEggsModal}>
          <div className="egg-collection">
            {[...Array(eggs)].map((_, index) => (
              <img key={index} src={egg} alt="Dragon Egg" className="egg-sticker" />
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
};

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

const Modal = ({ title, children, onClose }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>{title}</h2>
      {children}
      <button onClick={onClose}>Close</button>
    </div>
  </div>
);

export default MathDinosaurGame;