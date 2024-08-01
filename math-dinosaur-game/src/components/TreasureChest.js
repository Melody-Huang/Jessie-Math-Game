import React from 'react';

const TreasureChest = ({ title, content, onClick }) => (
  <div className="treasure-chest" onClick={onClick}>
    <h3>{title}</h3>
    <div className="chest">
      <div className="chest-lid"></div>
      <div className="chest-body"></div>
    </div>
    <p>{content}</p>
  </div>
);

export default TreasureChest;