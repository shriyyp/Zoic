/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Home, Camera, LifeBuoy, User, PlusCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import ZoicAssistant from './ZoicAssistant';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Layout({ onLaunchDemo }: { onLaunchDemo?: () => void }) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-zoic-sand-bg">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row min-h-screen relative">
        
        {/* Nav for Desktop - Sidebar style */}
        <aside className="hidden md:flex flex-col w-64 bg-zoic-dark p-8 text-white sticky top-0 h-screen">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-zoic-green rounded-[10px] flex items-center justify-center text-white shadow-sm">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 20a2 2 0 1 0 4 0 2 2 0 1 0-4 0M7 16a2 2 0 1 0 4 0 2 2 0 1 0-4 0M13 12a2 2 0 1 0 4 0 2 2 0 1 0-4 0M17 8a2 2 0 1 0 4 0 2 2 0 1 0-4 0"/>
              </svg>
            </div>
            <h1 className="text-2xl font-black italic tracking-tighter">Zoic</h1>
          </div>
          
          <nav className="flex flex-col gap-4">
            <DesktopNavTab to="/" icon={<Home size={22} />} label="My Animals" />
            <DesktopNavTab to="/wildlife" icon={<Camera size={22} />} label="Wildlife Journal" />
            <DesktopNavTab to="/rescue" icon={<LifeBuoy size={22} />} label="Crisis SOS" />
            <DesktopNavTab to="/profile" icon={<User size={22} />} label="My Profile" />
          </nav>

          <div className="mt-auto">
            <button 
              onClick={onLaunchDemo}
              className="w-full bg-white/10 hover:bg-white/20 p-4 rounded-[20px] text-xs font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
            >
              Take the Tour
            </button>
          </div>
        </aside>

        {/* Content Container */}
        <div className="flex-grow pb-32 md:pb-8 md:pt-8 md:px-8 max-w-2xl mx-auto w-full">
          {/* Top Header (Mobile Only) */}
          <header className="px-6 py-8 flex justify-between items-center md:hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-zoic-green rounded-[10px] flex items-center justify-center text-white shadow-sm">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 20a2 2 0 1 0 4 0 2 2 0 1 0-4 0M7 16a2 2 0 1 0 4 0 2 2 0 1 0-4 0M13 12a2 2 0 1 0 4 0 2 2 0 1 0-4 0M17 8a2 2 0 1 0 4 0 2 2 0 1 0-4 0"/>
                </svg>
              </div>
              <h1 className="text-2xl font-black italic tracking-tighter">Zoic</h1>
            </div>
          </header>

          <main className="px-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      <ZoicAssistant />

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-[400px] z-50 md:hidden">
        <nav className="bg-zoic-dark px-6 py-4 rounded-[30px] flex justify-between items-center shadow-2xl">
          <NavTab to="/" icon={<Home size={20} />} label="Home" />
          <NavTab to="/wildlife" icon={<Camera size={20} />} label="Wildlife" />
          <NavTab to="/rescue" icon={<LifeBuoy size={20} />} label="Rescue" />
          <NavTab to="/profile" icon={<User size={20} />} label="Profile" />
        </nav>
      </div>
    </div>
  );
}

function NavTab({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => cn(
        "flex flex-col items-center gap-0.5 transition-all duration-300",
        isActive ? "tab-active" : "tab-inactive"
      )}
    >
      <div className="mb-0.5">
        {icon}
      </div>
      <span className="text-[10px] font-bold">{label}</span>
    </NavLink>
  );
}

function DesktopNavTab({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => cn(
        "flex items-center gap-4 p-4 rounded-[20px] transition-all duration-300",
        isActive ? "bg-zoic-green text-white shadow-lg" : "text-white/60 hover:text-white hover:bg-white/5"
      )}
    >
      {({ isActive }) => (
        <>
          {icon}
          <span className="text-sm font-black italic tracking-tight">{label}</span>
          {isActive && <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />}
        </>
      )}
    </NavLink>
  );
}
