/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { analyzeEmergency } from '../services/ai';
import { SOSAlert, InjuryType, Rescuer } from '../types';
import { AlertCircle, Camera, MapPin, Loader2, Heart, Phone, ShieldAlert, CheckCircle2, ChevronRight, WifiOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Rescue() {
  const [isEmergency, setIsEmergency] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'PHOTO' | 'INJURY' | 'SENDING' | 'DONE'>('PHOTO');
  const [selectedInjury, setSelectedInjury] = useState<InjuryType>('other');
  const [currentAlert, setCurrentAlert] = useState<SOSAlert | null>(null);
  const [nearbyRescuers, setNearbyRescuers] = useState<Rescuer[]>([]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleStatusChange = () => setIsOffline(!navigator.onLine);
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  const handleSOSInit = () => {
    setIsEmergency(true);
    setStep('PHOTO');
  };

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setPhoto(event.target?.result as string);
      setStep('INJURY');
    };
    reader.readAsDataURL(file);
  };

  const submitSOS = async () => {
    setLoading(true);
    setStep('SENDING');

    let aiResult = { label: 'Animal', confidence: 0.85, advice: 'Keep stable' };
    if (photo) {
      aiResult = await analyzeEmergency(photo);
    }

    const newAlert: SOSAlert = {
      id: `sos-${Date.now()}`,
      userId: 'user-1',
      photoUrl: photo || '',
      gps: {
        lat: 45.523062,
        lng: -122.676482,
        address: 'Downtown Portland, OR'
      },
      speciesGuess: {
        label: aiResult.label,
        confidence: aiResult.confidence
      },
      injuryType: selectedInjury,
      status: isOffline ? 'PENDING' : 'PENDING',
      timestamp: new Date().toISOString(),
      assignedTo: null,
      isOffline: isOffline
    };

    db.saveSOSAlert(newAlert);
    setCurrentAlert(newAlert);

    // Simulate server processing/matching
    if (!isOffline) {
      await new Promise(r => setTimeout(r, 2000));
      setNearbyRescuers(db.getMockRescuers());
    }

    setLoading(false);
    setStep('DONE');
  };

  return (
    <div className="space-y-6 pb-10">
      <AnimatePresence mode="wait">
        {!isEmergency ? (
          <motion.div 
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="zoic-card bg-[#FFF1F1] border-2 border-red-100 p-8 flex flex-col items-center gap-6">
              <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-red-500/20 active:scale-95 transition-transform cursor-pointer" onClick={handleSOSInit}>
                <ShieldAlert size={40} />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-black text-red-600">ONE-TAP SOS</h2>
                <p className="text-sm font-bold text-red-600/60 mt-1 uppercase tracking-widest">Immediate Animal Emergency</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
               <h3 className="text-xs font-black uppercase text-zoic-green/40 tracking-[0.2em] px-2 text-center">Protocol Reminders</h3>
               <div className="zoic-card p-4 flex items-center gap-4">
                 <div className="p-3 bg-red-50 text-red-500 rounded-xl"><MapPin size={20} /></div>
                 <p className="text-xs font-bold leading-tight">Always check your location before approaching injured wildlife.</p>
               </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="emergency"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            {/* Step Indicators */}
            <div className="flex gap-2 mb-2">
              {['PHOTO', 'INJURY', 'SENDING', 'DONE'].map((s, i) => (
                <div key={s} className={`h-1.5 flex-grow rounded-full transition-colors ${
                  step === s ? 'bg-red-500' : i < ['PHOTO', 'INJURY', 'SENDING', 'DONE'].indexOf(step) ? 'bg-red-200' : 'bg-gray-200'
                }`} />
              ))}
            </div>

            {step === 'PHOTO' && (
              <div className="zoic-card p-0 overflow-hidden min-h-[400px] flex flex-col">
                <div className="bg-zoic-dark p-6 text-white flex justify-between items-center">
                  <h3 className="font-bold">Capture Evidence</h3>
                  <button onClick={() => setIsEmergency(false)} className="opacity-60 text-xs font-bold uppercase">Cancel</button>
                </div>
                <div className="flex-grow flex flex-col items-center justify-center p-10 text-center gap-6">
                   <div className="w-24 h-24 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[30px] flex items-center justify-center text-gray-400">
                     <Camera size={32} />
                   </div>
                   <p className="text-sm font-bold opacity-40">Please take a clear photo of the animal from a safe distance.</p>
                   <label className="bg-red-500 text-white px-10 py-5 rounded-[20px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-transform cursor-pointer">
                     Take Photo
                     <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoCapture} />
                   </label>
                </div>
              </div>
            )}

            {step === 'INJURY' && (
              <div className="zoic-card space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100">
                    <img src={photo!} alt="Current" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold">Nature of Injury</h3>
                    <p className="text-xs opacity-40 font-bold uppercase">Select most accurate state</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {(['bleeding', 'limping', 'unconscious', 'trapped', 'other'] as InjuryType[]).map(t => (
                    <button 
                      key={t}
                      onClick={() => setSelectedInjury(t)}
                      className={`p-4 rounded-[16px] text-xs font-black uppercase tracking-wider border-2 transition-all ${
                        selectedInjury === t ? 'bg-red-500 text-white border-red-500 shadow-lg' : 'bg-[#F8F5F0] border-transparent text-gray-400'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={submitSOS}
                  className="w-full bg-zoic-dark text-white p-6 rounded-[24px] font-black uppercase tracking-[3px] shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-2"
                >
                  Confirm & Broadcast
                </button>
              </div>
            )}

            {step === 'SENDING' && (
              <div className="zoic-card p-12 text-center space-y-6">
                <div className="flex justify-center">
                  <Loader2 className="animate-spin text-red-500" size={60} />
                </div>
                <div>
                   <h3 className="text-2xl font-black italic">ALERTING HELP...</h3>
                   <p className="text-sm font-bold opacity-40 mt-2">Connecting to nearby rescuers and vets</p>
                </div>
              </div>
            )}

            {step === 'DONE' && (
              <div className="space-y-4">
                <div className="zoic-card bg-zoic-green text-white p-8 space-y-4 relative overflow-hidden">
                  <div className="relative z-10 flex items-center gap-4">
                    <CheckCircle2 size={32} />
                    <div>
                      <h3 className="text-xl font-bold">SOS BROADCASTED</h3>
                      <p className="text-xs font-bold opacity-70 uppercase tracking-widest">{isOffline ? 'Queued Offline - Syncing...' : 'Live & Active'}</p>
                    </div>
                  </div>
                  
                  {isOffline && (
                    <div className="bg-white/10 p-4 rounded-xl flex items-center gap-3">
                      <WifiOff size={18} />
                      <p className="text-[10px] font-black uppercase">Saved locally. Will send automatically when signal returns.</p>
                    </div>
                  )}

                  {!isOffline && (
                    <div className="bg-white p-4 rounded-2xl text-zoic-dark">
                      <p className="text-[10px] font-black uppercase opacity-40 mb-2">AI Analysis</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold">{currentAlert?.speciesGuess.label}</span>
                        <span className="bg-zoic-green/10 px-2 py-1 rounded-lg text-[10px] font-black">{(currentAlert?.speciesGuess.confidence! * 100).toFixed(0)}% Match</span>
                      </div>
                    </div>
                  )}
                </div>

                {!isOffline && (
                  <div className="zoic-card space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest opacity-40">Matched Rescuers</h4>
                    <div className="space-y-2">
                       {nearbyRescuers.map(r => (
                         <div key={r.id} className="flex items-center justify-between p-4 bg-[#F8F5F0] rounded-[16px]">
                           <div className="flex items-center gap-3">
                             <div className={`p-2 rounded-lg ${r.type === 'VET' ? 'bg-blue-100 text-blue-500' : 'bg-red-100 text-red-500'}`}>
                               <Phone size={16} />
                             </div>
                             <div>
                               <p className="text-xs font-bold">{r.name}</p>
                               <p className="text-[10px] font-bold opacity-40">{r.type}</p>
                             </div>
                           </div>
                           <ChevronRight size={14} className="opacity-20" />
                         </div>
                       ))}
                    </div>
                  </div>
                )}

                <button 
                  onClick={() => setIsEmergency(false)}
                  className="w-full py-4 text-xs font-black uppercase text-zoic-green/40 active:scale-95 transition-transform"
                >
                  Return to Dashboard
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
