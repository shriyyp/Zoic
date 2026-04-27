/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Animal, AnimalCategory } from '../types';
import { PawPrint, Calendar, ArrowRight, CheckCircle2, Plus } from 'lucide-react';
import { motion } from 'motion/react';

export default function MyAnimals() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    const data = db.getAnimals();
    if (data.length === 0) {
      // Add a demo animal if empty
      const demo: Animal = {
        id: 'demo-1',
        name: 'Milo',
        species: 'Domestic Shorthair',
        category: AnimalCategory.MAMMAL,
        reminders: [
          { id: 'rem-1', title: 'Afternoon feeding', type: 'feeding', frequency: 'daily' },
        ],
        logs: [{ id: '1', type: 'Fed', timestamp: new Date(Date.now() - 3600000).toISOString() }],
        createdAt: new Date().toISOString(),
      };
      db.saveAnimals([demo]);
      setAnimals([demo]);
    } else {
      setAnimals(data);
    }
  }, []);

  const handleQuickLog = (animalId: string, type: string) => {
    const updated = animals.map(a => {
      if (a.id === animalId) {
        return {
          ...a,
          logs: [{ id: Date.now().toString(), type, timestamp: new Date().toISOString() }, ...a.logs]
        };
      }
      return a;
    });
    setAnimals(updated);
    db.saveAnimals(updated);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Main Animals Card */}
        <div className="zoic-card space-y-4 h-full">
          <div className="flex items-center gap-2 mb-2">
             <div className="text-zoic-green"><PawPrint size={20} /></div>
             <h3 className="text-lg font-bold">My Animals</h3>
          </div>
          
          <div className="space-y-3">
            {animals.map((animal) => (
              <motion.div 
                key={animal.id}
                layout
                className="flex items-center gap-4 p-3 bg-[#F8F5F0] rounded-[16px]"
              >
                <div className="w-12 h-12 rounded-xl bg-[#D1C4AC] flex items-center justify-center text-xl">
                  {animal.category === AnimalCategory.MAMMAL ? '🐈' : animal.category === AnimalCategory.BIRD ? '🦜' : '🦎'}
                </div>
                <div className="flex-grow">
                  <div className="font-bold text-sm">{animal.name}</div>
                  <div className="text-[11px] opacity-60 font-semibold">{animal.species} • 4yo</div>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  {animal.logs.length > 0 ? (
                    <div className="status-pill status-pill-green">
                      {animal.logs[0].type} 1h ago
                    </div>
                  ) : (
                    <div className="status-pill status-pill-amber">Needs check</div>
                  )}
                  <div className="text-[10px] opacity-60 font-bold uppercase">Next: 7:00 PM</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-[#F1F5F9] rounded-[16px] flex items-center justify-between">
            <div>
              <div className="font-bold text-sm">Family Sync Active</div>
              <div className="text-[11px] opacity-60 font-semibold">Sarah & Tom are also caring</div>
            </div>
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full bg-zoic-green border-2 border-white"></div>
              <div className="w-6 h-6 rounded-full bg-zoic-sand-bg border-2 border-white"></div>
            </div>
          </div>
        </div>

        {/* Action Grid (Bento style) */}
        <div className="grid grid-cols-2 gap-4">
          <button 
             onClick={() => setShowAdd(true)}
             className="zoic-card p-6 flex flex-col items-center justify-center gap-2 bg-white text-zoic-green active:scale-95 transition-transform"
          >
            <div className="p-3 bg-zoic-sand-bg/30 rounded-2xl">
              <Plus size={24} />
            </div>
            <span className="font-bold text-xs uppercase tracking-wider">Add Creature</span>
          </button>
          
          <div className="zoic-card p-6 flex flex-col justify-between">
             <div>
               <p className="text-[10px] font-black uppercase text-zoic-green/40 tracking-widest mb-1">Global Stats</p>
               <p className="text-3xl font-black text-zoic-dark">1.2k</p>
             </div>
             <p className="text-[10px] font-bold text-zoic-dark/40 leading-tight">Species identified this week</p>
          </div>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center sm:items-center p-4">
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            className="bg-white w-full max-w-md rounded-t-[3rem] sm:rounded-[3rem] p-8 space-y-6"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black">Add Animal</h3>
              <button onClick={() => setShowAdd(false)} className="text-zoic-green/40 font-bold">Cancel</button>
            </div>
            <p className="text-zoic-green/60 italic text-sm">Feature coming soon in this demo. For now, enjoy the quick logs!</p>
            <div className="h-40 bg-zoic-sand-light rounded-3xl flex items-center justify-center border-2 border-dashed border-zoic-sand">
              <p className="text-zoic-green/40 font-bold">Animal Information Form</p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function LogButton({ label, onClick, lastTime }: { label: string, onClick: () => void, lastTime?: string }) {
  const timeStr = lastTime ? new Date(lastTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null;

  return (
    <button 
      onClick={onClick}
      className="flex-shrink-0 bg-zoic-sand-light hover:bg-zoic-sand px-4 py-2 rounded-2xl border border-zoic-sand transition-colors text-left min-w-[100px]"
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-black uppercase text-zoic-green/60">{label}</span>
        {timeStr && <CheckCircle2 size={12} className="text-zoic-green" />}
      </div>
      <span className="text-[10px] font-bold block h-3">
        {timeStr ? `Last: ${timeStr}` : 'Not logged'}
      </span>
    </button>
  );
}
