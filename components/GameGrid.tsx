
import React from 'react';
import { Game } from '../types';
import GameCard from './GameCard';

interface GameGridProps {
  games: Game[];
  onSelectGame: (game: Game) => void;
}

const GameGrid: React.FC<GameGridProps> = ({ games, onSelectGame }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-px bg-zinc-900 border border-zinc-900 overflow-hidden">
      {games.map((game, index) => (
        <GameCard 
          key={game.id} 
          game={game} 
          index={index}
          onClick={() => onSelectGame(game)} 
        />
      ))}
    </div>
  );
};

export default GameGrid;
