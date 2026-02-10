
import React, { useState, useMemo, useEffect } from 'react';
import { games, fnafGames } from './data/games';
import { Game, ViewState } from './types';
import Header from './components/Header';
import GameGrid from './components/GameGrid';
import GamePlayer from './components/GamePlayer';

const App: React.FC = () => {
  const [activeGame, setActiveGame] = useState<Game | null>(null);
  const [view, setView] = useState<ViewState>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
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
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleSelectGame = (game: Game) => {
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

  return (
    <div className={`min-h-screen transition-all duration-700 ${isFocusMode ? 'bg-black' : 'bg-[#0a0a0a]'}`}>
      {notification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-red-600 text-white px-6 py-3 font-bold text-[10px] uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(220,38,38,0.5)] border border-white/20">
          {notification}
        </div>
      )}

      {!isFocusMode && (
        <Header 
          onSearch={setSearchQuery} 
          searchQuery={searchQuery}
          onLogoClick={handleBackToGrid}
          onOpenSubmit={() => setIsSubmitModalOpen(true)}
        />
      )}

      <main className={`transition-all duration-300 ${isFocusMode ? 'p-0' : 'max-w-7xl mx-auto px-6 py-12'}`}>
        {view === 'grid' ? (
          <div className="space-y-12">
            {/* Standard Section */}
            {(filteredGames.length > 0 || searchQuery) && (
              <div className="space-y-16">
                {!searchQuery && (
                  <div className="flex flex-col md:flex-row justify-between items-baseline gap-4 border-b border-zinc-900 pb-8">
                    <div>
                      <h2 className="text-4xl font-bold tracking-tight text-white heading-font uppercase">Library</h2>
                      <p className="text-zinc-500 text-sm mt-2 uppercase tracking-widest font-medium">Verified unblocked web experiences</p>
                    </div>
                    <div className="text-zinc-700 font-mono text-xs uppercase">
                      SYS_STABLE // 100% UPTIME
                    </div>
                  </div>
                )}
                {filteredGames.length > 0 ? (
                  <GameGrid games={filteredGames} onSelectGame={handleSelectGame} />
                ) : !filteredFnafGames.length && (
                  <div className="text-center py-20 border border-zinc-900 bg-zinc-900/10">
                    <p className="text-zinc-600 font-medium tracking-wide">NO DATA FOUND FOR: "{searchQuery}"</p>
                  </div>
                )}
              </div>
            )}

            {/* FNAF Section */}
            {(filteredFnafGames.length > 0) && (
              <div className="fnaf-section p-8 md:p-12 border border-red-950/40 overflow-hidden shadow-[inset_0_0_100px_rgba(220,38,38,0.05)]">
                <div className="fnaf-static-overlay"></div>
                <div className="scanline-effect"></div>
                <div className="relative z-10 space-y-12">
                  <div className="flex flex-col md:flex-row justify-between items-baseline gap-4 border-b border-red-900/50 pb-8">
                    <div>
                      <h2 className="text-4xl font-bold tracking-tight text-red-600 heading-font drop-shadow-[0_0_15px_rgba(220,38,38,0.4)]">SECURITY_FEED</h2>
                      <p className="text-red-900/80 text-[10px] mt-2 uppercase tracking-[0.4em] font-black italic">ALERT: FAZBEAR_INTRA_NET DETECTED</p>
                    </div>
                    <div className="text-red-950 font-mono text-[10px] uppercase tracking-widest font-bold">
                      CAM_GLOBAL // OFFICE
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-red-900/30 border border-red-900/20">
                    {filteredFnafGames.map((game) => (
                      <div 
                        key={game.id} 
                        onClick={() => handleSelectGame(game)}
                        className={`group relative aspect-square bg-black overflow-hidden transition-all duration-300 border border-transparent ${game.iframeUrl ? 'cursor-pointer hover:border-red-600/60' : 'cursor-not-allowed opacity-60'}`}
                      >
                        <img 
                          src={game.thumbnail} 
                          alt={game.title}
                          className={`w-full h-full object-cover opacity-40 group-hover:opacity-70 group-hover:scale-110 transition-all duration-700 grayscale ${game.iframeUrl ? 'group-hover:grayscale-0' : ''}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                        <div className="absolute inset-0 p-6 flex flex-col justify-end">
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${game.iframeUrl ? 'bg-red-600 animate-pulse' : 'bg-zinc-800'}`}></div>
                            <span className="text-[8px] text-red-900 font-bold uppercase tracking-[0.2em]">
                              {game.iframeUrl ? 'Live Stream' : 'OFFLINE'}
                            </span>
                          </div>
                          <h3 className={`text-red-500 font-bold text-sm uppercase tracking-widest heading-font ${game.iframeUrl ? 'group-hover:text-red-400' : 'text-red-900/50'}`}>
                            {game.title}
                          </h3>
                          {!game.iframeUrl && (
                            <span className="text-[7px] text-red-900/40 uppercase font-black tracking-tighter mt-1">COMING SOON</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          activeGame && (
            <GamePlayer 
              game={activeGame} 
              onClose={handleBackToGrid}
              isFocusMode={isFocusMode}
              onToggleFocus={toggleFocusMode}
            />
          )
        )}
      </main>

      {!isFocusMode && (
        <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-zinc-900 mt-20 opacity-50 hover:opacity-100 transition-opacity">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4">
              <span className="text-xl font-bold tracking-tighter heading-font text-zinc-300 uppercase">Fletch Games</span>
              <span className="h-4 w-[1px] bg-zinc-800"></span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">© 2024 Privacy Enabled</span>
            </div>
            <div className="flex gap-10 text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">
              <button onClick={() => setIsSubmitModalOpen(true)} className="hover:text-white transition-colors">Submit Request</button>
              <a href="https://github.com/DasFletchi/FletchGames" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Source</a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
