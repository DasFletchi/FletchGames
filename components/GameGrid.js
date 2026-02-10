import React from 'react';
import GameCard from './GameCard.js';

const GameGrid = ({ games, onSelectGame }) => {
  return React.createElement('div', { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-px bg-zinc-900 border border-zinc-900 overflow-hidden" },
    games.map((game, index) => 
      React.createElement(GameCard, { 
        key: game.id, 
        game: game, 
        index: index,
        onClick: () => onSelectGame(game) 
      })
    )
  );
};

export default GameGrid;