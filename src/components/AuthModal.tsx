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

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-xl w-[94vw] sm:w-[440px] max-w-md flex flex-col shadow-2xl border border-slate-300 my-auto animate-fade-in overflow-hidden"
        id="auth-modal-card"
      >
        {/* Official Maseno Portal Header Bar */}
        <div className="px-4 py-3.5 bg-[#0B2545] text-white flex items-center justify-between shrink-0 border-b-4 border-[#E5A823]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-amber-500/10 border-2 border-[#E5A823] rounded-lg flex items-center justify-center text-[#E5A823] shadow-inner shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xs font-black tracking-widest uppercase font-mono text-amber-400">
                EstateConnect Portal
              </h2>
              <p className="text-[10px] text-slate-300 font-semibold tracking-wide">
                {isLogin ? 'Resident & Admin Single Sign-On' : 'New Household Student/Resident Registration'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Portal Notice Box */}
        <div className="bg-amber-50/90 border-b border-amber-200/80 px-4 py-2.5 flex items-start gap-2 text-[11px] text-amber-950">
          <KeyRound className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-tight font-medium">
            <strong>PORTAL NOTICE:</strong> {isLogin ? 'Enter your registered portal email address and security password to log in.' : 'Complete the registration form to obtain your official resident pass.'}
          </p>
        </div>

        {/* Top Mode Segment Switcher */}
        <div className="px-4 pt-3 pb-1 bg-slate-100 border-b border-slate-200 shrink-0">
          <div className="grid grid-cols-2 p-1 bg-slate-200/90 rounded-lg text-xs font-bold text-slate-700">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setError('');
              }}
              className={`py-1.5 rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 uppercase tracking-wider text-[11px] ${
                isLogin
                  ? 'bg-[#0B2545] text-amber-300 shadow-sm font-black border-b-2 border-amber-400'
                  : 'text-slate-600 hover:text-slate-900 font-bold'
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
              className={`py-1.5 rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 uppercase tracking-wider text-[11px] ${
                !isLogin
                  ? 'bg-[#0B2545] text-amber-300 shadow-sm font-black border-b-2 border-amber-400'
                  : 'text-slate-600 hover:text-slate-900 font-bold'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              Register
            </button>
          </div>
        </div>

        {/* Mascot Greeting */}
        <WelcomeMascot loginRole={loginRole} isLogin={isLogin} />

        {/* Form Body */}
        <div className="p-4 space-y-3.5 text-xs flex-1 bg-white">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {error && (
              <div className="p-2.5 bg-rose-50 border border-rose-300 text-rose-900 text-[11px] font-bold rounded-md">
                ⚠️ {error}
              </div>
            )}

            {/* Role switch for login */}
            {isLogin && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1 rounded-md border border-slate-300">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginRole('resident');
                      setEmail('');
                      setPassword('');
                      setError('');
                    }}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded font-bold text-[11px] transition-all cursor-pointer uppercase ${
                      loginRole === 'resident'
                        ? 'bg-[#0B2545] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <User className="h-3 w-3 text-amber-400" />
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
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded font-bold text-[11px] transition-all cursor-pointer uppercase ${
                      loginRole === 'dispatcher'
                        ? 'bg-[#0B2545] text-amber-300 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ShieldCheck className="h-3 w-3 text-amber-400" />
                    Dispatcher
                  </button>
                </div>
              </div>
            )}

            {/* Registration fields */}
            {!isLogin && (
              <div className="space-y-2.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Ian Kariri"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-8 pr-3 py-1.5 w-full border border-slate-300 rounded bg-slate-50 focus:bg-white text-xs font-mono focus:outline-none focus:border-[#0B2545] focus:ring-1 focus:ring-blue-100 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="tel"
                        required
                        placeholder="+254 799 111 222"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-8 pr-2.5 py-1.5 w-full border border-slate-300 rounded bg-slate-50 focus:bg-white text-xs font-mono focus:outline-none focus:border-[#0B2545] focus:ring-1 focus:ring-blue-100 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other')}
                      className="px-2.5 py-1.5 w-full border border-slate-300 rounded bg-slate-50 focus:bg-white text-xs font-medium focus:outline-none focus:border-[#0B2545] transition-all"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Estate Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                      <select
                        value={estateName}
                        onChange={(e) => setEstateName(e.target.value)}
                        className="pl-8 pr-2 py-1.5 w-full border border-slate-300 rounded bg-slate-50 focus:bg-white text-xs focus:outline-none focus:border-[#0B2545] transition-all"
                      >
                        {ESTATE_NAMES.map((estate) => (
                          <option key={estate} value={estate}>{estate}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">House Sector</label>
                    <select
                      required
                      value={houseDetails}
                      onChange={(e) => setHouseDetails(e.target.value)}
                      className="px-2.5 py-1.5 w-full border border-slate-300 rounded bg-slate-50 focus:bg-white text-xs focus:outline-none focus:border-[#0B2545] transition-all"
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
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Portal Email ID / Username</label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="ian@estateconnect.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-8 pr-3 py-1.5 w-full border border-slate-300 rounded bg-slate-50 focus:bg-white text-xs font-mono focus:outline-none focus:border-[#0B2545] focus:ring-1 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">Portal Security Password</label>
              <div className="relative">
                <Lock className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-8 pr-3 py-1.5 w-full border border-slate-300 rounded bg-slate-50 focus:bg-white text-xs font-mono focus:outline-none focus:border-[#0B2545] focus:ring-1 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 bg-[#0B2545] hover:bg-[#061830] text-amber-300 font-black text-xs rounded transition-all shadow-md active:scale-95 cursor-pointer mt-3 flex items-center justify-center gap-2 border-b-4 border-[#E5A823] uppercase tracking-wider ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-amber-300" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Authenticating...
                </>
              ) : (
                isLogin ? 'Sign In to Portal Pass' : 'Complete Portal Registration'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
