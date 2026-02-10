import React, { useRef, useState, useEffect } from 'react';
import { Layout, Expand, ArrowLeft, X, ExternalLink } from 'lucide-react';

const GamePlayer = ({ game, onClose, isFocusMode, onToggleFocus }) => {
  const iframeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  const toggleFullscreen = () => {
    if (iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      }
    }
  };

  const getSourceLabel = (url) => {
    if (!url) return "Original Source";
    if (url.includes('yandex.com')) return "Yandex Games";
    if (url.includes('itch.io')) return "Itch.io";
    return "Original Source";
  };

  useEffect(() => {
    const handleEsc = (e) => {
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

  return React.createElement('div', { className: `flex flex-col ${isFocusMode ? 'h-screen w-screen bg-black overflow-hidden' : 'max-w-6xl mx-auto space-y-10'}` },
    React.createElement('div', { className: `flex items-center justify-between ${isFocusMode ? 'fixed top-6 right-6 z-50 opacity-0 hover:opacity-100 transition-opacity gap-4' : 'border-b border-zinc-900 pb-6'}` },
      React.createElement('div', { className: "flex items-center gap-6" },
        !isFocusMode && React.createElement('button', { 
          onClick: onClose,
          className: "group flex items-center gap-2 text-zinc-500 hover:text-white transition-colors uppercase text-[10px] font-bold tracking-widest"
        },
          React.createElement(ArrowLeft, { size: 16 }),
          "Return to library"
        ),
        !isFocusMode && React.createElement('div', { className: "h-6 w-[1px] bg-zinc-800" }),
        !isFocusMode && React.createElement('div', null,
          React.createElement('h2', { className: "text-2xl font-bold heading-font uppercase tracking-tight text-white" }, game.title)
        )
      ),
      React.createElement('div', { className: "flex items-center gap-3" },
        React.createElement('button', { 
          onClick: onToggleFocus,
          className: `flex items-center gap-2 px-6 py-2.5 font-bold text-[10px] uppercase tracking-widest transition-all ${isFocusMode ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'}`
        },
          React.createElement(Layout, { size: 14 }),
          isFocusMode ? 'Exit Immersive' : 'Immersive Mode'
        ),
        React.createElement('button', { 
          onClick: toggleFullscreen,
          className: "p-2.5 bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700 transition-all",
          title: "Native Fullscreen"
        },
          React.createElement(Expand, { size: 18 })
        ),
        isFocusMode && React.createElement('button', { 
          onClick: onToggleFocus,
          className: "p-2.5 bg-zinc-900 text-white border border-zinc-800"
        },
          React.createElement(X, { size: 18 })
        )
      )
    ),
    React.createElement('div', { className: `relative bg-black flex items-center justify-center overflow-hidden border border-zinc-900 transition-all duration-700 ${isFocusMode ? 'h-full w-full border-none' : 'aspect-video w-full shadow-[0_0_100px_rgba(0,0,0,0.5)]'}` },
      isLoading && React.createElement('div', { className: "absolute inset-0 flex flex-col items-center justify-center bg-[#050505] z-10" },
        React.createElement('div', { className: "w-12 h-[2px] bg-zinc-900 mb-6 overflow-hidden" },
          React.createElement('div', { className: "w-1/2 h-full bg-white animate-[loading_1s_infinite]" })
        ),
        React.createElement('p', { className: "text-zinc-600 text-[9px] uppercase tracking-[0.3em] font-bold" }, "Connecting")
      ),
      React.createElement('iframe', {
        ref: iframeRef,
        src: game.iframeUrl,
        className: "w-full h-full border-none",
        onLoad: () => setIsLoading(false),
        allow: "fullscreen; autoplay; encrypted-media",
        title: game.title
      })
    ),
    !isFocusMode && React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-4 gap-12 pt-6" },
      React.createElement('div', { className: "md:col-span-3 space-y-6" },
        React.createElement('div', { className: "flex items-center gap-4" },
          React.createElement('span', { className: "px-3 py-1 bg-zinc-900 text-zinc-500 text-[9px] font-bold uppercase tracking-widest border border-zinc-800" }, game.category),
          React.createElement('span', { className: "text-zinc-700 text-[10px] uppercase font-bold tracking-widest" }, "Verified Session")
        ),
        React.createElement('div', { className: "text-zinc-400 text-sm leading-relaxed max-w-2xl font-medium" }, 
          `You are currently viewing a proxied instance of ${game.title}. For optimal performance, ensure hardware acceleration is enabled in your browser settings.`
        ),
        game.sourceUrl && React.createElement('div', { className: "pt-2" },
          React.createElement('a', { 
            href: game.sourceUrl, 
            target: "_blank", 
            rel: "noopener noreferrer",
            className: "inline-flex items-center gap-3 px-6 py-3 border border-zinc-800 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all group"
          },
            React.createElement(ExternalLink, { size: 14, className: "group-hover:translate-x-0.5 transition-transform" }),
            `Play on ${getSourceLabel(game.sourceUrl)}`
          ),
          React.createElement('p', { className: "text-zinc-600 text-[8px] mt-3 uppercase tracking-widest" }, "Use this if the loading screen is stuck.")
        )
      ),
      React.createElement('div', { className: "space-y-8" },
        React.createElement('div', null,
          React.createElement('h4', { className: "text-zinc-600 text-[10px] uppercase font-bold tracking-widest mb-4" }, "Metadata"),
          React.createElement('div', { className: "space-y-3 font-mono text-[11px] text-zinc-500" },
            React.createElement('div', { className: "flex justify-between border-b border-zinc-900 pb-2" },
              React.createElement('span', null, "Latency"),
              React.createElement('span', { className: "text-white" }, "Low")
            ),
            React.createElement('div', { className: "flex justify-between border-b border-zinc-900 pb-2" },
              React.createElement('span', null, "Version"),
              React.createElement('span', { className: "text-white" }, "v2.1")
            ),
            React.createElement('div', { className: "flex justify-between border-b border-zinc-900 pb-2" },
              React.createElement('span', null, "Source"),
              React.createElement('span', { className: "text-white" }, "CDN_LOCAL")
            )
          )
        )
      )
    ),
    React.createElement('style', null, `
      @keyframes loading {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(200%); }
      }
    `)
  );
};

export default GamePlayer;