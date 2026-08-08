import React from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Droplet, 
  Zap, 
  Shirt, 
  ShoppingBag, 
  BookOpen,
  ShieldCheck, 
  Clock, 
  MapPin, 
  Star,
  Users,
  Tv,
  Bug,
  Scissors,
  Baby,
  Truck,
  Car
} from 'lucide-react';
import { MOCK_SERVICES } from '../mockData';

interface LandingPageProps {
  onOpenAuth: () => void;
  onSelectCategoryPreview: (categoryId: string) => void;
}

export default function LandingPage({ onOpenAuth, onSelectCategoryPreview }: LandingPageProps) {
  
  // Helper to map string to actual Lucide component
  const renderIcon = (iconName: string, className: string) => {
    switch(iconName) {
      case 'Sparkles': return <Sparkles className={className} />;
      case 'Droplet': return <Droplet className={className} />;
      case 'Zap': return <Zap className={className} />;
      case 'Shirt': return <Shirt className={className} />;
      case 'ShoppingBag': return <ShoppingBag className={className} />;
      case 'BookOpen': return <BookOpen className={className} />;
      case 'Tv': return <Tv className={className} />;
      case 'Bug': return <Bug className={className} />;
      case 'Scissors': return <Scissors className={className} />;
      case 'Baby': return <Baby className={className} />;
      case 'Truck': return <Truck className={className} />;
      case 'Car': return <Car className={className} />;
      default: return <BookOpen className={className} />;
    }
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen font-sans" id="landing-page">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-[#FAF7F2] pt-12 pb-16 sm:pb-20 lg:pt-20 lg:pb-28 border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            
            {/* Text Side */}
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-stone-900 tracking-tight leading-none">
                Friendly <span className="theme-display-italic text-emerald-800">Domestic</span> <br className="hidden sm:inline" />
                Services <span className="text-stone-600 font-normal">at Your</span> Doorstep.
              </h1>
              
              <p className="mt-5 text-base sm:text-lg text-stone-800 font-semibold leading-relaxed max-w-xl sm:mx-auto lg:mx-0">
                Bridging the gap between busy residents and verified local service providers.
              </p>
              
              <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xl sm:mx-auto lg:mx-0 font-medium">
                EstateConnect connects verified, vetted local specialists in Kids Home Tuition, Cleaning, Plumbing, Electrical, Laundry, and Grocery Delivery directly to your estate with complete speed, quality, and coordinated safety.
              </p>

              <div className="mt-8 sm:flex sm:justify-center lg:justify-start gap-4">
                <button
                  onClick={onOpenAuth}
                  className="flex w-full sm:w-auto items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm shadow-md shadow-emerald-900/15 hover:shadow-lg active:scale-95 transition-all cursor-pointer"
                >
                  Book Your First Service
                  <ArrowRight className="h-4 w-4" />
                </button>
                <a
                  href="#how-it-works"
                  className="flex w-full sm:w-auto items-center justify-center py-3 px-6 mt-3 sm:mt-0 rounded-2xl bg-stone-200/70 hover:bg-stone-300/80 text-stone-800 font-bold text-sm transition-all"
                >
                  Explore How It Works
                </a>
              </div>

              {/* Badges / Micro proof */}
              <div className="mt-8 pt-6 border-t border-stone-200/80 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
                <div className="text-left">
                  <p className="text-xl font-extrabold text-emerald-900 font-display">100%</p>
                  <p className="text-xs text-stone-500 font-medium">Vetted Staff</p>
                </div>
                <div className="text-left border-l border-stone-200 pl-4">
                  <p className="text-xl font-extrabold text-emerald-900 font-display">30 mins</p>
                  <p className="text-xs text-stone-500 font-medium">Average ETA</p>
                </div>
                <div className="text-left border-l border-stone-200 pl-4">
                  <p className="text-xl font-extrabold text-emerald-900 font-display">5/5★</p>
                  <p className="text-xs text-stone-500 font-medium">Resident Rating</p>
                </div>
              </div>
            </div>

            {/* Visual Card Side */}
            <div className="mt-10 sm:mt-12 lg:mt-0 lg:col-span-6">
              <div className="relative mx-auto max-w-lg lg:max-w-none">
                {/* Decorative gradients */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500 to-amber-500 opacity-20 blur-xl" />
                
                {/* Main Mockup UI Component */}
                <div className="relative bg-white border border-stone-200/90 rounded-3xl shadow-xl overflow-hidden p-6">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-xs text-stone-400 font-mono">estateconnect.com/active-booking</span>
                  </div>

                  {/* Booking tracker mock card */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-stone-900">Active Order Dispatch</h4>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300/80">
                        ● Dispatched
                      </span>
                    </div>

                    <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Service Request</p>
                          <p className="text-sm font-bold text-stone-900">Sofa & Carpet Cleaning</p>
                        </div>
                        <span className="text-sm font-extrabold text-emerald-800">$50.00</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-200">
                        <div>
                          <p className="text-[10px] font-semibold text-stone-500">Scheduled Time</p>
                          <p className="text-xs font-bold text-stone-800">Today, 2:30 PM</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold text-stone-500">Address Details</p>
                          <p className="text-xs font-bold text-stone-800">Villa B12, Fedha Estate</p>
                        </div>
                      </div>
                    </div>

                    {/* Assigned Specialist Card */}
                    <div className="flex items-center justify-between bg-emerald-50/80 border border-emerald-200/80 p-3 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                          alt="Specialist"
                          className="w-10 h-10 rounded-full object-cover border-2 border-emerald-300"
                        />
                        <div>
                          <p className="text-xs text-emerald-950 font-bold">Jane Mwangi</p>
                          <p className="text-[10px] text-emerald-800 font-semibold">Verified Cleaner • ★4.9</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-900 font-mono bg-emerald-200/60 px-2 py-1 rounded-lg">ETA: 12 Mins</span>
                    </div>

                    {/* Quick call tracker */}
                    <div className="flex items-center gap-2 text-stone-500 text-[11px] font-medium">
                      <Clock className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      <span>Security gate code auto-notified to provider upon clearance.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. How It Works Section */}
      <section className="py-24 bg-[#FAF7F2]" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <span className="theme-sub-label">Coordinated Flow</span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-display font-black text-slate-900 uppercase tracking-tight">
              Domestic Chores, <span className="theme-display-italic">Simplified</span> in Three Steps
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-500">
              We design our flow to fit seamlessly into busy estate lives. Fully coordinated, quick, and highly reliable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 relative">
            {/* Step 1 */}
            <div className="theme-card p-8 bg-white relative group">
              <span className="absolute -top-4 left-8 bg-slate-900 text-teal-400 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg">
                1
              </span>
              <div className="mt-4 space-y-2">
                <h3 className="text-lg font-black text-slate-900 font-display uppercase tracking-tight">Browse & Customize</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Select from cleaning, plumbing, laundry, electrical, or fresh grocery bundles. Pick exactly what services match your home needs.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="theme-card p-8 bg-white relative group">
              <span className="absolute -top-4 left-8 bg-slate-900 text-teal-400 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg">
                2
              </span>
              <div className="mt-4 space-y-2">
                <h3 className="text-lg font-black text-slate-900 font-display uppercase tracking-tight">Schedule instantly</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Pick a preferred date and hour. Enter your house details once; we authorize background-checked specialists so security clears them.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="theme-card p-8 bg-white relative group">
              <span className="absolute -top-4 left-8 bg-teal-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg">
                3
              </span>
              <div className="mt-4 space-y-2">
                <h3 className="text-lg font-black text-slate-900 font-display uppercase tracking-tight">Delivered & Tracked</h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Track dispatchers in real-time. Verify provider ratings, contact info, and clear invoices effortlessly with fully digital records.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Services Preview Section */}
      <section className="py-24 bg-white border-y border-slate-100" id="services-preview">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="max-w-xl">
              <span className="theme-sub-label">Premium Core Services</span>
              <h2 className="text-3xl sm:text-4xl font-display font-black text-slate-900 uppercase tracking-tight mt-1">
                Our Estate <span className="theme-display-italic">Service</span> Catalog
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-500">
                Choose any category to view individual service durations, rates, and detailed bundles.
              </p>
            </div>
            <button
              onClick={onOpenAuth}
              className="mt-4 md:mt-0 flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase text-teal-600 hover:text-teal-800 transition-colors group cursor-pointer self-start"
            >
              Sign In to Book Catalog
              <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_SERVICES.map((category) => (
              <div
                key={category.id}
                onClick={() => onSelectCategoryPreview(category.id)}
                className={`p-8 rounded-[2rem] border border-slate-200/80 shadow-sm hover:border-teal-500 hover:shadow-lg hover:shadow-teal-600/5 transition-all cursor-pointer text-left ${category.bgColor} flex flex-col justify-between h-80 relative overflow-hidden`}
              >
                {category.id === 'tuition' && (
                  <div className="absolute top-4 right-4 bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full shadow-xs">
                    New Core Service
                  </div>
                )}
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm text-slate-800 mb-5 border border-slate-100">
                    {renderIcon(category.icon, "h-6 w-6")}
                  </div>
                  <h3 className="text-xl font-black text-slate-900 font-display uppercase tracking-tight">{category.name}</h3>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {category.description}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200/50 flex justify-between items-center">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                    {category.items.length} options available
                  </span>
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                    Book Now <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Trust & Security Banner */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <ShieldCheck className="h-14 w-14 text-teal-400 mx-auto" />
            <span className="theme-sub-label text-teal-400/80">Estate Security Sync</span>
            <h2 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight">
              Integrated with <span className="theme-display-italic text-teal-400">Estate Security</span> Systems
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
              We work closely with gate houses and estate administration. All dispatch workers carry physical digital IDs, and their entry codes are synchronized automatically with visitor registry software.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-slate-800">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-teal-400 font-display uppercase tracking-tight">100% Vetted</span>
                <span className="text-xs text-slate-500 mt-1">Criminal & reference checks</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-teal-400 font-display uppercase tracking-tight">Contactless Gate</span>
                <span className="text-xs text-slate-500 mt-1">Automatic code notifications</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-teal-400 font-display uppercase tracking-tight">Fully Insured</span>
                <span className="text-xs text-slate-500 mt-1">Damage protection policy</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Quick CTA */}
      <section className="py-24 bg-[#FAF7F2]">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-br from-slate-900 to-teal-950 text-white rounded-[2.5rem] p-10 sm:p-16 relative overflow-hidden shadow-2xl">
            <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-teal-500/20 blur-3xl" />
            <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-indigo-500/20 blur-3xl" />
            
            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              <span className="text-xs font-bold tracking-widest uppercase text-teal-400 font-mono">Get Started Today</span>
              <h2 className="text-3xl sm:text-5xl font-display font-black uppercase tracking-tight leading-none">
                Simplifying Domestic Life, <span className="theme-display-italic text-teal-400">One Estate</span> at a Time
              </h2>
              <p className="text-xs sm:text-sm text-teal-200/80 leading-relaxed">
                Register as a resident of Fedha Estate in 60 seconds and start scheduling trusted service providers.
              </p>
              <div className="pt-2">
                <button
                  onClick={onOpenAuth}
                  className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-slate-900 font-black tracking-wider uppercase text-xs rounded-xl transition-all shadow-lg hover:shadow-teal-500/15 cursor-pointer active:scale-95 inline-flex items-center gap-2"
                >
                  Create Your Account
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
