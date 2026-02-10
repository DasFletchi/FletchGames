
import React, { useRef, useState, useEffect } from 'react';
import { Game } from '../types';
import { Maximize, Minimize, X, Info, Layout, Expand, ArrowLeft } from 'lucide-react';

interface GamePlayerProps {
  game: Game;
  onClose: () => void;
  isFocusMode: boolean;
  onToggleFocus: () => void;
}

const GamePlayer: React.FC<GamePlayerProps> = ({ game, onClose, isFocusMode, onToggleFocus }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  const toggleFullscreen = () => {
    if (iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFocusMode) {
          onToggleFocus();
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isFocusMode, onToggleFocus, onClose]);

  return (
    <div className={`flex flex-col ${isFocusMode ? 'h-screen w-screen bg-black overflow-hidden' : 'max-w-6xl mx-auto space-y-10'}`}>
      
      {/* Controls Bar */}
      <div className={`flex items-center justify-between ${isFocusMode ? 'fixed top-6 right-6 z-50 opacity-0 hover:opacity-100 transition-opacity gap-4' : 'border-b border-zinc-900 pb-6'}`}>
        <div className="flex items-center gap-6">
          {!isFocusMode && (
            <button 
              onClick={onClose}
              className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-colors uppercase text-[10px] font-bold tracking-widest"
            >
              <ArrowLeft size={16} />
              Return to library
            </button>
          )}
          {!isFocusMode && (
            <div className="h-6 w-[1px] bg-zinc-800"></div>
          )}
          {!isFocusMode && (
            <div>
              <h2 className="text-2xl font-bold heading-font uppercase tracking-tight text-white">
                {game.title}
              </h2>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={onToggleFocus}
            className={`flex items-center gap-2 px-6 py-2.5 font-bold text-[10px] uppercase tracking-widest transition-all ${isFocusMode ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'}`}
          >
            <Layout size={14} />
            {isFocusMode ? 'Exit Immersive' : 'Immersive Mode'}
          </button>
          
          <button 
            onClick={toggleFullscreen}
            className="p-2.5 bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 transition-all"
            title="Native Fullscreen"
          >
            <Expand size={18} />
          </button>

          {isFocusMode && (
            <button 
              onClick={onToggleFocus}
              className="p-2.5 bg-zinc-900 text-white border border-zinc-800"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Iframe Container */}
      <div className={`relative bg-black flex items-center justify-center overflow-hidden border border-zinc-900 transition-all duration-700 ${isFocusMode ? 'h-full w-full border-none' : 'aspect-video w-full shadow-[0_0_100px_rgba(0,0,0,0.5)]'}`}>
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505] z-10">
            <div className="w-12 h-[2px] bg-zinc-900 mb-6 overflow-hidden">
              <div className="w-1/2 h-full bg-white animate-[loading_1s_infinite]"></div>
            </div>
            <p className="text-zinc-600 text-[9px] uppercase tracking-[0.3em] font-bold">Connecting</p>
          </div>
        )}
        
        <iframe
          ref={iframeRef}
          src={game.iframeUrl}
          className="w-full h-full border-none"
          onLoad={() => setIsLoading(false)}
          allow="fullscreen; autoplay; encrypted-media"
          title={game.title}
        />
      </div>

      {!isFocusMode && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pt-6">
          <div className="md:col-span-3 space-y-6">
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-zinc-900 text-zinc-500 text-[9px] font-bold uppercase tracking-widest border border-zinc-800">{game.category}</span>
              <span className="text-zinc-700 text-[10px] uppercase font-bold tracking-widest">Verified Session</span>
            </div>
            <div className="text-zinc-400 text-sm leading-relaxed max-w-2xl font-medium">
              You are currently viewing a proxied instance of {game.title}. For optimal performance, ensure hardware acceleration is enabled in your browser settings.
            </div>
          </div>
          <div className="space-y-8">
            <div>
              <h4 className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest mb-4">Metadata</h4>
              <div className="space-y-3 font-mono text-[11px] text-zinc-500">
                <div className="flex justify-between border-b border-zinc-900 pb-2">
                  <span>Latency</span>
                  <span className="text-white">Low</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 pb-2">
                  <span>Version</span>
                  <span className="text-white">v2.1</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 pb-2">
                  <span>Source</span>
                  <span className="text-white">CDN_LOCAL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default GamePlayer;
