import React from 'react';

const DinosaurImage = ({ stage }) => (
  <div>
    {stage === 'egg' && <div>🥚</div>}
    {stage === 'baby' && <div>🐣</div>}
    {stage === 'adult' && <div>🦖</div>}
  </div>
);

export default DinosaurImage;