import React from 'react';

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

export default Balloon;