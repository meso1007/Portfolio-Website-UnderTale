import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { playSave, playMenuMove, playConfirm, playSelect } from '../utils/sound';
import { Typewriter } from './Typewriter';
import { GuestbookEntry } from '../types';

// Mock Initial Data
const INITIAL_ENTRIES: GuestbookEntry[] = [
  { id: 1, name: "Papyrus", message: "NYEH HEH HEH!", date: "202X-01-01" },
  { id: 2, name: "Sans", message: "cool website. i guess.", date: "202X-01-02" },
];

export const SavePoint: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [entries, setEntries] = useState<GuestbookEntry[]>(INITIAL_ENTRIES);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [view, setView] = useState<'MENU' | 'GUESTBOOK'>('MENU');

  // Simulate fetching from Go backend on mount
  useEffect(() => {
    const saved = localStorage.getItem('undertale_guestbook');
    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;

    playSave();
    
    const newEntry: GuestbookEntry = {
      id: Date.now(),
      name: name.toUpperCase(), // Undertale style
      message,
      date: new Date().toISOString().split('T')[0]
    };

    const newEntries = [newEntry, ...entries].slice(0, 10); // Keep last 10
    setEntries(newEntries);
    localStorage.setItem('undertale_guestbook', JSON.stringify(newEntries));
    
    setName("");
    setMessage("");
    setView('MENU'); // Return to save confirmation screen
  };

  const handleOpen = () => {
    playSave();
    setIsOpen(true);
  };

  const handleClose = () => {
    playConfirm();
    setIsOpen(false);
    setView('MENU');
  };

  return (
    <>
      {/* The Yellow Star */}
      <button 
        className="fixed bottom-8 right-8 text-ut-yellow animate-pulse hover:scale-110 transition-transform z-40 group"
        onClick={handleOpen}
        onMouseEnter={() => playMenuMove()}
      >
        <Star className="w-8 h-8 fill-ut-yellow" />
        <span className="absolute -top-8 right-0 font-pixel text-xs bg-black border border-white px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          SAVE
        </span>
      </button>

      {/* The Save Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg border-4 border-white bg-black p-6 relative">
            
            {/* Header */}
            <div className="flex justify-between items-baseline mb-6 border-b-2 border-white pb-2">
               <span className="font-8bit text-ut-yellow text-lg">
                  {view === 'MENU' ? 'SAVE POINT' : 'GUESTBOOK'}
               </span>
               <span className="font-pixel text-gray-400 text-sm">
                 {view === 'MENU' ? 'LV 19' : `${entries.length} ENTRIES`}
               </span>
            </div>

            {view === 'MENU' && (
              <div className="space-y-6">
                <div className="font-pixel text-xl leading-relaxed">
                  <Typewriter text="* Seeing the clean code fills you with DETERMINATION." speed={20} />
                </div>
                <div className="flex justify-between gap-4 mt-8">
                   <button 
                    onClick={() => { playConfirm(); setView('GUESTBOOK'); }}
                    className="flex-1 border-2 border-white py-3 hover:bg-ut-yellow hover:text-black hover:border-ut-yellow font-8bit text-sm transition-colors"
                    onMouseEnter={() => playSelect()}
                   >
                     SIGN GUESTBOOK
                   </button>
                   <button 
                    onClick={handleClose}
                    className="flex-1 border-2 border-white py-3 hover:bg-white hover:text-black font-8bit text-sm transition-colors"
                    onMouseEnter={() => playSelect()}
                   >
                     RETURN
                   </button>
                </div>
                <div className="text-center text-xs font-pixel text-gray-500 mt-4">
                  * (Connected to Backend API: Local Mode)
                </div>
              </div>
            )}

            {view === 'GUESTBOOK' && (
               <div className="flex flex-col h-[400px]">
                 {/* Form */}
                 <form onSubmit={handleSave} className="mb-6 space-y-3">
                    <div>
                       <input 
                         type="text" 
                         placeholder="YOUR NAME" 
                         maxLength={12}
                         className="w-full bg-black border-b-2 border-gray-600 p-2 font-8bit text-sm text-white placeholder-gray-600 focus:border-ut-yellow focus:outline-none uppercase"
                         value={name}
                         onChange={e => setName(e.target.value)}
                         onClick={() => playSelect()}
                       />
                    </div>
                    <div>
                       <textarea 
                         placeholder="MESSAGE (MAX 50 CHARS)" 
                         maxLength={50}
                         rows={2}
                         className="w-full bg-black border-b-2 border-gray-600 p-2 font-pixel text-lg text-white placeholder-gray-600 focus:border-ut-yellow focus:outline-none resize-none"
                         value={message}
                         onChange={e => setMessage(e.target.value)}
                         onClick={() => playSelect()}
                       />
                    </div>
                    <button 
                      type="submit"
                      disabled={!name || !message}
                      className="w-full bg-ut-yellow text-black font-8bit py-2 text-xs disabled:opacity-50 hover:opacity-90"
                    >
                      SAVE RECORD
                    </button>
                 </form>

                 {/* List */}
                 <div className="flex-1 overflow-y-auto custom-scrollbar border-t border-white/20 pt-4 space-y-4">
                    {entries.map(entry => (
                      <div key={entry.id} className="font-pixel">
                         <div className="flex justify-between text-ut-yellow text-sm">
                            <span>{entry.name}</span>
                            <span className="text-gray-500 text-xs">{entry.date}</span>
                         </div>
                         <div className="text-white pl-2 border-l-2 border-gray-800 ml-1 mt-1">
                           {entry.message}
                         </div>
                      </div>
                    ))}
                 </div>

                 <button 
                   onClick={() => setView('MENU')}
                   className="mt-4 text-gray-400 hover:text-white font-pixel text-sm text-center"
                 >
                   [ BACK ]
                 </button>
               </div>
            )}

          </div>
        </div>
      )}
    </>
  );
};