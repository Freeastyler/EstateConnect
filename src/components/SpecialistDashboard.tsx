import React, { useState } from 'react';
import { 
  Briefcase, 
  ShieldCheck, 
  Power, 
  CheckCircle2, 
  Clock, 
  Phone, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Award, 
  User, 
  AlertCircle,
  FileText,
  Truck,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { User as UserType, Booking } from '../types';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface SpecialistDashboardProps {
  currentUser: UserType;
  bookings: Booking[];
  onCompleteBooking: (bookingId: string) => void;
  onUpdateDutyStatus?: (onDuty: boolean) => void;
}

export default function SpecialistDashboard({
  currentUser,
  bookings,
  onCompleteBooking,
  onUpdateDutyStatus
}: SpecialistDashboardProps) {
  const [onDuty, setOnDuty] = useState<boolean>(currentUser.onDuty !== false);
  const [updatingDuty, setUpdatingDuty] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'active' | 'completed' | 'profile'>('active');

  // Filter bookings assigned to this specialist
  const myAssignedBookings = bookings.filter(b => {
    const isNameMatch = b.providerName && (
      b.providerName.toLowerCase().includes(currentUser.name.toLowerCase()) ||
      currentUser.name.toLowerCase().includes(b.providerName.toLowerCase())
    );
    const isPhoneMatch = b.providerPhone && currentUser.phone && b.providerPhone === currentUser.phone;
    return isNameMatch || isPhoneMatch;
  });

  const activeJobs = myAssignedBookings.filter(b => b.status === 'Dispatched');
  const completedJobs = myAssignedBookings.filter(b => b.status === 'Completed');

  // Total earnings estimate
  const totalEarnings = completedJobs.reduce((acc, b) => acc + (b.price || 0), 0);

  const toggleDuty = async () => {
    const newStatus = !onDuty;
    setUpdatingDuty(true);
    setOnDuty(newStatus);

    try {
      // 1. Update user profile document in Firestore
      const userRef = doc(db, 'users', currentUser.id);
      await updateDoc(userRef, { onDuty: newStatus });

      // 2. Also update provider document if existing
      const provRef = doc(db, 'providers', currentUser.id);
      await updateDoc(provRef, { onDuty: newStatus }).catch(() => {});

      if (onUpdateDutyStatus) {
        onUpdateDutyStatus(newStatus);
      }
    } catch (err) {
      console.warn('Notice updating duty in firestore:', err);
    } finally {
      setUpdatingDuty(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in" id="specialist-dashboard">
      
      {/* Top Banner - Professional Specialist Maseno Style */}
      <div className="bg-[#0B2545] rounded-2xl p-5 sm:p-7 text-white border-b-4 border-[#E5A823] shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="bg-[#E5A823] text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded font-mono tracking-wider">
                Certified Service Contractor
              </span>
              <span className="text-slate-300 text-xs font-mono">
                Gate Pass ID: #{currentUser.id.slice(-6).toUpperCase()}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-mono font-black tracking-tight uppercase">
              {currentUser.name}
            </h1>
            <p className="text-xs text-slate-300 font-medium">
              Specialty: <strong className="text-amber-300 font-bold">{currentUser.specialty || 'General Maintenance & Trades'}</strong> • Coverage: {currentUser.coverageArea || currentUser.estateName || 'Fedha Estate & Nairobi East'}
            </p>
          </div>

          {/* Active Duty Status Switch Card */}
          <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-3 flex items-center justify-between gap-4 shrink-0 shadow-inner">
            <div>
              <span className="text-[9px] font-mono uppercase text-slate-400 font-bold block">Dispatch Status</span>
              <span className={`text-xs font-mono font-bold flex items-center gap-1.5 ${onDuty ? 'text-emerald-400' : 'text-rose-400'}`}>
                <span className={`w-2 h-2 rounded-full ${onDuty ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                {onDuty ? 'ON ACTIVE DUTY' : 'OFF DUTY (STANDBY)'}
              </span>
            </div>

            <button
              onClick={toggleDuty}
              disabled={updatingDuty}
              className={`px-3.5 py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
                onDuty 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
              }`}
            >
              <Power className="h-3.5 w-3.5" />
              {updatingDuty ? 'Updating...' : onDuty ? 'Go Off Duty' : 'Go On Duty'}
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-1">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-500">Active Dispatches</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-black text-[#0B2545]">{activeJobs.length}</span>
            <span className="text-xs text-slate-400 font-medium">pending work</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-1">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-500">Completed Orders</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-black text-emerald-600">{completedJobs.length}</span>
            <span className="text-xs text-emerald-600 font-medium font-mono">cleared</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-1">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-500">Resident Rating</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-mono font-black text-amber-500">5.0 ★</span>
            <span className="text-xs text-slate-400 font-medium">Top Rated</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-1">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-500">Total Billed</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-mono font-black text-slate-900">KES {totalEarnings.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setSelectedTab('active')}
          className={`px-4 py-2 text-xs font-mono font-bold uppercase rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
            selectedTab === 'active'
              ? 'bg-[#0B2545] text-amber-300 shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <Truck className="h-3.5 w-3.5" />
          Active Dispatched Jobs ({activeJobs.length})
        </button>

        <button
          onClick={() => setSelectedTab('completed')}
          className={`px-4 py-2 text-xs font-mono font-bold uppercase rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
            selectedTab === 'completed'
              ? 'bg-[#0B2545] text-amber-300 shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          Job History ({completedJobs.length})
        </button>

        <button
          onClick={() => setSelectedTab('profile')}
          className={`px-4 py-2 text-xs font-mono font-bold uppercase rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
            selectedTab === 'profile'
              ? 'bg-[#0B2545] text-amber-300 shadow-xs'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <User className="h-3.5 w-3.5" />
          My Credentials &amp; Pass
        </button>
      </div>

      {/* Tab 1: Active Dispatched Jobs */}
      {selectedTab === 'active' && (
        <div className="space-y-4">
          {activeJobs.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-3">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-mono font-bold text-slate-800 uppercase">
                No Active Dispatches at the moment
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                {onDuty 
                  ? "You are currently On Duty and will receive estate dispatch notifications as soon as residents place service orders matching your specialty."
                  : "You are currently Off Duty. Turn on your Active Duty status above to start receiving instant dispatches."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeJobs.map((job) => (
                <div 
                  key={job.id}
                  className="bg-white border-2 border-amber-300 rounded-xl p-5 shadow-sm space-y-3 relative overflow-hidden"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-black uppercase text-amber-700 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded">
                        DISPATCHED TO YOU
                      </span>
                      <h3 className="text-sm font-mono font-black text-slate-900 uppercase mt-1">
                        {job.serviceName}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Category: {job.categoryName}
                      </p>
                    </div>
                    <span className="text-sm font-mono font-black text-[#0B2545]">
                      KES {job.price.toLocaleString()}
                    </span>
                  </div>

                  {/* Resident details for dispatch visit */}
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1.5 text-xs font-mono">
                    <div className="flex items-center gap-2 text-slate-700">
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      <span>Resident: <strong>{job.residentName}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      <span>Contact: <a href={`tel:${job.phone}`} className="text-blue-600 underline font-bold">{job.phone}</a></span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span>Location: <strong>{job.estateName} - {job.houseDetails}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>Schedule: {job.date} at {job.time}</span>
                    </div>
                    {job.notes && (
                      <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-200 mt-1">
                        <strong>Resident Note:</strong> {job.notes}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => onCompleteBooking(job.id)}
                      className="flex-1 py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white font-mono font-black text-xs rounded transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Mark Work As Completed
                    </button>
                    <a
                      href={`tel:${job.phone}`}
                      className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono font-bold text-xs rounded border border-slate-300 flex items-center gap-1"
                    >
                      <Phone className="h-3.5 w-3.5 text-slate-600" />
                      Call
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Job History */}
      {selectedTab === 'completed' && (
        <div className="space-y-4">
          {completedJobs.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-xs text-slate-500 font-mono">
              No completed jobs recorded yet.
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Order / Service</th>
                    <th className="p-3">Resident</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {completedJobs.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{b.serviceName}</td>
                      <td className="p-3 text-slate-700">{b.residentName}</td>
                      <td className="p-3 text-slate-600">{b.estateName} ({b.houseDetails})</td>
                      <td className="p-3 text-slate-500">{b.date}</td>
                      <td className="p-3 font-bold text-emerald-700">KES {b.price.toLocaleString()}</td>
                      <td className="p-3">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                          COMPLETED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Credentials & Clearance */}
      {selectedTab === 'profile' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs max-w-2xl space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <div className="w-12 h-12 bg-amber-100 border-2 border-amber-400 rounded-xl flex items-center justify-center text-amber-800 font-mono font-black text-lg">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-base font-mono font-black text-slate-900 uppercase">
                {currentUser.name}
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                Official EstateConnect Vetted Service Specialist
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <span className="text-[10px] uppercase text-slate-400 font-bold block">Trade Specialty</span>
              <span className="font-bold text-slate-900">{currentUser.specialty || 'General Technical Services'}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase text-slate-400 font-bold block">Contact Mobile</span>
              <span className="font-bold text-slate-900">{currentUser.phone || 'N/A'}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase text-slate-400 font-bold block">Portal Email</span>
              <span className="font-bold text-slate-900">{currentUser.email}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase text-slate-400 font-bold block">Coverage Zone</span>
              <span className="font-bold text-slate-900">{currentUser.coverageArea || currentUser.estateName || 'Fedha Estate'}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase text-slate-400 font-bold block">Gate Clearance Badge</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                VERIFIED ESTATE BADGE #EC-{currentUser.id.slice(-4).toUpperCase()}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase text-slate-400 font-bold block">Experience Record</span>
              <span className="font-bold text-slate-900">{currentUser.experienceYears || '3+ Years Certified'}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
