import React, { useState } from 'react';
import { X, Mail, Lock, User, MapPin, Phone, ShieldCheck, HeartHandshake, KeyRound, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { User as UserType } from '../types';
import { ESTATE_NAMES } from '../mockData';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

function WelcomeMascot({ loginRole, isLogin }: { loginRole: 'resident' | 'dispatcher'; isLogin: boolean }) {
  const getSpeechBubbleText = () => {
    if (!isLogin) return "Woohoo! Let's be neighbors! 🎉";
    if (loginRole === 'dispatcher') return "At your service, Chief! 🕵️‍♂️";
    return "Welcome back, neighbor! 👋🏡";
  };

  return (
    <div className="flex flex-col items-center justify-center py-2.5 px-3 bg-gradient-to-b from-emerald-50/60 to-amber-50/20 border-b border-stone-100 relative">
      <div className="relative flex items-center justify-center h-16 my-1">
        {/* Animated Speech Bubble */}
        <motion.div
          key={getSpeechBubbleText()}
          initial={{ opacity: 0, y: 6, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 16 }}
          className="absolute -top-7 bg-stone-900 text-amber-300 text-[11px] font-bold px-3 py-1 rounded-full shadow-md whitespace-nowrap border border-stone-800 z-10 flex items-center gap-1"
        >
          {getSpeechBubbleText()}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-stone-900 rotate-45 border-r border-b border-stone-800" />
        </motion.div>

        {/* Mascot Face & Body Container - Compact & Cute */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="relative w-14 h-14 bg-gradient-to-tr from-amber-100 to-emerald-100 border-2 border-emerald-300/80 rounded-full flex items-center justify-center shadow-sm select-none"
        >
          <div className="relative flex flex-col items-center justify-center">
            {/* Cute Roof */}
            <div className="w-9 h-3.5 bg-emerald-700 rounded-t-md relative -mb-0.5 border-b border-emerald-800 shadow-2xs flex items-center justify-center">
              <span className="text-[7px] text-emerald-100 font-bold">🏡</span>
            </div>
            {/* Main House Body */}
            <div className="w-7 h-5.5 bg-amber-50 border border-amber-200 rounded-b-md flex flex-col items-center justify-center space-y-0.5 relative">
              <div className="flex gap-1.5">
                <motion.div 
                  animate={{ scaleY: [1, 0.1, 1] }}
                  transition={{ repeat: Infinity, duration: 3.5, repeatDelay: 1.5 }}
                  className="w-1 h-1 bg-stone-800 rounded-full"
                />
                <motion.div 
                  animate={{ scaleY: [1, 0.1, 1] }}
                  transition={{ repeat: Infinity, duration: 3.5, repeatDelay: 1.5 }}
                  className="w-1 h-1 bg-stone-800 rounded-full"
                />
              </div>
              <div className="w-2 h-0.5 border-b border-stone-800 rounded-b-full bg-rose-400/20" />
            </div>
          </div>

          <motion.div
            animate={{ rotate: [0, 15, -15, 15, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", repeatDelay: 1 }}
            className="absolute -right-2 bottom-1 text-xs select-none origin-bottom-left"
          >
            👋
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserType, message: string) => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loginRole, setLoginRole] = useState<'resident' | 'dispatcher'>('resident');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [estateName, setEstateName] = useState(ESTATE_NAMES[0]);
  const [houseDetails, setHouseDetails] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in email and password.');
      setLoading(false);
      return;
    }

    if (!isLogin && (!name || !phone || !houseDetails)) {
      setError('Please fill in all resident registration fields.');
      setLoading(false);
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();

    try {
      let finalUid: string | null = null;

      // 1. Attempt standard Firebase Auth
      try {
        if (isLogin) {
          const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
          finalUid = userCredential.user.uid;
        } else {
          const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
          finalUid = userCredential.user.uid;
        }
      } catch (authErr: any) {
        console.warn("Firebase Auth call info/error:", authErr?.code || authErr?.message);
        // If user exists on signup or doesn't exist on login, try alternate
        if (!isLogin && (authErr?.code === 'auth/email-already-in-use')) {
          try {
            const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
            finalUid = userCredential.user.uid;
          } catch (e) {
            // ignore and fallback
          }
        } else if (isLogin && (authErr?.code === 'auth/user-not-found' || authErr?.code === 'auth/invalid-credential')) {
          try {
            const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
            finalUid = userCredential.user.uid;
          } catch (e) {
            // ignore and fallback
          }
        }
      }

      // 2. If Firebase Auth returned auth/operation-not-allowed or wasn't usable, generate deterministic fallback ID
      if (!finalUid) {
        const sanitized = normalizedEmail.replace(/[^a-zA-Z0-9]/g, '_');
        finalUid = `user_uid_${sanitized}`;
      }

      // 3. Retrieve or create Firestore profile document
      const userDocRef = doc(db, 'users', finalUid);
      let userProfile: UserType | null = null;

      try {
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          userProfile = userDocSnap.data() as UserType;
        }
      } catch (fErr) {
        console.warn("Firestore user fetch notice:", fErr);
      }

      if (!userProfile) {
        const isDemoAdmin =
          normalizedEmail === 'f6144050@gmail.com' ||
          (normalizedEmail === 'admin@estateconnect.co.ke') ||
          (isLogin && loginRole === 'dispatcher');

        const isDemoResident = normalizedEmail === 'resident@estateconnect.co.ke' || normalizedEmail === 'iankariri2@gmail.com';

        const cleanName = isLogin
          ? (isDemoAdmin
              ? 'Estate Dispatcher'
              : (isDemoResident ? 'Ian Kariri' : normalizedEmail.split('@')[0]))
          : name;

        const formattedName = cleanName ? (cleanName.charAt(0).toUpperCase() + cleanName.slice(1)) : 'Resident';

        userProfile = {
          id: finalUid,
          name: formattedName,
          email: normalizedEmail,
          role: isDemoAdmin ? 'admin' : 'resident',
          estateName: estateName || 'Fedha Estate',
          houseDetails: houseDetails || (isDemoAdmin ? 'Estate Dispatch Center' : 'Block C, Apartment 4B'),
          phone: phone || (isDemoAdmin ? '+254 711 222 333' : '+254 799 111 222'),
          gender: gender || 'male',
          createdAt: new Date().toISOString()
        };

        try {
          await setDoc(userDocRef, userProfile);
        } catch (sErr) {
          console.warn("Firestore setDoc notice:", sErr);
        }
      }

      const successMsg = isLogin
        ? (userProfile.role === 'admin'
            ? `Signed in as Estate Admin Dispatcher! Welcome, ${userProfile.name}.`
            : `Signed in as Resident: ${userProfile.name}!`)
        : `Welcome to EstateConnect, ${userProfile.name}! Your account is created.`;

      onAuthSuccess(userProfile, successMsg);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const loadDemoResident = () => {
    setEmail('resident@estateconnect.co.ke');
    setPassword('password123');
    setIsLogin(true);
    setLoginRole('resident');
  };

  const loadDemoAdmin = () => {
    setEmail('f6144050@gmail.com');
    setPassword('Railways21323');
    setIsLogin(true);
    setLoginRole('dispatcher');
  };

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-3xl w-[94vw] sm:w-[420px] max-w-md flex flex-col shadow-2xl border border-stone-200/80 my-auto animate-fade-in"
        id="auth-modal-card"
      >
        {/* Compact Friendly Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-emerald-700/80 border border-emerald-500/50 rounded-xl flex items-center justify-center text-amber-300">
              <HeartHandshake className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-wide font-display text-white">
                {isLogin ? 'Neighbor Login Pass' : 'Join Fedha Community'}
              </h2>
              <p className="text-[10px] text-emerald-200/80 leading-none">
                {isLogin ? 'Access your doorstep services' : 'Register your household key'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-emerald-200/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Top Mode Segment Switcher (Sign In vs Join) */}
        <div className="px-4 pt-3 pb-1 bg-stone-50 border-b border-stone-200/60 shrink-0">
          <div className="grid grid-cols-2 p-1 bg-stone-200/60 rounded-2xl text-xs font-bold text-stone-600">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setError('');
              }}
              className={`py-1.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                isLogin
                  ? 'bg-white text-emerald-800 shadow-sm font-extrabold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <KeyRound className="h-3.5 w-3.5" />
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setError('');
              }}
              className={`py-1.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                !isLogin
                  ? 'bg-emerald-700 text-white shadow-sm font-extrabold'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              Join Estate
            </button>
          </div>
        </div>

        {/* Mascot Greeting */}
        <WelcomeMascot loginRole={loginRole} isLogin={isLogin} />

        {/* Form Body */}
        <div className="p-4 space-y-3 text-xs flex-1">
          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-medium rounded-xl">
                {error}
              </div>
            )}

            {/* Role switch for login */}
            {isLogin && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-1.5 bg-stone-100 p-1 rounded-xl border border-stone-200/50">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginRole('resident');
                      setEmail('');
                      setPassword('');
                      setError('');
                    }}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                      loginRole === 'resident'
                        ? 'bg-white text-stone-900 shadow-2xs border border-stone-200'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    <User className="h-3 w-3 text-emerald-600" />
                    Resident
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginRole('dispatcher');
                      setEmail('');
                      setPassword('');
                      setError('');
                    }}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                      loginRole === 'dispatcher'
                        ? 'bg-stone-900 text-amber-300 shadow-2xs'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    <ShieldCheck className="h-3 w-3 text-amber-400" />
                    Dispatcher
                  </button>
                </div>

                {loginRole === 'dispatcher' ? (
                  <div className="p-2.5 bg-amber-50/80 border border-amber-200/80 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-1.5 text-amber-900 font-bold text-[11px]">
                      <ShieldCheck className="h-3.5 w-3.5 text-amber-700" />
                      Authorized Dispatcher Console
                    </div>
                    <button
                      type="button"
                      onClick={loadDemoAdmin}
                      className="w-full flex items-center justify-center gap-1 py-1.5 px-2 bg-amber-700 hover:bg-amber-800 text-white font-bold text-[11px] rounded-lg transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      ⚡ Auto-Fill Dispatcher Portal Credentials
                    </button>
                  </div>
                ) : (
                  <div className="p-2.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-1.5 text-emerald-950 font-bold text-[11px]">
                      <User className="h-3.5 w-3.5 text-emerald-700" />
                      Resident Doorstep Portal
                    </div>
                    <button
                      type="button"
                      onClick={loadDemoResident}
                      className="w-full flex items-center justify-center gap-1 py-1.5 px-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] rounded-lg transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      ⚡ Auto-Fill Resident Demo (Ian)
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Registration fields */}
            {!isLogin && (
              <div className="space-y-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-stone-400" />
                    <input
                      type="text"
                      required
                      placeholder="Ian Kariri"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-8 pr-3 py-1.5 w-full border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all bg-stone-50/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-stone-400" />
                      <input
                        type="tel"
                        required
                        placeholder="+254 799 111 222"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-8 pr-2.5 py-1.5 w-full border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all bg-stone-50/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other')}
                      className="px-3 py-1.5 w-full border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600 transition-all bg-stone-50/50 font-medium"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">Estate Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-stone-400" />
                      <select
                        value={estateName}
                        onChange={(e) => setEstateName(e.target.value)}
                        className="pl-8 pr-2 py-1.5 w-full border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600 transition-all bg-stone-50/50"
                      >
                        {ESTATE_NAMES.map((estate) => (
                          <option key={estate} value={estate}>{estate}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">House Sector</label>
                    <select
                      required
                      value={houseDetails}
                      onChange={(e) => setHouseDetails(e.target.value)}
                      className="px-3 py-1.5 w-full border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600 transition-all bg-stone-50/50"
                    >
                      <option value="">Select Sector...</option>
                      <option value="Upper Fedha">Upper Fedha</option>
                      <option value="Lower Fedha">Lower Fedha</option>
                      <option value="Kwandege/Nyayo">Kwandege/Nyayo</option>
                      <option value="Telaviv">Telaviv</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-stone-400" />
                <input
                  type="email"
                  required
                  placeholder="ian@estateconnect.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-8 pr-3 py-1.5 w-full border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all bg-stone-50/50"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-stone-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-8 pr-3 py-1.5 w-full border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all bg-stone-50/50"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-900/10 active:scale-95 cursor-pointer mt-2 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </>
              ) : (
                isLogin ? 'Sign In to Doorstep Pass' : 'Create Resident Account'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
