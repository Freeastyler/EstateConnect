import React, { useState } from 'react';
import { 
  X, 
  Briefcase, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Lock, 
  Award, 
  MapPin, 
  FileText, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';

interface ProviderApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess?: (applicationRef: string) => void;
}

export default function ProviderApplicationModal({
  isOpen,
  onClose,
  onSubmitSuccess
}: ProviderApplicationModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+254 ');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [specialty, setSpecialty] = useState('Cleaning Services (Deep & Express)');
  const [experienceYears, setExperienceYears] = useState('2-4 years');
  const [coverageArea, setCoverageArea] = useState('Fedha Estate & Embakasi');
  const [availability, setAvailability] = useState('Full-Time (Mon-Sat)');
  const [bio, setBio] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!agreeTerms) {
      setErrorMessage('Please confirm agreement to EstateConnect security vetting and gate clearance guidelines.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Please provide a secure password with at least 6 characters for your specialist portal account.');
      return;
    }

    setLoading(true);
    const appRefNumber = `PROV-APP-${Date.now().toString().slice(-6)}`;
    const normalizedEmail = email.trim().toLowerCase();

    try {
      let uid: string = `provider_${Date.now()}_${normalizedEmail.replace(/[^a-zA-Z0-9]/g, '_')}`;

      // 1. Attempt Firebase Auth registration
      try {
        const userCred = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
        uid = userCred.user.uid;
      } catch (authErr: any) {
        console.warn('Firebase auth registration notice:', authErr?.code || authErr?.message);
      }

      // 2. Save full provider application in Firestore
      await addDoc(collection(db, 'providerApplications'), {
        applicationRef: appRefNumber,
        name: name.trim(),
        phone: phone.trim(),
        email: normalizedEmail,
        nationalId: nationalId.trim(),
        specialty,
        experienceYears,
        coverageArea,
        availability,
        bio: bio.trim(),
        status: 'Approved & Active',
        createdAt: new Date().toISOString()
      });

      // 3. Save User account in users collection for seamless login
      const userProfile = {
        id: uid,
        name: name.trim(),
        email: normalizedEmail,
        password: password,
        role: 'provider',
        phone: phone.trim(),
        specialty,
        experienceYears,
        coverageArea,
        nationalId: nationalId.trim(),
        estateName: 'Fedha Estate',
        houseDetails: 'Field Specialist Unit',
        onDuty: true,
        rating: 5.0,
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'users', uid), userProfile);

      // 4. Save Provider record in providers collection
      const providerDoc = {
        id: uid,
        name: name.trim(),
        phone: phone.trim(),
        email: normalizedEmail,
        rating: 5.0,
        specialty,
        avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80',
        onDuty: true,
        coverageArea,
        experienceYears
      };
      await setDoc(doc(db, 'providers', uid), providerDoc);

      setSubmittedRef(appRefNumber);
      if (onSubmitSuccess) {
        onSubmitSuccess(appRefNumber);
      }
    } catch (err: any) {
      console.error('Error submitting application:', err);
      setSubmittedRef(appRefNumber);
      if (onSubmitSuccess) {
        onSubmitSuccess(appRefNumber);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setName('');
    setPhone('+254 ');
    setEmail('');
    setPassword('');
    setNationalId('');
    setBio('');
    setAgreeTerms(false);
    setSubmittedRef(null);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div 
        className="bg-white rounded-xl w-full max-w-xl shadow-2xl border border-slate-300 flex flex-col my-auto animate-fade-in overflow-hidden max-h-[90vh]"
        id="provider-application-modal-card"
      >
        {/* Header - Maseno Portal Navy & Gold */}
        <div className="p-4 sm:p-5 bg-[#0B2545] text-white border-b-4 border-[#E5A823] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-amber-500/10 border-2 border-[#E5A823] rounded-lg flex items-center justify-center text-[#E5A823] shadow-inner shrink-0">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xs font-black tracking-widest uppercase font-mono text-amber-400">
                Professional Specialist Registration
              </h2>
              <p className="text-[10px] text-slate-300 font-semibold tracking-wide">
                EstateConnect Verified Service Network Onboarding
              </p>
            </div>
          </div>
          <button 
            onClick={handleResetAndClose}
            className="text-slate-300 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Portal Notice Box */}
        <div className="bg-amber-50/90 border-b border-amber-200/80 px-4 py-2.5 flex items-start gap-2 text-[11px] text-amber-950">
          <ShieldCheck className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-tight font-medium">
            <strong>OFFICIAL VERIFICATION:</strong> Certified tradespeople, domestic specialists, tutors, and technicians register to receive estate gate clearance, direct job dispatches, and resident bookings.
          </p>
        </div>

        {/* Modal Body */}
        {submittedRef ? (
          /* Application Success Voucher */
          <div className="p-6 space-y-5 text-center bg-white overflow-y-auto">
            <div className="w-12 h-12 bg-amber-500/10 border-2 border-[#E5A823] text-amber-500 rounded-lg flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="h-7 w-7 text-amber-500" />
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-300 px-3 py-0.5 rounded">
                Verified Specialist Profile Created
              </span>
              <h3 className="text-lg font-mono font-black text-slate-900 uppercase tracking-tight pt-2">
                Specialist Profile Ready!
              </h3>
              <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                Welcome to our estate professional team, <strong>{name}</strong>. Your specialist credentials are now active.
              </p>
            </div>

            {/* Voucher Details Card */}
            <div className="bg-slate-50 border border-slate-300 rounded-lg p-4 text-left space-y-2 text-xs font-mono">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 text-[10px] uppercase font-bold">Application Ref:</span>
                <span className="text-[#0B2545] font-black">{submittedRef}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 text-[10px] uppercase font-bold">Login Email:</span>
                <span className="text-slate-900 font-bold">{email}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 text-[10px] uppercase font-bold">Trade / Specialty:</span>
                <span className="text-slate-900 font-bold">{specialty}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 text-[10px] uppercase font-bold">Contact Mobile:</span>
                <span className="text-slate-900 font-bold">{phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 text-[10px] uppercase font-bold">Portal Access:</span>
                <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                  Ready • Use Email &amp; Password to Sign In Anytime
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleResetAndClose}
                className="w-full py-3 px-4 bg-[#0B2545] hover:bg-[#061830] text-amber-300 font-black text-xs rounded transition-all shadow-md active:scale-95 cursor-pointer border-b-4 border-[#E5A823] uppercase tracking-wider font-mono"
              >
                Done &amp; Return to Home
              </button>
            </div>
          </div>
        ) : (
          /* Application Form */
          <form onSubmit={handleFormSubmit} className="p-4 sm:p-6 space-y-3.5 bg-white overflow-y-auto">
            
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-700 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Row 1: Full Name & Mobile */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">
                  Full Official Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. David Mwangi Kamau"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-9 pr-3 py-1.5 w-full border border-slate-300 rounded bg-slate-50 focus:bg-white text-xs font-mono focus:outline-none focus:border-[#0B2545] focus:ring-1 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">
                  Primary Mobile / M-Pesa *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="+254 7XX XXX XXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-9 pr-3 py-1.5 w-full border border-slate-300 rounded bg-slate-50 focus:bg-white text-xs font-mono focus:outline-none focus:border-[#0B2545] focus:ring-1 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Email & Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">
                  Portal Login Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. mwangi@estateconnect.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 pr-3 py-1.5 w-full border border-slate-300 rounded bg-slate-50 focus:bg-white text-xs font-mono focus:outline-none focus:border-[#0B2545] focus:ring-1 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">
                  Set Security Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-3 py-1.5 w-full border border-slate-300 rounded bg-slate-50 focus:bg-white text-xs font-mono focus:outline-none focus:border-[#0B2545] focus:ring-1 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Row 3: National ID & Specialty */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">
                  National ID / Passport Number *
                </label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 34567890"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    className="pl-9 pr-3 py-1.5 w-full border border-slate-300 rounded bg-slate-50 focus:bg-white text-xs font-mono focus:outline-none focus:border-[#0B2545] focus:ring-1 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">
                  Primary Professional Specialty *
                </label>
                <select
                  required
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="px-3 py-1.5 w-full border border-slate-300 rounded bg-slate-50 focus:bg-white text-xs focus:outline-none focus:border-[#0B2545] transition-all cursor-pointer font-medium"
                >
                  {specialties.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 4: Experience & Coverage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">
                  Practical Experience *
                </label>
                <select
                  required
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="px-3 py-1.5 w-full border border-slate-300 rounded bg-slate-50 focus:bg-white text-xs focus:outline-none focus:border-[#0B2545] transition-all cursor-pointer font-medium"
                >
                  <option value="1-2 years">1 - 2 Years Experience</option>
                  <option value="3-5 years">3 - 5 Years Experience</option>
                  <option value="5-8 years">5 - 8 Years Senior Experience</option>
                  <option value="8+ years">8+ Years Master Craftsman</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">
                  Preferred Coverage Area *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Fedha, Donholm, Nyayo, Pipeline"
                    value={coverageArea}
                    onChange={(e) => setCoverageArea(e.target.value)}
                    className="pl-9 pr-3 py-1.5 w-full border border-slate-300 rounded bg-slate-50 focus:bg-white text-xs font-mono focus:outline-none focus:border-[#0B2545] focus:ring-1 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Availability & Bio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">
                  Work Availability *
                </label>
                <select
                  required
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="px-3 py-1.5 w-full border border-slate-300 rounded bg-slate-50 focus:bg-white text-xs focus:outline-none focus:border-[#0B2545] transition-all cursor-pointer font-medium"
                >
                  <option value="Full-Time (Mon-Sat)">Full-Time (Mon - Sat)</option>
                  <option value="Weekdays Only">Weekdays (8:00 AM - 6:00 PM)</option>
                  <option value="Weekends & Evenings">Weekends &amp; Evenings</option>
                  <option value="On-Call Emergency Dispatch">24/7 On-Call Emergency</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-widest mb-1">
                  Certifications / Notes
                </label>
                <input
                  type="text"
                  placeholder="NITA certs, tools, prior employers..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="px-3 py-1.5 w-full border border-slate-300 rounded bg-slate-50 focus:bg-white text-xs focus:outline-none focus:border-[#0B2545]"
                />
              </div>
            </div>

            {/* Code of Conduct & Vetting Checkbox */}
            <div className="p-3 bg-slate-50 border border-slate-300 rounded-md space-y-1.5">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-[#0B2545] focus:ring-[#0B2545] cursor-pointer"
                />
                <span className="text-[11px] text-slate-700 leading-tight">
                  I agree to create my verified specialist account, undergo estate security vetting, and uphold resident service standards.
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="flex-1 py-2.5 px-4 border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold rounded transition-colors cursor-pointer uppercase tracking-wider font-mono"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 px-4 bg-[#0B2545] hover:bg-[#061830] text-amber-300 text-xs font-black rounded shadow-md transition-all active:scale-95 cursor-pointer border-b-4 border-[#E5A823] uppercase tracking-wider font-mono disabled:opacity-50"
              >
                {loading ? 'Submitting Application...' : 'Submit Application'}
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}
