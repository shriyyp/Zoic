/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { UserProfile } from '../types';
import { Settings, ShieldCheck, Download, Share2, LogOut, Award, Star, ChevronRight, Play } from 'lucide-react';
import { motion } from 'motion/react';

export default function Profile({ onLaunchDemo }: { onLaunchDemo?: () => void }) {
  const [profile, setProfile] = useState<UserProfile>(db.getProfile());
  const [stats, setStats] = useState({ animals: 0, sightings: 0 });

  useEffect(() => {
    setStats({
      animals: db.getAnimals().length,
      sightings: db.getSightings().length
    });
  }, []);

  return (
    <div className="space-y-4">
      {/* Profile Header Card */}
      <div className="zoic-card flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <div className="w-14 h-14 bg-zoic-green rounded-[16px] flex items-center justify-center text-white text-xl font-bold shadow-md">
            {profile.name[0]}
          </div>
          <div>
            <h2 className="text-xl font-bold leading-tight">{profile.name}</h2>
            <p className="text-[10px] font-black uppercase text-zoic-green tracking-widest">
              {profile.isPro ? 'Pro Member' : 'Free Account'}
            </p>
          </div>
        </div>
        <button className="p-3 bg-zoic-sand-bg/20 rounded-xl text-zoic-green">
          <Settings size={20} />
        </button>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="zoic-card flex flex-col justify-between min-h-[120px]">
          <div>
            <p className="text-[10px] font-black uppercase text-zoic-green/40 tracking-widest mb-1">Active Herd</p>
            <p className="text-4xl font-bold text-zoic-green">24</p>
          </div>
          <p className="text-[11px] font-semibold opacity-60">Heifers & Sheep</p>
        </div>
        <div className="zoic-card flex flex-col justify-between min-h-[120px] bg-white">
          <div>
            <p className="text-[10px] font-black uppercase text-zoic-green/40 tracking-widest mb-1">Journaled</p>
            <p className="text-4xl font-bold text-zoic-dark">{stats.sightings}</p>
          </div>
          <p className="text-[11px] font-semibold opacity-60">Sightings Logged</p>
        </div>
      </div>

      {/* Upgrade Callout */}
      {!profile.isPro && (
        <div className="zoic-card-green bg-gradient-to-br from-zoic-green to-[#1B2E19] flex flex-col gap-4">
           <div>
             <h3 className="text-lg font-bold">Go Unlimited</h3>
             <p className="text-white/70 text-xs font-medium leading-relaxed">Get family sync, unlimited animals & PDF reports.</p>
           </div>
           <button className="bg-white text-zoic-green py-3 rounded-xl font-bold text-sm shadow-xl active:scale-95 transition-transform">
             Upgrade to Pro
           </button>
        </div>
      )}

      {/* Settings Options */}
      <div className="zoic-card p-0 overflow-hidden divide-y divide-zoic-sand-bg/50">
        <button 
          onClick={onLaunchDemo}
          className="w-full flex items-center justify-between p-5 bg-zoic-green text-white hover:bg-zoic-green/90 transition-colors group"
        >
          <div className="flex items-center gap-4">
            <div className="p-2.5 rounded-lg bg-white/20">
              <Play size={18} fill="currentColor" />
            </div>
            <div className="text-left">
              <p className="font-bold text-sm">Watch Guided Tour</p>
              <p className="text-[10px] font-bold opacity-70 uppercase tracking-wider">Auto-Play App Features</p>
            </div>
          </div>
          <ChevronRight size={14} className="opacity-40" />
        </button>
        <MenuOption icon={<Download size={18} />} title="Export Data" subtitle="CSV / PDF formats" />
        <MenuOption icon={<Share2 size={18} />} title="Community Map" subtitle="Control visibility" />
        <MenuOption icon={<LogOut size={18} />} title="Sign Out" danger />
      </div>
    </div>
  );
}

function MenuOption({ icon, title, subtitle, danger }: { icon: React.ReactNode, title: string, subtitle?: string, danger?: boolean }) {
  return (
    <button className="w-full flex items-center justify-between p-5 hover:bg-zoic-sand-bg/10 transition-colors group">
      <div className="flex items-center gap-4">
        <div className={`p-2.5 rounded-lg ${danger ? 'bg-red-50 text-red-500' : 'bg-zoic-sand-bg/30 text-zoic-green'}`}>
          {icon}
        </div>
        <div className="text-left">
          <p className={`font-bold text-sm ${danger ? 'text-red-500' : 'text-zoic-dark'}`}>{title}</p>
          {subtitle && <p className="text-[10px] font-bold opacity-40 uppercase tracking-wider">{subtitle}</p>}
        </div>
      </div>
      <ChevronRight size={14} className="opacity-20 group-hover:opacity-60 transition-opacity" />
    </button>
  );
}
