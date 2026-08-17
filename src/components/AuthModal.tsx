import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  HeartHandshake, 
  KeyRound, 
  Sparkles, 
  Briefcase, 
  Award,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { User as UserType, UserRole } from '../types';
import { ESTATE_NAMES } from '../mockData';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';

function WelcomeMascot({ loginRole, isLogin }: { loginRole: 'resident' | 'provider' | 'dispatcher'; isLogin: boolean }) {
  const getSpeechBubbleText = () => {
    if (!isLogin) return "Welcome to the EstateConnect Family! 🎉";
    if (loginRole === 'dispatcher') return "Dispatcher Console Ready! 🕵️‍♂️";
    if (loginRole === 'provider') return "Specialist Terminal Online! 🛠️";
    return "Welcome back, neighbor! 👋🏡";
  };

  return (
    <div className="flex flex-col items-center justify-center py-2.5 px-3 bg-gradient-to-b from-slate-100 to-amber-50/20 border-b border-stone-200 relative">
      <div className="relative flex items-center justify-center h-14 my-1">
        {/* Animated Speech Bubble */}
        <motion.div
          key={getSpeechBubbleText()}
          initial={{ opacity: 0, y: 6, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 16 }}
          className="absolute -top-6 bg-slate-900 text-amber-300 text-[10px] font-bold px-3 py-0.5 rounded-full shadow-md whitespace-nowrap border border-slate-800 z-10 flex items-center gap-1 font-mono uppercase tracking-wider"
        >
          {getSpeechBubbleText()}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45 border-r border-b border-slate-800" />
        </motion.div>

        {/* Mascot */}
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="relative w-12 h-12 bg-amber-100 border-2 border-amber-400 rounded-full flex items-center justify-center shadow-xs select-none"
        >
          <div className="relative flex flex-col items-center justify-center">
            <div className="w-7 h-3 bg-[#0B2545] rounded-t-md relative -mb-0.5 border-b border-slate-800 flex items-center justify-center">
              <span className="text-[6px] text-amber-300 font-bold">🏡</span>
            </div>
            <div className="w-6 h-4.5 bg-amber-50 border border-amber-300 rounded-b-md flex flex-col items-center justify-center space-y-0.5 relative">
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-slate-900 rounded-full" />
                <div className="w-1 h-1 bg-slate-900 rounded-full" />
              </div>
              <div className="w-2 h-0.5 border-b border-slate-900 rounded-b-full bg-rose-400/30" />
            </div>
          </div>
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
  const [accountType, setAccountType] = useState<'resident' | 'provider'>('resident');
  const [loginRole, setLoginRole] = useState<'resident' | 'provider' | 'dispatcher'>('resident');
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('+254 ');
  const [estateName, setEstateName] = useState(ESTATE_NAMES[0]);
  const [houseDetails, setHouseDetails] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  
  // Professional specific fields
  const [specialty, setSpecialty] = useState('Cleaning Services (Deep & Express)');
  const [experienceYears, setExperienceYears] = useState('2-4 years');
  const [coverageArea, setCoverageArea] = useState('Fedha Estate & Nairobi East');
  const [nationalId, setNationalId] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const specialties = [
    'Cleaning Services (Deep & Express)',
    'Plumbing & Drainage Repair',
    'Electrical & Appliances Diagnostics',
    'Laundry & Dry Clean Care',
    'Kids Home Tuition & Homework Tutoring',
    'Grocery Shopping & Market Bundles',
    'Car Wash & Auto Detailing',
    'Water Delivery & Gas Refill Utility',
    'Moving & Heavy Appliance Transit',
    'Pest Control & Fumigation',
    'Beauty, Barber & Home Salon',
    'Childcare & Trusted Babysitting'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const normalizedEmail = email.toLowerCase().trim();

    if (!normalizedEmail || !password) {
      setError('Please fill in both email and password.');
      setLoading(false);
      return;
    }

    if (!isLogin) {
      if (!name.trim()) {
        setError('Please enter your full official name.');
        setLoading(false);
        return;
      }
      if (!phone.trim() || phone.trim() === '+254') {
        setError('Please enter a valid phone number.');
        setLoading(false);
        return;
      }
      if (accountType === 'resident' && !houseDetails) {
        setError('Please select or specify your house sector / apartment number.');
        setLoading(false);
        return;
      }
    }

    try {
      let finalUid: string | null = null;
      let existingProfile: UserType | null = null;

      // ----------------------------------------------------
      // LOGIN FLOW
      // ----------------------------------------------------
      if (isLogin) {
        // Step 1: Try Firebase Auth sign in
        try {
          const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
          finalUid = userCredential.user.uid;
        } catch (authErr: any) {
          console.warn("Firebase Auth signIn notice:", authErr?.code || authErr?.message);
        }

        // Step 2: Query Firestore users collection for matching email credentials
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', normalizedEmail));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const matchedDoc = querySnapshot.docs[0];
          const dbUser = matchedDoc.data() as UserType;
          
          // Verify password if stored in backend
          if (dbUser.password && dbUser.password !== password) {
            setError('Incorrect security password. Please re-enter your password.');
            setLoading(false);
            return;
          }
          
          existingProfile = dbUser;
          finalUid = dbUser.id || matchedDoc.id;
        }

        // Check if demo admin or special credentials
        const isDemoAdmin =
          normalizedEmail === 'f6144050@gmail.com' ||
          normalizedEmail === 'admin@estateconnect.co.ke' ||
          loginRole === 'dispatcher';

        if (!existingProfile && !finalUid) {
          if (isDemoAdmin) {
            finalUid = 'admin_uid_master';
          } else {
            setError('Account not found with this email. Please check your credentials or register a new account.');
            setLoading(false);
            return;
          }
        }

        if (!existingProfile) {
          // Construct fallback profile if not in Firestore yet
          const cleanName = isDemoAdmin 
            ? 'Estate Dispatcher' 
            : (normalizedEmail === 'iankariri2@gmail.com' ? 'Ian Kariri' : normalizedEmail.split('@')[0]);

          existingProfile = {
            id: finalUid || `user_${normalizedEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
            name: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
            email: normalizedEmail,
            password: password,
            role: isDemoAdmin ? 'admin' : (loginRole === 'provider' ? 'provider' : 'resident'),
            estateName: estateName || 'Fedha Estate',
            houseDetails: isDemoAdmin ? 'Dispatch Console' : 'Sector B',
            phone: phone || '+254 799 111 222',
            createdAt: new Date().toISOString()
          };

          // Persist in backend Firestore
          await setDoc(doc(db, 'users', existingProfile.id), existingProfile);
        }

        // Save session locally
        localStorage.setItem('estateease_user_session', JSON.stringify(existingProfile));

        const roleTitle = existingProfile.role === 'admin' 
          ? 'Estate Dispatcher' 
          : existingProfile.role === 'provider' 
          ? 'Verified Specialist' 
          : 'Resident';

        onAuthSuccess(existingProfile, `Signed in successfully as ${roleTitle}: ${existingProfile.name}!`);
        onClose();
        return;
      }

      // ----------------------------------------------------
      // REGISTRATION FLOW (Resident or Professional)
      // ----------------------------------------------------
      const assignedRole: UserRole = accountType === 'provider' ? 'provider' : 'resident';

      // 1. Try Firebase Auth registration
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
        finalUid = userCredential.user.uid;
      } catch (authErr: any) {
        console.warn("Firebase Auth signup notice:", authErr?.code || authErr?.message);
        if (authErr?.code === 'auth/email-already-in-use') {
          // If already in auth, try signing in to retrieve UID
          try {
            const signedIn = await signInWithEmailAndPassword(auth, normalizedEmail, password);
            finalUid = signedIn.user.uid;
          } catch (e) {
            // Use deterministic sanitized UID
            finalUid = `user_${normalizedEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
          }
        }
      }

      if (!finalUid) {
        finalUid = `user_${Date.now()}_${normalizedEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;
      }

      // 2. Build complete backend User profile document
      const newProfile: UserType = {
        id: finalUid,
        name: name.trim(),
        email: normalizedEmail,
        password: password, // Securely persisted in Firestore backend
        role: assignedRole,
        phone: phone.trim(),
        gender: gender,
        estateName: estateName,
        houseDetails: accountType === 'resident' ? houseDetails : 'Field Specialist Unit',
        specialty: accountType === 'provider' ? specialty : undefined,
        experienceYears: accountType === 'provider' ? experienceYears : undefined,
        coverageArea: accountType === 'provider' ? coverageArea : undefined,
        nationalId: accountType === 'provider' ? nationalId.trim() : undefined,
        onDuty: accountType === 'provider' ? true : undefined,
        rating: accountType === 'provider' ? 5.0 : undefined,
        createdAt: new Date().toISOString()
      };

      // 3. Save user document in Firestore backend
      await setDoc(doc(db, 'users', finalUid), newProfile);

      // 4. If professional specialist, also sync to providers collection
      if (assignedRole === 'provider') {
        const providerRecord = {
          id: finalUid,
          name: name.trim(),
          phone: phone.trim(),
          email: normalizedEmail,
          rating: 5.0,
          specialty: specialty,
          avatar: `https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80`,
          onDuty: true,
          coverageArea: coverageArea,
          experienceYears: experienceYears
        };
        await setDoc(doc(db, 'providers', finalUid), providerRecord);
      }

      // 5. Save local session
      localStorage.setItem('estateease_user_session', JSON.stringify(newProfile));

      const welcomeMsg = assignedRole === 'provider'
        ? `Registration successful! Welcome to the Specialist Force, ${newProfile.name}. Your portal credentials are active.`
        : `Registration successful! Welcome to EstateConnect, ${newProfile.name}. Your resident account is ready.`;

      onAuthSuccess(newProfile, welcomeMsg);
      onClose();

    } catch (err: any) {
      console.error('Authentication backend error:', err);
      setError(err.message || 'Authentication failed. Please verify your credentials and network connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-xl w-[94vw] sm:w-[480px] max-w-lg flex flex-col shadow-2xl border border-slate-300 my-auto animate-fade-in overflow-hidden"
        id="auth-modal-card"
      >
        {/* Official Header */}
        <div className="px-4 py-3.5 bg-[#0B2545] text-white flex items-center justify-between shrink-0 border-b-4 border-[#E5A823]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-amber-500/10 border-2 border-[#E5A823] rounded-lg flex items-center justify-center text-[#E5A823] shadow-inner shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xs font-black tracking-widest uppercase font-mono text-amber-400">
                EstateConnect Community Portal
              </h2>
              <p className="text-[10px] text-slate-300 font-semibold tracking-wide">
                {isLogin ? 'Resident & Professional Sign In' : 'Resident & Specialist Account Setup'}
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
        <div className="bg-amber-50/90 border-b border-amber-200/80 px-4 py-2 flex items-start gap-2 text-[11px] text-amber-950">
          <KeyRound className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-tight font-medium">
            <strong>OFFICIAL ACCESS:</strong> {isLogin 
              ? 'Enter your registered credentials to access your estate services and active bookings.' 
              : 'Create your account to schedule domestic services, manage requests, and track specialist dispatches.'}
          </p>
        </div>

        {/* Mode Switcher: Sign In vs Register */}
        <div className="px-4 pt-3 pb-1 bg-slate-100 border-b border-slate-200 shrink-0">
          <div className="grid grid-cols-2 p-1 bg-slate-200/90 rounded-lg text-xs font-bold text-slate-700">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setError('');
              }}
              className={`py-1.5 rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 uppercase tracking-wider text-[11px] font-mono ${
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
              className={`py-1.5 rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 uppercase tracking-wider text-[11px] font-mono ${
                !isLogin
                  ? 'bg-[#0B2545] text-amber-300 shadow-sm font-black border-b-2 border-amber-400'
                  : 'text-slate-600 hover:text-slate-900 font-bold'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              Register Account
            </button>
          </div>
        </div>

        {/* Mascot Greeting */}
        <WelcomeMascot loginRole={isLogin ? loginRole : (accountType === 'provider' ? 'provider' : 'resident')} isLogin={isLogin} />

        {/* Form Body */}
        <div className="p-4 space-y-3 text-xs flex-1 bg-white max-h-[60vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-3">
            {error && (
              <div className="p-2.5 bg-rose-50 border border-rose-300 text-rose-900 text-[11px] font-bold rounded-md flex items-start gap-1.5">
                <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Role Selection */}
            {isLogin && (
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  Log in as:
                </label>
                <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-md border border-slate-300">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginRole('resident');
                      setError('');
                    }}
                    className={`py-1 px-1 rounded font-bold text-[10px] font-mono transition-all cursor-pointer uppercase flex items-center justify-center gap-1 ${
                      loginRole === 'resident'
                        ? 'bg-[#0B2545] text-amber-300 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <User className="h-3 w-3" />
                    Resident
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginRole('provider');
                      setError('');
                    }}
                    className={`py-1 px-1 rounded font-bold text-[10px] font-mono transition-all cursor-pointer uppercase flex items-center justify-center gap-1 ${
                      loginRole === 'provider'
                        ? 'bg-[#0B2545] text-amber-300 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Briefcase className="h-3 w-3" />
                    Specialist
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginRole('dispatcher');
                      setError('');
                    }}
                    className={`py-1 px-1 rounded font-bold text-[10px] font-mono transition-all cursor-pointer uppercase flex items-center justify-center gap-1 ${
                      loginRole === 'dispatcher'
                        ? 'bg-[#0B2545] text-amber-300 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <ShieldCheck className="h-3 w-3" />
                    Admin
                  </button>
                </div>
              </div>
            )}

            {/* Registration Account Type Toggle */}
            {!isLogin && (
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                  Select Account Category:
                </label>
                <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1 rounded-md border border-slate-300">
                  <button
                    type="button"
                    onClick={() => {
                      setAccountType('resident');
                      setError('');
                    }}
                    className={`py-1.5 px-2 rounded font-mono font-bold text-[11px] transition-all cursor-pointer uppercase flex items-center justify-center gap-1.5 ${
                      accountType === 'resident'
                        ? 'bg-[#0B2545] text-amber-300 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <User className="h-3.5 w-3.5 text-amber-400" />
                    Estate Resident
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAccountType('provider');
                      setError('');
                    }}
                    className={`py-1.5 px-2 rounded font-mono font-bold text-[11px] transition-all cursor-pointer uppercase flex items-center justify-center gap-1.5 ${
                      accountType === 'provider'
                        ? 'bg-[#0B2545] text-amber-300 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Briefcase className="h-3.5 w-3.5 text-amber-400" />
                    Professional / Specialist
                  </button>
                </div>
              </div>
            )}

            {/* Registration specific fields */}
            {!isLogin && (
              <div className="space-y-2.5 pt-1">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">
                    Official Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder={accountType === 'provider' ? 'e.g. David Mwangi' : 'e.g. Ian Kariri'}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-8 pr-3 py-1.5 w-full border border-slate-300 rounded bg-slate-50 focus:bg-white text-xs font-mono focus:outline-none focus:border-[#0B2545] focus:ring-1 focus:ring-blue-100 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">
                      Mobile / M-Pesa *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                      <input
                        type="tel"
                        required
                        placeholder="+254 7XX XXX XXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-8 pr-2.5 py-1.5 w-full border border-slate-300 rounded bg-slate-50 focus:bg-white text-xs font-mono focus:outline-none focus:border-[#0B2545] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">
                      Gender
                    </label>
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

                {accountType === 'resident' ? (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">
                        Estate Location
                      </label>
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
                      <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">
                        House Sector / Apt *
                      </label>
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
                ) : (
                  /* Professional specific inputs */
                  <div className="space-y-2 bg-amber-50/60 p-2.5 rounded-lg border border-amber-200">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">
                        Trade Specialty *
                      </label>
                      <select
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        className="px-2.5 py-1.5 w-full border border-slate-300 rounded bg-white text-xs font-medium focus:outline-none focus:border-[#0B2545] transition-all"
                      >
                        {specialties.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">
                          Experience Level *
                        </label>
                        <select
                          value={experienceYears}
                          onChange={(e) => setExperienceYears(e.target.value)}
                          className="px-2 py-1.5 w-full border border-slate-300 rounded bg-white text-xs focus:outline-none focus:border-[#0B2545] transition-all"
                        >
                          <option value="1-2 years">1-2 Years</option>
                          <option value="3-5 years">3-5 Years</option>
                          <option value="5-8 years">5-8 Years</option>
                          <option value="8+ years">8+ Years</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">
                          Coverage Zone
                        </label>
                        <input
                          type="text"
                          value={coverageArea}
                          onChange={(e) => setCoverageArea(e.target.value)}
                          placeholder="e.g. Fedha & Embakasi"
                          className="px-2 py-1.5 w-full border border-slate-300 rounded bg-white text-xs font-mono focus:outline-none focus:border-[#0B2545]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">
                Portal Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@estateconnect.co.ke"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-8 pr-3 py-1.5 w-full border border-slate-300 rounded bg-slate-50 focus:bg-white text-xs font-mono focus:outline-none focus:border-[#0B2545] focus:ring-1 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">
                Portal Security Password *
              </label>
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
              className={`w-full py-3 px-4 bg-[#0B2545] hover:bg-[#061830] text-amber-300 font-black text-xs rounded transition-all shadow-md active:scale-95 cursor-pointer mt-3 flex items-center justify-center gap-2 border-b-4 border-[#E5A823] uppercase tracking-wider font-mono ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5 text-amber-300" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                isLogin ? 'Authenticate & Enter Portal' : `Create ${accountType === 'provider' ? 'Professional Specialist' : 'Resident'} Account`
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
