/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { Home, Camera, LifeBuoy, User, PlusCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Layout({ onLaunchDemo }: { onLaunchDemo?: () => void }) {
  const location = useLocation();

  return (
    <div className="mobile-container overflow-x-hidden">
      {/* Top Header */}
      <header className="px-6 py-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-zoic-green rounded-[10px] flex items-center justify-center text-white shadow-sm">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 20a2 2 0 1 0 4 0 2 2 0 1 0-4 0M7 16a2 2 0 1 0 4 0 2 2 0 1 0-4 0M13 12a2 2 0 1 0 4 0 2 2 0 1 0-4 0M17 8a2 2 0 1 0 4 0 2 2 0 1 0-4 0"/>
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight leading-none">Zoic</h1>
            <p className="text-[11px] opacity-60 font-semibold uppercase tracking-wider">Every animal. Everywhere.</p>
          </div>
        </div>
        <button className="bg-zoic-green text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md active:scale-95 transition-transform">
          + Add
        </button>
      </header>

      {/* Main Content Area with Transitions */}
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

      {/* Bottom Navigation - Bento Style Pill */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-[400px] z-50">
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
