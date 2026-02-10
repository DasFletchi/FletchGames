
import React from 'react';
import { Game } from '../types';

interface GameCardProps {
  game: Game;
  index: number;
  onClick: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group relative aspect-square bg-[#0d0d0d] overflow-hidden cursor-pointer transition-all duration-300"
    >
      {/* Background Image */}
      <img 
        src={game.thumbnail} 
        alt={game.title}
        className="w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0"
      />
      
      {/* Content Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90 transition-opacity"></div>
      
      {/* Card Info */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.2em] mb-1">
            {game.category}
          </div>
          <h3 className="text-white font-bold text-sm uppercase tracking-tight heading-font">
            {game.title}
          </h3>
        </div>
      </div>

      {/* Hover Border Border */}
      <div className="absolute inset-0 border-[0px] group-hover:border-[4px] border-white/10 transition-all pointer-events-none"></div>
    </div>
  );
};

export default GameCard;
