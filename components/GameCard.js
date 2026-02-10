import React from 'react';

const GameCard = ({ game, onClick }) => {
  return React.createElement('div', { 
    onClick: onClick,
    className: "group relative aspect-square bg-[#0d0d0d] overflow-hidden cursor-pointer transition-all duration-300"
  },
    React.createElement('img', { 
      src: game.thumbnail, 
      alt: game.title,
      className: "w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0"
    }),
    React.createElement('div', { className: "absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90 transition-opacity" }),
    React.createElement('div', { className: "absolute inset-0 p-6 flex flex-col justify-end" },
      React.createElement('div', { className: "translate-y-2 group-hover:translate-y-0 transition-transform duration-500" },
        React.createElement('div', { className: "text-[9px] text-zinc-500 font-bold uppercase tracking-[0.2em] mb-1" }, game.category),
        React.createElement('h3', { className: "text-white font-bold text-sm uppercase tracking-tight heading-font" }, game.title)
      )
    ),
    React.createElement('div', { className: "absolute inset-0 border-[0px] group-hover:border-[4px] border-white/10 transition-all pointer-events-none" })
  );
};

export default GameCard;