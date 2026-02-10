import React, { useState, useEffect } from 'react';
import { X, Send, Terminal, FileJson, Download, Database, Settings, Trash2, Globe, AlertCircle } from 'lucide-react';

const SubmitModal = ({ onClose, onSubmit }) => {
  const [activeTab, setActiveTab] = useState('transmit');
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    category: 'Arcade'
  });
  const [requests, setRequests] = useState([]);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    // Load local logs
    const logs = JSON.parse(localStorage.getItem('fletch_requests') || '[]');
    setRequests(logs.slice().reverse());
    
    // Load webhook
    const savedWebhook = localStorage.getItem('fletch_webhook_url') || '';
    setWebhookUrl(savedWebhook);
  }, []);

  const isAdminTrigger = formData.title.toLowerCase() === 'admin';

  const handleTransmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.url) return;
    setIsSending(true);
    await onSubmit(formData);
    
    // Refresh local requests after submit
    const logs = JSON.parse(localStorage.getItem('fletch_requests') || '[]');
    setRequests(logs.slice().reverse());
    
    setIsSending(false);
    setFormData({ title: '', url: '', category: 'Arcade' });
  };

  const saveWebhook = () => {
    localStorage.setItem('fletch_webhook_url', webhookUrl);
    alert("SYSTEM: WEBHOOK CONFIGURATION UPDATED.");
  };

  const clearLogs = () => {
    if (confirm("CRITICAL: PURGE ALL SYSTEM LOGS? THIS CANNOT BE UNDONE.")) {
      localStorage.setItem('fletch_requests', '[]');
      setRequests([]);
    }
  };

  const deleteRequest = (id) => {
    const rawLogs = JSON.parse(localStorage.getItem('fletch_requests') || '[]');
    const updated = rawLogs.filter(r => r.id !== id);
    localStorage.setItem('fletch_requests', JSON.stringify(updated));
    setRequests(updated.slice().reverse());
  };

  const exportAllRequests = () => {
    const blob = new Blob([JSON.stringify(requests, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fletch_logs_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
  };

  return React.createElement('div', { 
    className: "fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-6 bg-black/95 backdrop-blur-md animate-in fade-in duration-300"
  },
    React.createElement('div', { 
      className: `relative w-full ${activeTab === 'system' ? 'max-w-4xl' : 'max-w-xl'} bg-[#0a0a0a] border border-zinc-800 shadow-[0_0_100px_rgba(220,38,38,0.15)] overflow-hidden transition-all duration-500`
    },
      React.createElement('div', { className: "fnaf-static-overlay pointer-events-none opacity-5" }),
      
      // Top Navigation
      React.createElement('div', { className: "flex items-center justify-between p-4 border-b border-zinc-900 bg-zinc-900/20" },
        React.createElement('div', { className: "flex gap-6" },
          React.createElement('button', { 
            onClick: () => setActiveTab('transmit'),
            className: `flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${activeTab === 'transmit' ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'}`
          }, 
            React.createElement(Terminal, { size: 14 }),
            "Transmit"
          ),
          React.createElement('button', { 
            onClick: () => setActiveTab('system'),
            className: `flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${activeTab === 'system' ? 'text-red-500' : 'text-zinc-600 hover:text-zinc-400'}`
          }, 
            React.createElement(Database, { size: 14 }),
            "System Log"
          )
        ),
        React.createElement('button', { 
          onClick: onClose,
          className: "p-1 text-zinc-500 hover:text-white transition-colors"
        }, React.createElement(X, { size: 20 }))
      ),

      activeTab === 'transmit' ? (
        // TRANSMIT FORM
        React.createElement('form', { 
          onSubmit: handleTransmit,
          className: "p-8 space-y-8"
        },
          React.createElement('div', { className: "space-y-6" },
            isAdminTrigger && React.createElement('div', { className: "p-3 bg-red-900/10 border border-red-900/30 flex items-center gap-3 animate-pulse" },
              React.createElement(AlertCircle, { size: 16, className: "text-red-600" }),
              React.createElement('span', { className: "text-[9px] font-bold text-red-600 uppercase tracking-widest" }, "Admin override detected. Access System Log tab.")
            ),
            React.createElement('div', { className: "space-y-2" },
              React.createElement('label', { className: "text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]" }, "Identification // Title"),
              React.createElement('input', {
                required: true,
                type: "text",
                placeholder: "Game Name",
                className: "w-full p-4 bg-zinc-900/30 border border-zinc-800 text-white placeholder-zinc-800 focus:outline-none focus:border-red-600 transition-colors text-sm rounded-none font-mono",
                value: formData.title,
                onChange: (e) => setFormData({...formData, title: e.target.value})
              })
            ),
            React.createElement('div', { className: "space-y-2" },
              React.createElement('label', { className: "text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]" }, "Source // URL"),
              React.createElement('input', {
                required: true,
                type: "url",
                placeholder: "https://...",
                className: "w-full p-4 bg-zinc-900/30 border border-zinc-800 text-white placeholder-zinc-800 focus:outline-none focus:border-red-600 transition-colors text-sm rounded-none font-mono",
                value: formData.url,
                onChange: (e) => setFormData({...formData, url: e.target.value})
              })
            ),
            React.createElement('div', { className: "space-y-2" },
              React.createElement('label', { className: "text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em]" }, "Classification"),
              React.createElement('select', {
                className: "w-full p-4 bg-zinc-900/30 border border-zinc-800 text-white focus:outline-none focus:border-red-600 transition-colors text-sm rounded-none appearance-none font-mono",
                value: formData.category,
                onChange: (e) => setFormData({...formData, category: e.target.value})
              },
                ['Arcade', 'Action', 'FNAF', 'Horror', 'Strategy'].map(cat => 
                  React.createElement('option', { key: cat, value: cat, className: "bg-[#0a0a0a]" }, cat)
                )
              )
            )
          ),
          React.createElement('button', {
            type: "submit",
            disabled: isSending,
            className: `w-full px-8 py-4 ${isSending ? 'bg-zinc-800 text-zinc-500' : 'bg-red-600 text-white hover:bg-red-700'} font-black uppercase tracking-[0.2em] text-[10px] transition-all active:scale-95 shadow-[0_0_30px_rgba(220,38,38,0.2)] flex items-center justify-center gap-3`
          }, 
            isSending ? React.createElement('div', { className: "w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" }) : React.createElement(Send, { size: 14 }),
            isSending ? "UPLOADING TO BUFFER..." : "Transmit Request"
          )
        )
      ) : (
        // SYSTEM LOG / ADMIN PANEL
        React.createElement('div', { className: "p-6 md:p-10 flex flex-col md:flex-row gap-10 max-h-[80vh] overflow-y-auto" },
          // Left: Webhook Settings
          React.createElement('div', { className: "md:w-1/3 space-y-8" },
            React.createElement('div', { className: "space-y-4" },
              React.createElement('div', { className: "flex items-center gap-2 text-zinc-400" },
                React.createElement(Settings, { size: 14 }),
                React.createElement('h4', { className: "text-[10px] font-black uppercase tracking-widest" }, "Global Webhook")
              ),
              React.createElement('p', { className: "text-[9px] text-zinc-600 leading-relaxed uppercase tracking-tight" }, 
                "Connect to Discord for global alerts. This is required if you want to see submissions from other people."
              ),
              React.createElement('input', {
                type: "password",
                placeholder: "Discord Webhook URL",
                className: "w-full p-3 bg-zinc-900 border border-zinc-800 text-white text-[10px] font-mono focus:border-red-600 outline-none transition-all",
                value: webhookUrl,
                onChange: (e) => setWebhookUrl(e.target.value)
              }),
              React.createElement('button', {
                onClick: saveWebhook,
                className: "w-full py-2 bg-zinc-800 text-white text-[9px] font-black uppercase tracking-widest hover:bg-zinc-700 transition-colors"
              }, "Save Config")
            ),
            React.createElement('div', { className: "pt-6 border-t border-zinc-900 space-y-3" },
              React.createElement('button', { 
                onClick: exportAllRequests,
                className: "w-full flex items-center justify-center gap-2 py-2 border border-zinc-800 text-zinc-400 text-[9px] font-black uppercase tracking-widest hover:text-white transition-colors"
              }, 
                React.createElement(Download, { size: 12 }),
                "Export Log"
              ),
              React.createElement('button', { 
                onClick: clearLogs,
                className: "w-full flex items-center justify-center gap-2 py-2 border border-red-900/30 text-red-900 text-[9px] font-black uppercase tracking-widest hover:text-red-600 transition-colors"
              }, 
                React.createElement(Trash2, { size: 12 }),
                "Purge Data"
              )
            )
          ),

          // Right: Request List
          React.createElement('div', { className: "flex-1 space-y-6" },
             React.createElement('div', { className: "flex items-center justify-between border-b border-zinc-900 pb-4" },
               React.createElement('h4', { className: "text-[10px] font-black uppercase tracking-widest text-zinc-500" }, "Local Transmission History"),
               React.createElement('span', { className: "text-[9px] font-mono text-zinc-700" }, `${requests.length} ENTRIES`)
             ),
             React.createElement('div', { className: "space-y-3" },
               requests.length === 0 ? React.createElement('div', { className: "py-20 text-center border border-zinc-900/50 text-[10px] text-zinc-700 uppercase font-mono" }, "No local data in buffer")
               : requests.map(req => 
                  React.createElement('div', { key: req.id, className: "p-4 bg-zinc-900/20 border border-zinc-900 group flex justify-between items-start" },
                    React.createElement('div', { className: "space-y-1" },
                      React.createElement('div', { className: "flex items-center gap-3" },
                        React.createElement('span', { className: "text-white text-xs font-bold font-mono" }, req.title),
                        React.createElement('span', { className: "text-[8px] bg-zinc-900 px-1.5 py-0.5 text-zinc-500 font-bold border border-zinc-800" }, req.category)
                      ),
                      React.createElement('div', { className: "flex items-center gap-2 text-[9px] text-zinc-600 font-mono" },
                        React.createElement(Globe, { size: 10 }),
                        React.createElement('span', { className: "truncate max-w-[200px]" }, req.url)
                      ),
                      React.createElement('div', { className: "text-[8px] text-zinc-800 font-mono" }, 
                        new Date(req.timestamp).toLocaleString()
                      )
                    ),
                    React.createElement('button', { 
                      onClick: () => deleteRequest(req.id),
                      className: "opacity-0 group-hover:opacity-100 p-2 text-zinc-700 hover:text-red-600 transition-all"
                    }, React.createElement(Trash2, { size: 14 }))
                  )
               )
             )
          )
        )
      )
    )
  );
};

export default SubmitModal;