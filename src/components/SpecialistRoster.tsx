import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users, Search, Star, Phone, ArrowLeft, ShieldCheck, Heart, Power, ClipboardList } from 'lucide-react';
import { Provider } from '../types';

interface SpecialistRosterProps {
  providers: Provider[];
  onToggleProviderDuty: (providerId: string) => void;
  onBackToDashboard: () => void;
}

export default function SpecialistRoster({
  providers,
  onToggleProviderDuty,
  onBackToDashboard
}: SpecialistRosterProps) {
  const [specialistSearchQuery, setSpecialistSearchQuery] = useState('');

  // Filter Specialists
  const filteredProvidersForDisplay = providers.filter(prov => {
    if (!specialistSearchQuery) return true;
    const q = specialistSearchQuery.toLowerCase();
    return prov.name.toLowerCase().includes(q) || prov.specialty.toLowerCase().includes(q);
  });

  const onDutySpecialists = filteredProvidersForDisplay.filter(p => p.onDuty !== false);
  const offDutySpecialists = filteredProvidersForDisplay.filter(p => p.onDuty === false);

  // Stats
  const totalCount = filteredProvidersForDisplay.length;
  const onDutyCount = onDutySpecialists.length;
  const offDutyCount = offDutySpecialists.length;
  const activeRatio = totalCount > 0 ? Math.round((onDutyCount / totalCount) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in" id="specialist-roster-page">
      {/* Back & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm hover:translate-x-[-2px]"
          id="back-to-admin-dashboard"
        >
          <ArrowLeft className="h-4 w-4 text-slate-500" />
          Return to Dispatcher
        </button>

        <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
          Secure Dispatcher Node • Live Updates
        </span>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg border border-indigo-900/40">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-3 max-w-2xl">
          <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-400/20 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase inline-block">
            Specialist Force Command Center
          </span>
          <h1 className="text-2xl sm:text-3.5xl font-display font-black uppercase tracking-tight leading-none">
            Daily Specialist Roster
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed">
            Monitor and manage on-site field specialist availability. Keeping this roster updated ensures residents receive instantaneous service dispatch.
          </p>
        </div>
      </div>

      {/* Quick Roster Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">Total Specialists</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-display font-black text-slate-900">{totalCount}</span>
            <span className="text-xs text-slate-400">listed</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-1">
          <span className="text-[10px] font-mono text-emerald-600 uppercase tracking-wider block font-bold">On Active Duty</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-display font-black text-emerald-600">{onDutyCount}</span>
            <span className="text-xs text-emerald-500 font-bold font-mono">Ready</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-1">
          <span className="text-[10px] font-mono text-rose-500 uppercase tracking-wider block font-bold">Off Duty</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-display font-black text-rose-500">{offDutyCount}</span>
            <span className="text-xs text-slate-400 font-mono">Standby</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-1">
          <span className="text-[10px] font-mono text-indigo-600 uppercase tracking-wider block font-bold">Utilization Rate</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-display font-black text-indigo-600">{activeRatio}%</span>
            <span className="text-xs text-slate-400">deployed</span>
          </div>
        </div>
      </div>

      {/* Roster Container */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-150">
          <div>
            <h2 className="text-base font-display font-black uppercase text-slate-900 tracking-tight flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-600" />
              Contractor Availability Panel
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Instantly toggle contractor duty status to handle incoming emergency or scheduled orders.
            </p>
          </div>
          
          {/* Quick search input */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by specialist name, category, or specialty..."
              value={specialistSearchQuery}
              onChange={(e) => setSpecialistSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-1.5 w-full border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-slate-900 bg-white placeholder-slate-400 font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* ON DUTY COLUMN */}
          <div className="bg-emerald-50/20 border border-emerald-100 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <h3 className="font-mono text-xs font-black text-emerald-950 uppercase tracking-wider">
                  On Duty / Active ({onDutyCount})
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 font-bold bg-white px-2 py-0.5 rounded border border-emerald-200">
                Ready to Dispatch
              </span>
            </div>

            {onDutyCount === 0 ? (
              <div className="py-12 text-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-200 p-4">
                <p className="text-xs italic">No specialists are currently on duty for today.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {onDutySpecialists.map((prov) => (
                  <div 
                    key={prov.id}
                    className="bg-white border border-slate-150 rounded-xl p-3.5 hover:shadow-sm transition-all flex flex-col justify-between group relative overflow-hidden"
                  >
                    <div className="flex items-start gap-3">
                      <img 
                        src={prov.avatar} 
                        alt={prov.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm tracking-tight">{prov.name}</h4>
                        <span className="inline-block text-[9px] font-bold uppercase tracking-wider bg-slate-50 text-slate-600 px-2 py-0.5 rounded border border-slate-200 font-mono">
                          {prov.specialty}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold mt-1">
                          <Star className="h-3 w-3 fill-amber-400 stroke-none" />
                          {prov.rating.toFixed(1)} Rating
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-400 font-mono font-bold">{prov.phone}</span>
                      <button
                        onClick={() => onToggleProviderDuty(prov.id)}
                        className="px-2.5 py-1 text-[10px] font-extrabold uppercase bg-rose-50 text-rose-700 hover:bg-rose-100 rounded border border-rose-200 transition-all cursor-pointer"
                      >
                        Go Off-Duty
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* OFF DUTY COLUMN */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
                <h3 className="font-mono text-xs font-black text-slate-800 uppercase tracking-wider">
                  Currently Out of Duty ({offDutyCount})
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500 font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                Standby Mode
              </span>
            </div>

            {offDutyCount === 0 ? (
              <div className="py-12 text-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-200 p-4">
                <p className="text-xs italic">All specialists are currently on active duty!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {offDutySpecialists.map((prov) => (
                  <div 
                    key={prov.id}
                    className="bg-white/80 border border-slate-150 rounded-xl p-3.5 hover:shadow-sm transition-all flex flex-col justify-between opacity-85 hover:opacity-100 group relative overflow-hidden"
                  >
                    <div className="flex items-start gap-3">
                      <img 
                        src={prov.avatar} 
                        alt={prov.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0 filter grayscale"
                      />
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-slate-700 text-xs sm:text-sm tracking-tight">{prov.name}</h4>
                        <span className="inline-block text-[9px] font-bold uppercase tracking-wider bg-slate-50 text-slate-500 px-2 py-0.5 rounded border border-slate-200 font-mono">
                          {prov.specialty}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold mt-1">
                          <Star className="h-3 w-3 fill-slate-300 stroke-none" />
                          {prov.rating.toFixed(1)} Rating
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-400 font-mono">{prov.phone}</span>
                      <button
                        onClick={() => onToggleProviderDuty(prov.id)}
                        className="px-2.5 py-1 text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded border border-emerald-200 transition-all cursor-pointer"
                      >
                        Go On-Duty
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
