import React, { useState } from 'react';
import { Home, LogOut, Menu, X, ShieldAlert, Sparkles, UserCheck } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentUser: User | null;
  onLogout: () => void;
  onOpenAuth: () => void;
  currentView: 'landing' | 'client' | 'admin';
  onSwitchView: (view: 'landing' | 'client' | 'admin') => void;
}

export default function Navbar({
  currentUser,
  onLogout,
  onOpenAuth,
  currentView,
  onSwitchView
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (view: 'landing' | 'client' | 'admin') => {
    onSwitchView(view);
    setIsOpen(false);
  };

  return (
    <nav className="bg-white border-b border-slate-100 sticky top-0 z-40" id="main-navbar">
      {/* Warm Cozy Domestic Lifestyle Sticky Banner */}
      <div className="bg-gradient-to-r from-[#F0FDF4] via-[#E6F4EA] to-[#F0FDF4] border-b border-[#D1E7DD] px-4 py-2 text-center text-[11px] sm:text-xs font-semibold text-[#14532D] flex items-center justify-center gap-2 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse shrink-0"></span>
        <span className="tracking-wide text-[#14532D] font-serif italic">
          🏡 Welcome to the official EstateConnect portal. Your trusted neighborhood helper.
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleNavClick(currentUser ? (currentUser.role === 'admin' ? 'admin' : 'client') : 'landing')}
              className="flex items-center gap-2 text-slate-900 hover:opacity-90 font-display font-bold text-xl tracking-tight cursor-pointer"
            >
              <div className="bg-slate-900 text-teal-400 p-2 rounded-xl flex items-center justify-center">
                <Home className="h-5 w-5" />
              </div>
              <span>Estate<span className="text-teal-600 font-semibold">Connect</span></span>
            </button>

            {/* Quick Badge for Roles in Admin vs Resident modes */}
            {currentUser && (
              <span className={`hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2 ${
                currentUser.role === 'admin' 
                  ? 'bg-amber-50 text-amber-800 border border-amber-200' 
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}>
                {currentUser.role === 'admin' ? 'Dispatcher Mode' : 'Resident'}
              </span>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-4">
            {currentUser ? (
              <>
                {/* Switch between Client/Admin for easy testing */}
                <div className="flex bg-slate-100 p-1 rounded-xl mr-2 gap-1 border border-slate-200/50">
                  <button
                    onClick={() => handleNavClick('client')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      currentView === 'client'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <UserCheck className="h-3.5 w-3.5" />
                    Resident Portal
                  </button>
                  <button
                    onClick={() => handleNavClick('admin')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      currentView === 'admin'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <ShieldAlert className="h-3.5 w-3.5" />
                    Dispatcher (Admin)
                  </button>
                </div>

                {/* Logged in User Profile Info */}
                <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
                  <div className="text-right">
                    <p className="text-xs font-semibold text-slate-800">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {currentUser.role === 'admin' ? 'Admin Panel' : currentUser.estateName || 'Resident'}
                    </p>
                  </div>
                  <button
                    onClick={onLogout}
                    className="flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all cursor-pointer"
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
                  className={`text-sm font-medium transition-colors ${
                    currentView === 'landing' ? 'text-slate-900 font-semibold' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Home
                </button>
                <a
                  href="#how-it-works"
                  className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
                >
                  How it Works
                </a>
                <a
                  href="#services-preview"
                  className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Our Services
                </a>
                <button
                  onClick={onOpenAuth}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-xl transition-all shadow-md hover:shadow-lg hover:shadow-slate-950/10 cursor-pointer"
                >
                  Get Started
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
        <div className="md:hidden border-b border-slate-100 bg-white px-4 pt-2 pb-4 space-y-2 animate-fade-in">
          {currentUser ? (
            <div className="space-y-3 pt-2">
              <div className="px-3 py-2 bg-slate-50 rounded-xl">
                <p className="text-sm font-semibold text-slate-800">{currentUser.name}</p>
                <p className="text-xs text-slate-400 font-mono">
                  {currentUser.role === 'admin' ? 'Estate Admin' : `${currentUser.estateName}, ${currentUser.houseDetails}`}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleNavClick('client')}
                  className={`w-full py-2 px-3 rounded-lg text-center font-medium text-xs transition-colors cursor-pointer ${
                    currentView === 'client'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-50 text-slate-600 border hover:bg-slate-100'
                  }`}
                >
                  Resident View
                </button>
                <button
                  onClick={() => handleNavClick('admin')}
                  className={`w-full py-2 px-3 rounded-lg text-center font-medium text-xs transition-colors cursor-pointer ${
                    currentView === 'admin'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-50 text-slate-600 border hover:bg-slate-100'
                  }`}
                >
                  Dispatcher View
                </button>
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
