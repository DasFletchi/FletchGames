import React from 'react';
import { Search } from 'lucide-react';

const Header = ({ onSearch, searchQuery, onLogoClick, onOpenSubmit }) => {
  return React.createElement('nav', { className: "sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-zinc-900" },
    React.createElement('div', { className: "max-w-7xl mx-auto px-6" },
      React.createElement('div', { className: "flex items-center justify-between h-20" },
        // Logo - Fletch Games
        React.createElement('div', { 
          onClick: onLogoClick,
          className: "flex-shrink-0 cursor-pointer flex items-center gap-3 group"
        },
          React.createElement('div', { className: "w-8 h-8 bg-white flex items-center justify-center transition-all duration-300 group-hover:bg-zinc-200" },
            React.createElement('span', { className: "text-black font-bold text-lg heading-font" }, "F")
          ),
          React.createElement('h1', { className: "text-xl font-bold tracking-tighter text-white heading-font uppercase whitespace-nowrap" },
            "Fletch ",
            React.createElement('span', { className: "text-zinc-500 group-hover:text-white transition-colors" }, "Games")
          )
        ),
        // Search
        React.createElement('div', { className: "flex-1 max-w-lg mx-12" },
          React.createElement('div', { className: "relative" },
            React.createElement('div', { className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600" },
              React.createElement(Search, { size: 16, strokeWidth: 2.5 })
            ),
            React.createElement('input', {
              type: "text",
              placeholder: "Find a game...",
              value: searchQuery,
              onChange: (e) => onSearch(e.target.value),
              className: "block w-full pl-10 pr-4 py-2 bg-zinc-900/50 border border-zinc-800 text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-400 focus:bg-zinc-900 transition-all text-sm rounded-none"
            })
          )
        ),
        // Submit Button
        React.createElement('div', { className: "hidden md:flex items-center gap-8" },
          React.createElement('button', { 
            onClick: onOpenSubmit,
            className: "px-5 py-2 text-[10px] font-bold bg-white text-black uppercase tracking-widest transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]" 
          }, "Submit")
        )
      )
    )
  );
};

export default Header;