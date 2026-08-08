import React, { useState } from 'react';
import { Home, LogOut, Menu, X, ShieldAlert, Sparkles, UserCheck } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentUser: User | null;
  onLogout: () => void;
  onOpenAuth: () => void;
  currentView: 'landing' | 'client' | 'admin' | 'roster';
  onSwitchView: (view: 'landing' | 'client' | 'admin' | 'roster') => void;
}

export default function Navbar({
  currentUser,
  onLogout,
  onOpenAuth,
  currentView,
  onSwitchView
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (view: 'landing' | 'client' | 'admin' | 'roster') => {
    onSwitchView(view);
    setIsOpen(false);
  };

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-stone-200/80 sticky top-0 z-40" id="main-navbar">
      {/* Warm Cozy Domestic Lifestyle Sticky Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-emerald-800 border-b border-emerald-950/40 px-4 py-1.5 text-center text-[11px] sm:text-xs font-semibold text-emerald-100 flex items-center justify-center gap-2 shadow-xs">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0"></span>
        <span className="tracking-wide font-medium">
          🏡 Welcome to the official Fedha EstateConnect portal. Your trusted neighborhood helper.
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleNavClick(currentUser ? (currentUser.role === 'admin' ? 'admin' : 'client') : 'landing')}
              className="flex items-center gap-2.5 text-stone-900 hover:opacity-90 font-display font-extrabold text-xl tracking-tight cursor-pointer"
            >
              <div className="bg-emerald-800 text-amber-300 p-2 rounded-2xl flex items-center justify-center shadow-xs">
                <Home className="h-5 w-5" />
              </div>
              <span>Estate<span className="text-emerald-700 font-extrabold">Connect</span></span>
            </button>

            {/* Quick Badge for Roles in Admin vs Resident modes */}
            {currentUser && (
              <span className={`hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ml-2 ${
                currentUser.role === 'admin' 
                  ? 'bg-amber-100 text-amber-900 border border-amber-300/80' 
                  : 'bg-emerald-100 text-emerald-900 border border-emerald-300/80'
              }`}>
                {currentUser.role === 'admin' ? 'Dispatcher Mode' : 'Resident Portal'}
              </span>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-4">
           {currentUser ? (
              <>
                {/* Logged in User Profile Info */}
                <div className="flex items-center gap-3 pl-3 border-l border-stone-200">
                  <div className="text-right">
                    <p className="text-xs font-bold text-stone-800">
                      {currentUser.name ? currentUser.name.trim().split(/\s+/)[0] : 'Resident'}
                    </p>
                    <p className="text-[10px] text-stone-500 font-medium">
                      {currentUser.role === 'admin' ? 'Admin Panel' : currentUser.houseDetails || 'Fedha Resident'}
                    </p>
                  </div>
                  <button
                    onClick={onLogout}
                    className="flex items-center justify-center p-2 rounded-xl text-stone-500 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNavClick('landing')}
                  className={`text-sm font-semibold transition-colors ${
                    currentView === 'landing' ? 'text-emerald-800 font-extrabold' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Home
                </button>
                <a
                  href="#how-it-works"
                  className="text-sm font-semibold text-stone-600 hover:text-stone-900 transition-colors"
                >
                  How it Works
                </a>
                <a
                  href="#services-preview"
                  className="text-sm font-semibold text-stone-600 hover:text-stone-900 transition-colors"
                >
                  Our Services
                </a>
                <button
                  onClick={onOpenAuth}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm rounded-2xl transition-all shadow-md shadow-emerald-900/10 hover:shadow-lg cursor-pointer"
                >
                  Get Started / Sign In
                </button>
              </>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="md:hidden flex items-center gap-2">
            {currentUser && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 border text-slate-700">
                {currentView === 'admin' ? 'Admin' : 'Resident'}
              </span>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-50 focus:outline-none transition-all cursor-pointer"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-slate-100 bg-white px-4 pt-2 pb-4 space-y-3 animate-fade-in">
          {currentUser ? (
            <div className="space-y-4 pt-2">
              
              {/* Individual Account Management Details */}
              <div className="p-4 bg-slate-950 text-slate-200 rounded-2xl border border-slate-800 space-y-3 shadow-md">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-[10px] font-black tracking-widest text-teal-400 uppercase">
                    Account Profile
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    ID: #{currentUser.id.substring(0, 5)}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <span className="block text-[9px] text-slate-500 uppercase font-bold">Official Name</span>
                    <span className="text-sm font-semibold text-white">{currentUser.name}</span>
                  </div>
                  
                  <div>
                    <span className="block text-[9px] text-slate-500 uppercase font-bold">Email Address</span>
                    <span className="text-xs text-slate-300 font-mono">{currentUser.email}</span>
                  </div>

                  {currentUser.role !== 'admin' ? (
                    <>
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-900/50 mt-1">
                        <div>
                          <span className="block text-[9px] text-slate-500 uppercase font-bold">Sector Location</span>
                          <span className="text-xs text-teal-300 font-semibold">{currentUser.houseDetails || 'Upper Fedha'}</span>
                        </div>
                        <div>
                          <span className="block text-[9px] text-slate-500 uppercase font-bold">Phone Number</span>
                          <span className="text-xs text-slate-300 font-mono">{currentUser.phone || '+254 700 000 000'}</span>
                        </div>
                      </div>
                      
                      <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 font-semibold flex items-center gap-1">
                          <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse inline-block" />
                          Verified Resident
                        </span>
                        <span className="text-slate-500 font-mono">Status: Cleared</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-900/50 mt-1">
                        <div>
                          <span className="block text-[9px] text-slate-500 uppercase font-bold">Access Level</span>
                          <span className="text-xs text-indigo-300 font-semibold">Authorized Admin</span>
                        </div>
                        <div>
                          <span className="block text-[9px] text-slate-500 uppercase font-bold">Security Pass</span>
                          <span className="text-xs text-slate-300 font-mono">Tier-1 Terminal</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 font-semibold flex items-center gap-1">
                          <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-pulse inline-block" />
                          Dispatcher Console Active
                        </span>
                        <span className="text-slate-500 font-mono">Status: Secure</span>
                      </div>
                    </>
                  )}
                </div>
              </div>



              <button
                onClick={() => {
                  onLogout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-semibold cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          ) : (
            <div className="space-y-1.5 pt-2">
              <button
                onClick={() => handleNavClick('landing')}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer"
              >
                Home
              </button>
              <a
                href="#how-it-works"
                onClick={() => setIsOpen(false)}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                How it Works
              </a>
              <a
                href="#services-preview"
                onClick={() => setIsOpen(false)}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                Services
              </a>
              <button
                onClick={() => {
                  onOpenAuth();
                  setIsOpen(false);
                }}
                className="w-full text-center py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-lg transition-colors cursor-pointer"
              >
                Get Started / Login
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
