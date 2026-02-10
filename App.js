import React, { useState, useMemo, useEffect } from 'react';
import { games, fnafGames } from './data/games.js';
import Header from './components/Header.js';
import GameGrid from './components/GameGrid.js';
import GamePlayer from './components/GamePlayer.js';
import SubmitModal from './components/SubmitModal.js';

const App = () => {
  const [activeGame, setActiveGame] = useState(null);
  const [view, setView] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  const filteredGames = useMemo(() => {
    return games.filter(g => 
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredFnafGames = useMemo(() => {
    return fnafGames.filter(g => 
      g.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleSelectGame = (game) => {
    if (!game.iframeUrl) {
      setNotification(`${game.title} is coming soon. Station offline.`);
      return;
    }
    setActiveGame(game);
    setView('player');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToGrid = () => {
    setView('grid');
    setActiveGame(null);
    setIsFocusMode(false);
  };

  const toggleFocusMode = () => {
    setIsFocusMode(!isFocusMode);
  };

  const handleSubmitRequest = async (requestData) => {
    // 1. Save locally as backup (only visible to this user)
    const existingRequests = JSON.parse(localStorage.getItem('fletch_requests') || '[]');
    const newRequest = {
      ...requestData,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };
    existingRequests.push(newRequest);
    localStorage.setItem('fletch_requests', JSON.stringify(existingRequests));
    
    // 2. Try to send via Webhook if configured (Visible to Admin via Discord)
    const webhookUrl = localStorage.getItem('fletch_webhook_url');
    let webhookSuccess = false;

    if (webhookUrl) {
      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: "Fletch Games Uplink",
            avatar_url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=100&h=100&auto=format&fit=crop",
            embeds: [{
              title: "🛰️ INCOMING GAME PROPOSAL",
              color: 0xcc0000,
              fields: [
                { name: "Game Title", value: `**${requestData.title}**`, inline: true },
                { name: "Category", value: requestData.category, inline: true },
                { name: "Source Link", value: requestData.url }
              ],
              footer: { text: "Fletch Games Terminal // Secure Transmission" },
              timestamp: new Date().toISOString()
            }]
          })
        });
        webhookSuccess = response.ok;
      } catch (err) {
        console.error("Webhook transmission failed", err);
      }
    }

    if (webhookSuccess) {
      setNotification("TRANSMISSION BROADCASTED. DATA RECEIVED BY ADMIN.");
    } else {
      setNotification("DATA SAVED TO LOCAL BUFFER. (NO WEBHOOK CONFIGURED)");
    }
    
    setIsSubmitModalOpen(false);
  };

  return React.createElement('div', { className: `min-h-screen transition-all duration-700 ${isFocusMode ? 'bg-black' : 'bg-[#0a0a0a]'}` },
    notification && React.createElement('div', { className: "fixed top-24 left-1/2 -translate-x-1/2 z-[300] bg-red-600 text-white px-8 py-4 font-bold text-[10px] uppercase tracking-[0.2em] shadow-[0_0_50px_rgba(220,38,38,0.6)] border border-white/20 animate-pulse flex items-center gap-4" },
      React.createElement('div', { className: "w-2 h-2 bg-white rounded-full animate-ping" }),
      notification
    ),
    
    isSubmitModalOpen && React.createElement(SubmitModal, {
      onClose: () => setIsSubmitModalOpen(false),
      onSubmit: handleSubmitRequest
    }),

    !isFocusMode && React.createElement(Header, { 
      onSearch: setSearchQuery, 
      searchQuery: searchQuery,
      onLogoClick: handleBackToGrid,
      onOpenSubmit: () => setIsSubmitModalOpen(true)
    }),
    
    React.createElement('main', { className: `transition-all duration-300 ${isFocusMode ? 'p-0' : 'max-w-7xl mx-auto px-6 py-12'}` },
      view === 'grid' ? React.createElement('div', { className: "space-y-12" },
        (filteredGames.length > 0 || searchQuery) && React.createElement('div', { className: "space-y-16" },
          !searchQuery && React.createElement('div', { className: "flex flex-col md:flex-row justify-between items-baseline gap-4 border-b border-zinc-900 pb-8" },
            React.createElement('div', null,
              React.createElement('h2', { className: "text-4xl font-bold tracking-tight text-white heading-font uppercase" }, "Library"),
              React.createElement('p', { className: "text-zinc-500 text-sm mt-2 uppercase tracking-widest font-medium" }, "Verified unblocked web experiences")
            ),
            React.createElement('div', { className: "text-zinc-700 font-mono text-xs uppercase" }, "SYS_STABLE // 100% UPTIME")
          ),
          filteredGames.length > 0 ? React.createElement(GameGrid, { games: filteredGames, onSelectGame: handleSelectGame }) 
          : !filteredFnafGames.length && React.createElement('div', { className: "text-center py-20 border border-zinc-900 bg-zinc-900/10" },
            React.createElement('p', { className: "text-zinc-600 font-medium tracking-wide" }, `NO DATA FOUND FOR: "${searchQuery}"`)
          )
        ),
        (filteredFnafGames.length > 0) && React.createElement('div', { className: "fnaf-section p-8 md:p-12 border border-red-950/40 overflow-hidden shadow-[inset_0_0_100px_rgba(220,38,38,0.05)]" },
          React.createElement('div', { className: "fnaf-static-overlay" }),
          React.createElement('div', { className: "scanline-effect" }),
          React.createElement('div', { className: "relative z-10 space-y-12" },
            React.createElement('div', { className: "flex flex-col md:flex-row justify-between items-baseline gap-4 border-b border-red-900/50 pb-8" },
              React.createElement('div', null,
                React.createElement('h2', { className: "text-4xl font-bold tracking-tight text-red-600 heading-font drop-shadow-[0_0_15px_rgba(220,38,38,0.4)]" }, "SECURITY_FEED"),
                React.createElement('p', { className: "text-red-900/80 text-[10px] mt-2 uppercase tracking-[0.4em] font-black italic" }, "ALERT: FAZBEAR_INTRA_NET DETECTED")
              ),
              React.createElement('div', { className: "text-red-950 font-mono text-[10px] uppercase tracking-widest font-bold" }, "CAM_GLOBAL // OFFICE")
            ),
            React.createElement('div', { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-red-900/30 border border-red-900/20" },
              filteredFnafGames.map((game) => 
                React.createElement('div', { 
                  key: game.id, 
                  onClick: () => handleSelectGame(game),
                  className: `group relative aspect-square bg-black overflow-hidden transition-all duration-300 border border-transparent ${game.iframeUrl ? 'cursor-pointer hover:border-red-600/60' : 'cursor-not-allowed opacity-60'}`
                },
                  React.createElement('img', { 
                    src: game.thumbnail, 
                    alt: game.title,
                    className: `w-full h-full object-cover opacity-40 group-hover:opacity-70 group-hover:scale-110 transition-all duration-700 grayscale ${game.iframeUrl ? 'group-hover:grayscale-0' : ''}`
                  }),
                  React.createElement('div', { className: "absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" }),
                  React.createElement('div', { className: "absolute inset-0 p-6 flex flex-col justify-end" },
                    React.createElement('div', { className: "flex items-center gap-2 mb-1" },
                      React.createElement('div', { className: `w-1.5 h-1.5 rounded-full ${game.iframeUrl ? 'bg-red-600 animate-pulse' : 'bg-zinc-800'}` }),
                      React.createElement('span', { className: "text-[8px] text-red-900 font-bold uppercase tracking-[0.2em]" }, game.iframeUrl ? 'Live Stream' : 'OFFLINE')
                    ),
                    React.createElement('h3', { className: `text-red-500 font-bold text-sm uppercase tracking-widest heading-font ${game.iframeUrl ? 'group-hover:text-red-400' : 'text-red-900/50'}` }, game.title),
                    !game.iframeUrl && React.createElement('span', { className: "text-[7px] text-red-900/40 uppercase font-black tracking-tighter mt-1" }, "COMING SOON")
                  )
                )
              )
            )
          )
        )
      ) : (
        activeGame && React.createElement(GamePlayer, { 
          game: activeGame, 
          onClose: handleBackToGrid,
          isFocusMode: isFocusMode,
          onToggleFocus: toggleFocusMode
        })
      )
    ),
    !isFocusMode && React.createElement('footer', { className: "max-w-7xl mx-auto px-6 py-12 border-t border-zinc-900 mt-20 opacity-50 hover:opacity-100 transition-opacity" },
      React.createElement('div', { className: "flex flex-col md:flex-row justify-between items-center gap-8" },
        React.createElement('div', { className: "flex items-center gap-4" },
          React.createElement('span', { className: "text-xl font-bold tracking-tighter heading-font text-zinc-300 uppercase" }, "Fletch Games"),
          React.createElement('span', { className: "h-4 w-[1px] bg-zinc-800" }),
          React.createElement('span', { 
            className: "text-[10px] text-zinc-500 uppercase tracking-widest cursor-pointer hover:text-white",
            onClick: () => setIsSubmitModalOpen(true)
          }, "© 2024 Privacy Enabled"),
        ),
        React.createElement('div', { className: "flex gap-10 text-[10px] text-zinc-400 uppercase tracking-widest font-semibold" },
          React.createElement('button', { onClick: () => setIsSubmitModalOpen(true), className: "hover:text-white transition-colors" }, "Submit Request"),
          React.createElement('a', { href: "https://github.com/DasFletchi/FletchGames", target: "_blank", rel: "noopener noreferrer", className: "hover:text-white transition-colors" }, "Source")
        )
      )
    )
  );
};

export default App;