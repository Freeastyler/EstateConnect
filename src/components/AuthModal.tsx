import React, { useState } from 'react';
import { X, Mail, Lock, User, MapPin, Phone, ShieldCheck } from 'lucide-react';
import { User as UserType } from '../types';
import { ESTATE_NAMES } from '../mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserType, message: string) => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [estateName, setEstateName] = useState(ESTATE_NAMES[0]);
  const [houseDetails, setHouseDetails] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in email and password.');
      return;
    }

    if (!isLogin && (!name || !houseDetails || !phone)) {
      setError('Please fill in all resident registration fields.');
      return;
    }

    // Standard simulation
    if (isLogin) {
      if (email.toLowerCase() === 'admin@estateconnect.com' || email.toLowerCase() === 'admin@estateease.com' || email.toLowerCase() === 'admin') {
        onAuthSuccess({
          id: 'admin-1',
          name: 'Estate Dispatcher',
          email: 'admin@estateconnect.com',
          role: 'admin'
        }, 'Signed in as Estate Admin Dispatcher!');
        onClose();
        return;
      }

      // Default demo resident account
      if (email.toLowerCase() === 'ian@estateconnect.com' || email.toLowerCase() === 'ian@estateease.com' || email.toLowerCase() === 'ian' || email.toLowerCase() === 'iankariri2@gmail.com') {
        onAuthSuccess({
          id: 'user-1',
          name: 'Ian Kariri',
          email: 'iankariri2@gmail.com',
          role: 'resident',
          estateName: 'Fedha Estate',
          houseDetails: 'Block C, Apartment 4B',
          phone: '+254 799 111 222'
        }, 'Signed in as Resident: Ian Kariri!');
        onClose();
        return;
      }

      // Custom guest user login
      const cleanName = email.split('@')[0];
      onAuthSuccess({
        id: `user-${Date.now()}`,
        name: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
        email: email,
        role: 'resident',
        estateName: ESTATE_NAMES[0],
        houseDetails: 'Villa A9',
        phone: '+254 700 000 000'
      }, 'Logged in successfully!');
      onClose();
    } else {
      // Sign-Up Flow
      onAuthSuccess({
        id: `user-${Date.now()}`,
        name,
        email,
        role: 'resident',
        estateName,
        houseDetails,
        phone
      }, `Welcome to EstateConnect, ${name}! Your account is created.`);
      onClose();
    }
  };

  const loadDemoResident = () => {
    setEmail('ian@estateconnect.com');
    setPassword('password123');
    setIsLogin(true);
  };

  const loadDemoAdmin = () => {
    setEmail('admin@estateconnect.com');
    setPassword('admin123');
    setIsLogin(true);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 animate-fade-in"
        id="auth-modal-card"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-display font-semibold text-slate-900">
              {isLogin ? 'Welcome Back' : 'Join EstateConnect'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {isLogin ? 'Access premium domestic services for your estate' : 'Register your home and start booking'}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 text-xs rounded-xl">
              {error}
            </div>
          )}

          {/* Quick Demo Logins */}
          {isLogin && (
            <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl space-y-2">
              <span className="text-[11px] font-semibold text-indigo-800 uppercase tracking-wider block">
                ⚡ Demo Quick-Pass Access
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={loadDemoResident}
                  className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-700 font-medium text-xs rounded-lg transition-colors cursor-pointer"
                >
                  <User className="h-3.5 w-3.5" />
                  Resident Account
                </button>
                <button
                  type="button"
                  onClick={loadDemoAdmin}
                  className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-700 font-medium text-xs rounded-lg transition-colors cursor-pointer"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Admin Dispatcher
                </button>
              </div>
            </div>
          )}

          {!isLogin && (
            <div className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="Ian Kariri"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all bg-slate-50/50"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="+254 799 111 222"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all bg-slate-50/50"
                  />
                </div>
              </div>

              {/* Estate Selector */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Estate Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <select
                      value={estateName}
                      onChange={(e) => setEstateName(e.target.value)}
                      className="pl-10 pr-3 py-2 w-full border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all bg-slate-50/50 appearance-none"
                    >
                      {ESTATE_NAMES.map((estate) => (
                        <option key={estate} value={estate}>{estate}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* House details */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">House/Apt No.</label>
                  <input
                    type="text"
                    required
                    placeholder="Block C, Apt 4B"
                    value={houseDetails}
                    onChange={(e) => setHouseDetails(e.target.value)}
                    className="px-4 py-2 w-full border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all bg-slate-50/50"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="ian@estateconnect.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all bg-slate-50/50"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all bg-slate-50/50"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-xl transition-all shadow-md shadow-slate-900/10 active:scale-95 cursor-pointer mt-2"
          >
            {isLogin ? 'Sign In' : 'Create Resident Account'}
          </button>

          {/* Switch Views */}
          <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
            {isLogin ? (
              <p>
                Are you an estate resident?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(false);
                    setError('');
                  }}
                  className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer underline"
                >
                  Create an account
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(true);
                    setError('');
                  }}
                  className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer underline"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
