/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Play, SkipForward, CheckCircle2 } from 'lucide-react';

const STEPS = [
  { path: '/', label: 'My Animals', description: 'Log daily care for pets and livestock in seconds.', duration: 4000 },
  { path: '/wildlife', label: 'Wildlife Journal', description: 'Identify species instantly with Gemini AI and map sightings.', duration: 5000 },
  { path: '/rescue', label: 'Crisis SOS', description: 'One-tap emergency response for injured or lost animals.', duration: 5000 },
  { path: '/profile', label: 'Pro Ecosystem', description: 'Manage stats, family sync, and data exports.', duration: 4000 },
];

export default function DemoTour({ onFinish }: { onFinish: () => void }) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(-1);

  useEffect(() => {
    if (currentStep === -1) {
      const timer = setTimeout(() => setCurrentStep(0), 1000);
      return () => clearTimeout(timer);
    }

    if (currentStep < STEPS.length) {
      navigate(STEPS[currentStep].path);
      const timer = setTimeout(() => {
        if (currentStep === STEPS.length - 1) {
          onFinish();
        } else {
          setCurrentStep(prev => prev + 1);
        }
      }, STEPS[currentStep].duration);
      return () => clearTimeout(timer);
    }
  }, [currentStep, navigate, onFinish]);

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Cinematic Bars */}
      <motion.div 
        initial={{ height: 0 }} 
        animate={{ height: 60 }} 
        className="absolute top-0 left-0 right-0 bg-zoic-dark z-[101] flex items-center px-6"
      >
        <div className="flex items-center gap-3">
          <Play size={18} className="text-zoic-sand-bg animate-pulse" />
          <span className="text-white text-xs font-black uppercase tracking-[0.3em]">Zoic Feature Tour</span>
        </div>
      </motion.div>

      <motion.div 
        initial={{ height: 0 }} 
        animate={{ height: 100 }} 
        className="absolute bottom-0 left-0 right-0 bg-zoic-dark z-[101] p-6"
      >
        <AnimatePresence mode="wait">
          {currentStep >= 0 && currentStep < STEPS.length && (
            <motion.div 
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex justify-between items-center max-w-md mx-auto"
            >
              <div className="space-y-1">
                <h4 className="text-zoic-sand-bg text-sm font-black uppercase tracking-widest">{STEPS[currentStep].label}</h4>
                <p className="text-white/60 text-[10px] font-bold leading-tight max-w-[200px]">
                  {STEPS[currentStep].description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {STEPS.map((_, i) => (
                    <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === currentStep ? 'w-4 bg-zoic-sand-bg' : 'w-1 bg-white/20'}`} />
                  ))}
                </div>
                <button 
                  onClick={onFinish}
                  className="pointer-events-auto ml-4 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-white text-[10px] font-black uppercase transition-colors"
                >
                  Skip
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Finishing Overlay */}
      <AnimatePresence>
        {currentStep === -1 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-zoic-dark/95 flex flex-col items-center justify-center p-10 text-center z-[110] pointer-events-auto"
          >
            <div className="w-20 h-20 bg-zoic-green rounded-[30px] flex items-center justify-center text-white mb-6 shadow-2xl">
              <Play size={40} fill="currentColor" />
            </div>
            <h2 className="text-3xl font-black text-white italic mb-2 tracking-tighter">PREPARING DEMO</h2>
            <p className="text-zoic-sand-bg/60 text-sm font-medium">Sit back while we walk you through the creature care ecosystem.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
