/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { identifySpecies } from '../services/ai';
import { Sighting } from '../types';
import { Camera, MapPin, Share2, Loader2, Image as ImageIcon, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Wildlife() {
  const [sightings, setSightings] = useState<Sighting[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{ species: string; info: string } | null>(null);

  useEffect(() => {
    setSightings(db.getSightings());
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setAnalyzing(true);
      setResult(null);
      
      const idResult = await identifySpecies(base64);
      setResult(idResult);
      setAnalyzing(false);

      // Save to sightings
      const newSighting: Sighting = {
        id: Date.now().toString(),
        photo: base64,
        speciesName: idResult.species,
        location: { lat: 0, lng: 0, address: "Pacific Northwest" }, // Mocked location
        timestamp: new Date().toISOString(),
        isPublic: false
      };

      const updated = [newSighting, ...sightings];
      setSightings(updated);
      db.saveSightings(updated);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-4">
      {/* Wildlife Journal Card */}
      <div className="zoic-card-green relative overflow-hidden flex flex-col min-h-[300px]">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <Camera size={20} />
            <h3 className="text-lg font-bold">Wildlife Journal</h3>
          </div>
          <p className="text-white/80 text-sm font-medium">Identify and track creatures in the wild.</p>
        </div>

        {/* Mock Map Element from Theme */}
        <div className="flex-grow mt-6 bg-[#E0E7FF] rounded-[16px] relative overflow-hidden bg-[radial-gradient(#94A3B8_1px,transparent_1px)] bg-[size:20px_20px] min-h-[140px] border border-white/10">
          <div className="absolute top-1/2 left-[40%] w-3 h-3 bg-[#F87171] rounded-full border-2 border-white shadow-sm shadow-red-500/50 pulse-animation"></div>
          <div className="absolute bottom-2 left-2 right-2 p-2 bg-white/95 backdrop-blur-md rounded-[8px] text-zoic-dark shadow-xl">
             <p className="text-[10px] whitespace-pre-line leading-tight">
               <strong>Recent:</strong> Red-Tailed Hawk{"\n"}
               Today, 3:45 PM • Blue Trail
             </p>
          </div>
        </div>

        <label className="mt-4 bg-white text-zoic-green py-3 rounded-[12px] font-bold text-center cursor-pointer active:scale-95 transition-transform shadow-lg">
          Scan with Camera
          <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
        </label>
      </div>

      <AnimatePresence>
        {analyzing && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="zoic-card-green bg-zoic-dark flex flex-col items-center gap-4 text-center py-10"
          >
            <Loader2 size={32} className="animate-spin text-zoic-sand-bg" />
            <div>
              <h3 className="text-lg font-bold">Identifying Species...</h3>
              <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mt-1">AI Analysis in progress</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {result && !analyzing && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="zoic-card relative border-2 border-zoic-green"
        >
          <button 
            onClick={() => setResult(null)} 
            className="absolute top-4 right-4 p-2 bg-zoic-sand-bg/20 rounded-full text-zoic-green/40"
          >
            <Plus className="rotate-45" size={20} />
          </button>
          <p className="text-[10px] font-black uppercase text-zoic-green/40 tracking-widest mb-1">Observation Result</p>
          <h3 className="text-2xl font-black">{result.species}</h3>
          <p className="text-zoic-dark/70 font-medium text-sm leading-relaxed mt-2">{result.info}</p>
        </motion.div>
      )}

      {/* Sightings Grid */}
      <div className="grid grid-cols-2 gap-4">
        {sightings.map((s) => (
          <div key={s.id} className="zoic-card p-2 group active:scale-[0.98] transition-transform">
            <div className="aspect-square rounded-[16px] overflow-hidden mb-3">
              <img src={s.photo} alt={s.speciesName} className="w-full h-full object-cover" />
            </div>
            <div className="px-1 pb-1">
              <h4 className="font-bold text-sm truncate">{s.speciesName}</h4>
              <p className="text-[10px] font-bold text-zoic-green/40 uppercase tracking-widest">{new Date(s.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
