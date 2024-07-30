import React, { useState, useEffect } from 'react';

const generateMathProblem = () => {
  const num1 = Math.floor(Math.random() * 10) + 1;
  const num2 = Math.floor(Math.random() * 10) + 1;
  return { problem: `${num1} + ${num2}`, result: num1 + num2 };
};

const Balloon = ({ number, onClick, color, style }) => (
  <div
    onClick={onClick}
    style={{
      width: '60px',
      height: '80px',
      borderRadius: '50%',
      background: `radial-gradient(circle at 20px 20px, ${color}, ${darkenColor(color)})`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      fontSize: '20px',
      fontWeight: 'bold',
      cursor: 'pointer',
      boxShadow: '2px 2px 10px rgba(0,0,0,0.3)',
      position: 'absolute',
      transition: 'all 15s linear',
      ...style,
    }}
  >
    {number}
    <div style={{
      position: 'absolute',
      bottom: '-20px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '2px',
      height: '20px',
      backgroundColor: darkenColor(color),
    }} />
  </div>
);

const darkenColor = (color) => {
  let r = parseInt(color.slice(1, 3), 16),
      g = parseInt(color.slice(3, 5), 16),
      b = parseInt(color.slice(5, 7), 16);

  r = Math.floor(r * 0.8);
  g = Math.floor(g * 0.8);
  b = Math.floor(b * 0.8);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

const DinosaurImage = ({ stage }) => {
  let imageUrl = '/api/placeholder/100/100';  // Placeholder for egg/baby/adult dino
  if (stage === 'egg') imageUrl = '/api/placeholder/100/100?text=Egg';
  if (stage === 'baby') imageUrl = '/api/placeholder/100/100?text=Baby';
  if (stage === 'adult') imageUrl = '/api/placeholder/100/100?text=Adult';

  return (
    <img
      src={imageUrl}
      alt={`Dinosaur ${stage}`}
      style={{
        width: '100px',
        height: '100px',
        objectFit: 'contain',
        filter: 'drop-shadow(0px 0px 5px rgba(0,0,0,0.3))'
      }}
    />
  );
};

const TreasureChest = ({ title, content }) => (
  <div style={{
    width: '150px',
    height: '120px',
    background: 'url(/api/placeholder/150/120?text=Treasure) no-repeat center/cover',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
    borderRadius: '10px',
    border: '3px solid #8B4513',
  }}>
    <div style={{
      position: 'absolute',
      bottom: '0',
      left: '0',
      right: '0',
      background: 'rgba(139, 69, 19, 0.7)',
      color: '#FFD700',
      padding: '5px',
      textAlign: 'center',
    }}>
      <h3 style={{ margin: '0', fontSize: '14px' }}>{title}</h3>
      <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{content}</div>
    </div>
  </div>
);

const MathDinosaurGame = () => {
  const [problem, setProblem] = useState({ problem: '', result: 0 });
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('egg');
  const [eggs, setEggs] = useState(1);
  const [rewards, setRewards] = useState(0);
  const [balloonPositions, setBalloonPositions] = useState([]);

  useEffect(() => {
    generateNewProblem();
    const interval = setInterval(() => {
      setBalloonPositions(prevPositions => generateBalloonPositions(prevPositions));
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const generateNewProblem = () => {
    setProblem(generateMathProblem());
    setBalloonPositions(generateBalloonPositions());
  };

  const generateBalloonPositions = (prevPositions = []) => {
    return [...Array(5)].map((_, index) => {
      const prevPos = prevPositions[index] || {};
      return {
        left: `${10 + (index * 20)}%`,
        top: `${Math.random() * 60}%`,
        transform: `translate(${Math.random() * 10 - 5}px, ${Math.random() * 10 - 5}px)`,
      };
    });
  };

  const handleAnswer = (userAnswer) => {
    if (userAnswer === problem.result) {
      setScore(prevScore => prevScore + 1);
      if (score + 1 >= 3) {
        if (gameState === 'egg') {
          setGameState('baby');
        } else if (gameState === 'baby') {
          setGameState('adult');
          setRewards(prevRewards => prevRewards + 1);
        } else {
          setGameState('egg');
          setEggs(prevEggs => prevEggs + 1);
        }
        setScore(0);
      }
    } else {
      if (eggs > 1) {
        setEggs(prevEggs => prevEggs - 1);
        setGameState('egg');
        setScore(0);
      } else {
        alert('Game Over! Click OK to restart.');
        resetGame();
      }
    }
    generateNewProblem();
  };

  const resetGame = () => {
    setScore(0);
    setEggs(1);
    setGameState('egg');
    setRewards(0);
    generateNewProblem();
  };

  const balloonColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      padding: '20px',
      background: 'url(/api/placeholder/1000/600?text=DinoBackground) no-repeat center/cover',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', marginBottom: '20px' }}>
        {[1, 2, 3, 4, 5].map(i => (
          <DinosaurImage key={i} stage={`deco${i}`} />
        ))}
      </div>

      <div style={{ fontSize: '24px', margin: '20px 0', color: '#004D40', background: 'rgba(255,255,255,0.7)', padding: '10px', borderRadius: '10px' }}>
        {problem.problem} = ?
      </div>

      <div style={{ position: 'relative', width: '100%', height: '300px', marginBottom: '20px' }}>
        {balloonPositions.map((position, index) => (
          <Balloon
            key={index}
            number={index === 0 ? problem.result : Math.floor(Math.random() * 20) + 1}
            onClick={() => handleAnswer(index === 0 ? problem.result : Math.floor(Math.random() * 20) + 1)}
            color={balloonColors[index]}
            style={position}
          />
        ))}
      </div>

      <DinosaurImage stage={gameState} />

      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '20px' }}>
        <TreasureChest title="Egg Nest" content={`${eggs} egg${eggs !== 1 ? 's' : ''}`} />
        <TreasureChest title="Rewards" content={`${rewards} dino${rewards !== 1 ? 's' : ''}`} />
      </div>

      <button onClick={resetGame} style={{
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginTop: '20px',
      }}>
        Reset Game
      </button>
    </div>
  );
};

export default MathDinosaurGame;