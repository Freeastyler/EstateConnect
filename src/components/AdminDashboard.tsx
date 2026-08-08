import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Phone, 
  Loader2, 
  Search, 
  Star, 
  X,
  AlertCircle,
  Briefcase,
  TrendingUp,
  Trash2,
  PlusCircle,
  FolderArchive,
  DollarSign,
  UserPlus,
  ArrowUpRight,
  ShieldAlert,
  SlidersHorizontal
} from 'lucide-react';
import { Booking, Provider } from '../types';

interface AdminDashboardProps {
  bookings: Booking[];
  providers: Provider[];
  onDispatchBooking: (bookingId: string, provider: Provider) => void;
  onCompleteBooking: (bookingId: string) => void;
  onDeleteBooking: (bookingId: string) => void;
  onOfferQuote: (bookingId: string, price: number) => void;
  onRegisterProvider: (provider: Omit<Provider, 'id' | 'rating'>) => void;
  onToggleProviderDuty: (providerId: string) => void;
  onNavigateToRoster?: () => void;
}

export default function AdminDashboard({
  bookings,
  providers,
  onDispatchBooking,
  onCompleteBooking,
  onDeleteBooking,
  onOfferQuote,
  onRegisterProvider,
  onToggleProviderDuty,
  onNavigateToRoster
}: AdminDashboardProps) {
  const [selectedBookingForDispatch, setSelectedBookingForDispatch] = useState<Booking | null>(null);
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [activeDropdownBookingId, setActiveDropdownBookingId] = useState<string | null>(null);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Awaiting Quote' | 'Quote Offered' | 'Pending' | 'Dispatched' | 'Completed' | 'Canceled'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [specialistSearchQuery, setSpecialistSearchQuery] = useState('');
  const [quotePrices, setQuotePrices] = useState<Record<string, string>>({});

  // Register Specialist Form State
  const [newExpertName, setNewExpertName] = useState('');
  const [newExpertPhone, setNewExpertPhone] = useState('');
  const [newExpertSpecialty, setNewExpertSpecialty] = useState('Cleaning Services');
  const [newExpertAvatar, setNewExpertAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');

  // Specialties available for selection
  const specialties = [
    'Cleaning Services',
    'Plumbing',
    'Electrical Support',
    'Laundry & Dry Clean',
    'Grocery Delivery',
    'Kids Home Tuition',
    'TV Wall Mounting',
    'Pest Control',
    'Beauty & Personal Care',
    'Childcare & Babysitting',
    'Moving & Transport',
    'Water & Utility Services',
    'Car Care & Services'
  ];

  // List of professional pre-set corporate avatars to make registration fun
  const presetAvatars = [
    { name: 'Classic Corporate Male', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { name: 'Classic Corporate Female', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
    { name: 'Modern Tech Male', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
    { name: 'Modern Tech Female', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
    { name: 'Senior Consultant Female', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' }
  ];

  // Accountant Financial Ledger Calculations
  const grossSettledRevenue = bookings
    .filter(b => b.status === 'Completed')
    .reduce((sum, b) => sum + b.price, 0);

  const activeWIPValue = bookings
    .filter(b => b.status === 'Dispatched')
    .reduce((sum, b) => sum + b.price, 0);

  const liabilityPipeline = bookings
    .filter(b => b.status === 'Pending')
    .reduce((sum, b) => sum + b.price, 0);

  const canceledLoss = bookings
    .filter(b => b.status === 'Canceled')
    .reduce((sum, b) => sum + b.price, 0);

  // General counts
  const awaitingQuoteCount = bookings.filter(b => b.status === 'Awaiting Quote').length;
  const quoteOfferedCount = bookings.filter(b => b.status === 'Quote Offered').length;
  const pendingCount = bookings.filter(b => b.status === 'Pending').length;
  const dispatchedCount = bookings.filter(b => b.status === 'Dispatched').length;
  const completedCount = bookings.filter(b => b.status === 'Completed').length;
  const canceledCount = bookings.filter(b => b.status === 'Canceled').length;

  // Filter Specialists/Providers
  const filteredProvidersForDisplay = providers.filter(prov => {
    if (!specialistSearchQuery) return true;
    const q = specialistSearchQuery.toLowerCase();
    return prov.name.toLowerCase().includes(q) || prov.specialty.toLowerCase().includes(q);
  });

  const onDutySpecialists = filteredProvidersForDisplay.filter(p => p.onDuty !== false);
  const offDutySpecialists = filteredProvidersForDisplay.filter(p => p.onDuty === false);

  // Filter Logic
  const filteredBookings = bookings.filter(booking => {
    // Status Filter
    if (statusFilter !== 'All' && booking.status !== statusFilter) return false;

    // Search query matches (Resident Name, House DETAILS, Service, or ID)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchId = booking.id.toLowerCase().includes(q);
      const matchName = booking.residentName.toLowerCase().includes(q);
      const matchHouse = booking.houseDetails.toLowerCase().includes(q);
      const matchEstate = booking.estateName.toLowerCase().includes(q);
      const matchService = booking.serviceName.toLowerCase().includes(q);
      return matchId || matchName || matchHouse || matchEstate || matchService;
    }

    return true;
  });

  const handleOpenDispatch = (booking: Booking) => {
    setSelectedBookingForDispatch(booking);
    setDispatchModalOpen(true);
  };

  const handleCloseDispatch = () => {
    setSelectedBookingForDispatch(null);
    setDispatchModalOpen(false);
  };

  const handleAssignProvider = (provider: Provider) => {
    if (!selectedBookingForDispatch) return;
    onDispatchBooking(selectedBookingForDispatch.id, provider);
    handleCloseDispatch();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpertName || !newExpertPhone) return;
    onRegisterProvider({
      name: newExpertName,
      phone: newExpertPhone,
      specialty: newExpertSpecialty,
      avatar: newExpertAvatar
    });
    // Reset Form
    setNewExpertName('');
    setNewExpertPhone('');
    setRegisterModalOpen(false);
  };

  // Helper to find eligible matching specialists
  const getEligibleProviders = (categoryName: string): Provider[] => {
    return providers.filter(provider => {
      const pSpecialty = provider.specialty.toLowerCase();
      const cat = categoryName.toLowerCase();
      
      if (cat.includes('cleaning') && pSpecialty.includes('cleaning')) return true;
      if (cat.includes('plumbing') && pSpecialty.includes('plumbing')) return true;
      if (cat.includes('electrical') && pSpecialty.includes('electrical')) return true;
      if (cat.includes('laundry') && pSpecialty.includes('laundry')) return true;
      if (cat.includes('grocery') && pSpecialty.includes('grocery')) return true;
      if (cat.includes('tuition') && pSpecialty.includes('tuition')) return true;
      if (cat.includes('tv') && pSpecialty.includes('tv')) return true;
      if (cat.includes('pest') && pSpecialty.includes('pest')) return true;
      if (cat.includes('beauty') && pSpecialty.includes('beauty')) return true;
      if (cat.includes('childcare') && pSpecialty.includes('childcare')) return true;
      if (cat.includes('moving') && pSpecialty.includes('moving')) return true;
      if (cat.includes('water') && pSpecialty.includes('water')) return true;
      if (cat.includes('car') && pSpecialty.includes('car')) return true;
      
      if (pSpecialty === cat || cat.includes(pSpecialty) || pSpecialty.includes(cat)) return true;
      return false;
    });
  };

  return (
    <div className="bg-[#F1F5F9] min-h-screen py-8 text-slate-900 border-t border-slate-200" id="admin-dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 animate-fade-in">
        
        {/* Executive Header Segment */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  ★ Dispatcher Portal
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Active Booking Manager
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-black uppercase tracking-tight text-white mt-3">
                Manage Bookings &amp; Assignments
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
                View, track, and assign home services to specialists. Filter active requests, dispatch staff, or register new providers for your estate.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setRegisterModalOpen(true)}
                className="flex items-center gap-2 py-3 px-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 cursor-pointer border-none"
              >
                <UserPlus className="h-4 w-4 text-white" />
                Add New Specialist
              </button>
              
              <div className="bg-slate-800 border border-slate-700 px-4 py-3 rounded-xl flex flex-col justify-center">
                <span className="text-[10px] text-slate-400 font-mono">System Status</span>
                <span className="text-[11px] font-black uppercase text-emerald-400 tracking-wide flex items-center gap-1">
                  ● ONLINE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Financial Ledger Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="accounting-ledger-stats">
          
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-400">
                Settled Revenue
              </p>
              <h3 className="text-2xl font-black text-slate-900 font-display">
                ${grossSettledRevenue.toFixed(2)}
              </h3>
              <p className="text-[9px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-2.5 w-2.5" />
                Completed Bookings
              </p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-400">
                Work In Progress
              </p>
              <h3 className="text-2xl font-black text-slate-900 font-display">
                ${activeWIPValue.toFixed(2)}
              </h3>
              <p className="text-[9px] text-blue-600 font-semibold flex items-center gap-1">
                <Truck className="h-2.5 w-2.5 animate-pulse" />
                Currently Dispatched
              </p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-400">
                Pending Pipeline
              </p>
              <h3 className="text-2xl font-black text-slate-900 font-display">
                ${liabilityPipeline.toFixed(2)}
              </h3>
              <p className="text-[9px] text-amber-600 font-semibold flex items-center gap-1">
                <Clock className="h-2.5 w-2.5 animate-pulse" />
                Awaiting Specialist
              </p>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Briefcase className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-mono font-black uppercase tracking-wider text-slate-400">
                Canceled Revenue
              </p>
              <h3 className="text-2xl font-black text-slate-400 line-through font-display">
                ${canceledLoss.toFixed(2)}
              </h3>
              <p className="text-[9px] text-rose-600 font-semibold flex items-center gap-1">
                <X className="h-2.5 w-2.5" />
                Retracted Orders
              </p>
            </div>
            <div className="p-3 bg-rose-50/75 text-rose-600 rounded-xl">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>

        </div>

        {/* Core Ledger Panel with a Different Modern Design (Clean, high-contrast, premium workspace) */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden" id="ledger-core-table">
          
          {/* Table Toolbar & Search filter with crisp accountant-ledger aesthetics */}
          <div className="p-6 border-b border-slate-150 bg-slate-50 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            
            <div className="space-y-1">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider font-mono">
                Bookings Registry
              </h2>
              <p className="text-[11px] text-slate-500">
                Review and update active home service bookings and specialist assignments
              </p>
            </div>

            {/* Search filter input */}
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, ID, house or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-full border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-slate-950 focus:ring-1 focus:ring-slate-950 bg-white placeholder-slate-400 text-slate-900 font-medium"
              />
            </div>

            {/* Filter segments representing accounting logs */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
                <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" /> View Filter:
              </span>
              <div className="flex gap-1 overflow-x-auto p-1 bg-slate-200/60 rounded-xl border border-slate-250">
                {(['All', 'Awaiting Quote', 'Quote Offered', 'Pending', 'Dispatched', 'Completed', 'Canceled'] as const).map((tab) => {
                  const counts = {
                    All: bookings.length,
                    'Awaiting Quote': awaitingQuoteCount,
                    'Quote Offered': quoteOfferedCount,
                    Pending: pendingCount,
                    Dispatched: dispatchedCount,
                    Completed: completedCount,
                    Canceled: canceledCount
                  };
                  return (
                    <button
                      key={tab}
                      onClick={() => setStatusFilter(tab)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        statusFilter === tab 
                          ? 'bg-slate-900 text-white shadow-sm' 
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
                      }`}
                    >
                      {tab} ({counts[tab]})
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Bookings Table */}
          {filteredBookings.length === 0 ? (
            <div className="p-16 text-center text-slate-400 space-y-3">
              <AlertCircle className="h-10 w-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700 font-display">No bookings found</p>
              <p className="text-xs text-slate-400">Try changing your search terms or selecting another status above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-600 font-black font-mono tracking-wider border-b border-slate-200 uppercase text-[10px] select-none">
                    <th className="p-4 pl-6 border-r border-slate-200/60">Booking ID &amp; Date</th>
                    <th className="p-4 border-r border-slate-200/60">Resident Details</th>
                    <th className="p-4 border-r border-slate-200/60">Requested Service</th>
                    <th className="p-4 border-r border-slate-200/60">Special Instructions</th>
                    <th className="p-4 border-r border-slate-200/60 font-mono text-right">Price</th>
                    <th className="p-4 border-r border-slate-200/60">Status &amp; Assigned Specialist</th>
                    <th className="p-4 pr-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 font-medium text-slate-700 bg-white">
                  {filteredBookings.map((booking) => {
                    return (
                      <tr key={booking.id} className="hover:bg-slate-50 transition-colors group">
                        
                        {/* Booking ID / Date */}
                        <td className="p-4 pl-6 space-y-1 border-r border-slate-200/60 align-middle">
                          <p className="font-mono font-black text-slate-900 bg-slate-100 py-1 px-2.5 rounded border border-slate-200 inline-block text-[11px] shadow-xs group-hover:bg-white">
                            {booking.id}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono" title="Creation Date">
                            Date: {new Date(booking.createdAt).toLocaleDateString()}
                          </p>
                        </td>

                        {/* Resident Details */}
                        <td className="p-4 space-y-1 border-r border-slate-200/60 align-middle">
                          <p className="font-extrabold text-slate-950 text-sm">
                            {booking.residentName}
                          </p>
                          <div className="flex flex-col gap-0.5 text-[10px] leading-tight">
                            <span className="font-mono font-semibold text-slate-500">☎ {booking.phone}</span>
                            <span className="mt-1 inline-flex items-center gap-1 font-bold text-slate-700 tracking-wide uppercase text-[9px] bg-indigo-50 text-indigo-850 px-2 py-0.5 rounded border border-indigo-150 self-start">
                              📍 {booking.estateName} ({booking.houseDetails})
                            </span>
                          </div>
                        </td>

                        {/* Service Asset Category */}
                        <td className="p-4 space-y-1 border-r border-slate-200/60 align-middle">
                          <p className="font-black text-slate-900 text-sm">{booking.serviceName}</p>
                          <span className="inline-block text-[9px] bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded font-black uppercase tracking-wider font-mono">
                            {booking.categoryName}
                          </span>
                        </td>

                        {/* Special Instructions & Notes */}
                        <td className="p-4 max-w-[220px] border-r border-slate-200/60 align-middle">
                          {booking.notes ? (
                            <p className="text-xs text-slate-600 italic bg-amber-50/50 border border-amber-200/60 p-2.5 rounded-xl leading-relaxed">
                              "{booking.notes}"
                            </p>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic font-mono">— None —</span>
                          )}
                        </td>

                        {/* Fee (Tabular Numbers) */}
                        <td className="p-4 font-mono font-black text-right text-slate-900 text-sm border-r border-slate-200/60 align-middle bg-slate-50/30 group-hover:bg-slate-50/10">
                          {booking.status === 'Awaiting Quote' ? (
                            <span className="text-[10px] text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-bold italic">Not Quoted</span>
                          ) : (
                            `$${booking.price.toFixed(2)}`
                          )}
                        </td>

                        {/* Status & Allocation */}
                        <td className="p-4 space-y-2 border-r border-slate-200/60 align-middle">
                          <div>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                              booking.status === 'Awaiting Quote'
                                ? 'bg-slate-50 text-slate-600 border-slate-300'
                                : booking.status === 'Quote Offered'
                                  ? 'bg-amber-50 text-amber-700 border-amber-300 animate-pulse'
                                  : booking.status === 'Pending' 
                                    ? 'bg-blue-50 text-blue-700 border-blue-300' 
                                    : booking.status === 'Dispatched'
                                      ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                                      : booking.status === 'Completed'
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                        : 'bg-rose-50 text-rose-700 border-rose-300'
                            }`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${
                                booking.status === 'Awaiting Quote'
                                  ? 'bg-slate-400'
                                  : booking.status === 'Quote Offered'
                                    ? 'bg-amber-500 animate-pulse'
                                    : booking.status === 'Pending' 
                                      ? 'bg-blue-500 animate-pulse' 
                                      : booking.status === 'Dispatched'
                                        ? 'bg-indigo-500 animate-pulse'
                                        : booking.status === 'Completed'
                                          ? 'bg-emerald-500'
                                          : 'bg-rose-500'
                              }`} />
                              {booking.status}
                            </span>
                          </div>

                          {booking.status === 'Canceled' ? (
                            <div className="text-[10px] text-rose-600 font-bold uppercase tracking-wider font-mono flex items-center gap-1 bg-rose-50 border border-rose-100 p-1 rounded">
                              ✕ Canceled by Resident
                            </div>
                          ) : booking.status === 'Awaiting Quote' ? (
                            <span className="text-[10px] text-slate-500 italic flex items-center gap-1 font-bold bg-slate-50 border border-slate-200 p-1 rounded">
                              🔍 Price Quote Required
                            </span>
                          ) : booking.status === 'Quote Offered' ? (
                            <span className="text-[10px] text-amber-600 italic flex items-center gap-1 font-bold bg-amber-50/50 border border-amber-200 p-1 rounded">
                              ⏳ Pending Client Acceptance
                            </span>
                          ) : booking.providerName ? (
                            <div className="flex items-center gap-2 bg-slate-50 p-1.5 border border-slate-200 rounded-lg shadow-2xs group-hover:bg-white transition-colors">
                              <img
                                src={providers.find(p => p.name === booking.providerName)?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&auto=format&fit=crop&q=80'}
                                alt={booking.providerName}
                                className="w-6 h-6 rounded-full object-cover border border-slate-300 shrink-0"
                              />
                              <div className="leading-tight">
                                <p className="text-[10px] font-black text-slate-900">{booking.providerName}</p>
                                <p className="text-[9px] text-slate-400 font-mono">{booking.providerPhone}</p>
                              </div>
                            </div>
                          ) : (
                            <span className="text-[10px] text-amber-700 italic flex items-center gap-1 font-bold bg-amber-50 border border-amber-100 p-1 rounded">
                              <Loader2 className="h-3 w-3 animate-spin text-amber-500" /> Needs Specialist
                            </span>
                          )}
                        </td>

                        {/* Action Button Column */}
                        <td className="p-4 pr-6 text-right align-middle">
                          {booking.status === 'Awaiting Quote' && (
                            <div className="flex items-center justify-end gap-2">
                              <div className="relative rounded-lg shadow-2xs">
                                <span className="absolute left-2 top-2 text-[10px] font-bold text-slate-400 font-mono">$</span>
                                <input
                                  type="number"
                                  placeholder="0.00"
                                  value={quotePrices[booking.id] || ''}
                                  onChange={(e) => setQuotePrices(prev => ({ ...prev, [booking.id]: e.target.value }))}
                                  className="pl-4 pr-1.5 py-1.5 w-20 border border-slate-200 rounded-lg text-[11px] font-bold font-mono focus:outline-none focus:border-slate-900 text-slate-900 bg-white"
                                />
                              </div>
                              <button
                                onClick={() => {
                                  const priceVal = parseFloat(quotePrices[booking.id]);
                                  if (isNaN(priceVal) || priceVal <= 0) {
                                    alert("Please enter a valid price quote greater than 0");
                                    return;
                                  }
                                  onOfferQuote(booking.id, priceVal);
                                }}
                                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer border-none"
                              >
                                Send Quote
                              </button>
                            </div>
                          )}

                          {booking.status === 'Quote Offered' && (
                            <div className="text-right">
                              <span className="text-[9px] text-amber-600 font-black uppercase tracking-widest bg-amber-50 border border-amber-200/60 px-2 py-1.5 rounded-lg select-none">
                                ⏳ Offered: ${booking.price.toFixed(2)}
                              </span>
                            </div>
                          )}

                          {booking.status === 'Pending' && (
                            <div className="relative inline-block text-left" id={`action-container-${booking.id}`}>
                              <button
                                onClick={() => setActiveDropdownBookingId(activeDropdownBookingId === booking.id ? null : booking.id)}
                                className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-850 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-lg shadow-sm transition-colors cursor-pointer inline-flex items-center gap-1.5 border-none"
                                id={`assign-btn-${booking.id}`}
                              >
                                Assign Specialist
                                <SlidersHorizontal className="h-3 w-3" />
                              </button>

                              {activeDropdownBookingId === booking.id && (
                                <div 
                                  className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-2xl p-4 z-50 text-left space-y-3 animate-fade-in"
                                  id={`specialist-dropdown-${booking.id}`}
                                >
                                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                    <div>
                                      <h4 className="text-[11px] font-black uppercase text-slate-900 font-display tracking-wider">
                                        Select Specialist
                                      </h4>
                                      <p className="text-[9px] text-slate-400 font-mono">Role: {booking.categoryName}</p>
                                    </div>
                                    <button
                                      onClick={() => setActiveDropdownBookingId(null)}
                                      className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-lg cursor-pointer bg-transparent border-none"
                                      id={`close-dropdown-btn-${booking.id}`}
                                    >
                                      <X className="h-3.5 w-3.5" />
                                    </button>
                                  </div>

                                  {getEligibleProviders(booking.categoryName).length === 0 ? (
                                    <div className="py-4 text-center space-y-2">
                                      <p className="text-[11px] text-slate-400 italic font-medium">No specialists available for this role.</p>
                                      <button
                                        onClick={() => {
                                          setNewExpertSpecialty(booking.categoryName);
                                          setActiveDropdownBookingId(null);
                                          setRegisterModalOpen(true);
                                        }}
                                        className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[9px] rounded-lg cursor-pointer transition-all border border-indigo-200 uppercase"
                                        id={`register-from-dropdown-btn-${booking.id}`}
                                      >
                                        + Register Specialist
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                                      {getEligibleProviders(booking.categoryName)
                                        .sort((a, b) => {
                                          const aOn = a.onDuty !== false ? 1 : 0;
                                          const bOn = b.onDuty !== false ? 1 : 0;
                                          return bOn - aOn;
                                        })
                                        .map((provider) => {
                                          const isOnDuty = provider.onDuty !== false;
                                          return (
                                            <button
                                              key={provider.id}
                                              onClick={() => {
                                                onDispatchBooking(booking.id, provider);
                                                setActiveDropdownBookingId(null);
                                              }}
                                              className={`w-full text-left flex items-center justify-between p-2 border rounded-xl transition-all cursor-pointer bg-transparent hover:scale-[1.01] ${
                                                isOnDuty 
                                                  ? 'border-slate-150 hover:border-indigo-200 hover:bg-indigo-50/25' 
                                                  : 'border-slate-100 bg-slate-50/30 opacity-60 hover:opacity-100'
                                              }`}
                                              id={`provider-select-${provider.id}`}
                                            >
                                              <div className="flex items-center gap-2">
                                                <img
                                                  src={provider.avatar}
                                                  alt={provider.name}
                                                  className={`w-7 h-7 rounded-full object-cover border border-slate-300 shrink-0 ${!isOnDuty ? 'filter grayscale' : ''}`}
                                                />
                                                <div className="leading-tight text-left">
                                                  <div className="flex items-center gap-1">
                                                    <p className="text-[11px] font-black text-slate-950 truncate max-w-[110px]">{provider.name}</p>
                                                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${isOnDuty ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                                                  </div>
                                                  <p className="text-[9px] text-slate-400 font-mono mt-0.5">★ {provider.rating} • {isOnDuty ? 'On Duty' : 'Off Duty'}</p>
                                                </div>
                                              </div>

                                              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                                                isOnDuty 
                                                  ? 'bg-slate-900 text-white hover:bg-indigo-600' 
                                                  : 'bg-slate-150 text-slate-500'
                                              }`}>
                                                Assign
                                              </span>
                                            </button>
                                          );
                                        })}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                          
                          {booking.status === 'Dispatched' && (
                            <button
                              onClick={() => onCompleteBooking(booking.id)}
                              className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[10px] uppercase tracking-wider rounded-lg shadow-sm transition-colors cursor-pointer border-none"
                            >
                              Mark as Completed
                            </button>
                          )}

                          {/* Options to Delete Completed or Canceled bookings */}
                          {(booking.status === 'Completed' || booking.status === 'Canceled') && (
                            <div className="flex items-center justify-end gap-2">
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono mr-2">
                                {booking.status === 'Completed' ? '✓ Completed' : '✕ Canceled'}
                              </span>
                              <button
                                onClick={() => {
                                  if (confirm(`Are you sure you want to permanently delete booking ${booking.id}?`)) {
                                    onDeleteBooking(booking.id);
                                  }
                                }}
                                className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-850 rounded-lg border border-rose-200 transition-all cursor-pointer hover:scale-105 shadow-2xs"
                                title="Delete Booking"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Daily Specialist Roster Redirect Card */}
        <div className="bg-gradient-to-br from-[#EEF2F6] to-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6" id="specialist-roster-redirect-section">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase">
              <Users className="h-3 w-3 animate-pulse" />
              Dynamic Duty Control
            </div>
            <h2 className="text-lg font-display font-black uppercase text-slate-900 tracking-tight">
              Specialist Availability Force Roster
            </h2>
            <p className="text-xs text-slate-500 max-w-xl">
              Manage contractor on-duty status, search specialized categories, and update specialist listings on the dedicated secure commands roster page.
            </p>
          </div>

          <button
            onClick={onNavigateToRoster}
            className="w-full md:w-auto px-5 py-3 bg-slate-900 hover:bg-indigo-600 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer hover:translate-y-[-1px] flex items-center justify-center gap-2 border-none shrink-0"
            id="open-roster-button"
          >
            Manage Specialist Roster
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

      </div>

      {/* Dispatch Allocation Modal */}
      {dispatchModalOpen && selectedBookingForDispatch && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 animate-fade-in"
            id="dispatch-modal-card"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-base font-display font-black uppercase text-slate-900 tracking-wide">Assign Specialist</h2>
                <p className="text-xs text-slate-400">Choose a qualified specialist to handle this booking</p>
              </div>
              <button 
                onClick={handleCloseDispatch}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer border-none bg-transparent"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              
              {/* Target Service Info */}
              <div className="bg-slate-50 p-4 border rounded-xl space-y-1 font-mono">
                <div className="flex justify-between text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                  <span>Service Requested</span>
                  <span>Price</span>
                </div>
                <div className="flex justify-between items-center text-slate-900">
                  <h4 className="text-sm font-black">{selectedBookingForDispatch.serviceName}</h4>
                  <span className="text-sm font-black">${selectedBookingForDispatch.price.toFixed(2)}</span>
                </div>
                <p className="text-xs text-slate-500 pt-1 leading-normal font-sans">
                  Resident: <span className="font-bold text-slate-800">{selectedBookingForDispatch.residentName}</span> ({selectedBookingForDispatch.houseDetails})
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-black text-slate-500 uppercase tracking-wider block font-mono">
                  Available Specialists
                </span>

                {getEligibleProviders(selectedBookingForDispatch.categoryName).length === 0 ? (
                  <div className="p-4 bg-slate-50 border rounded-xl text-center space-y-2">
                    <p className="text-xs text-slate-400 italic">No specialists registered for this category yet.</p>
                    <button
                      onClick={() => {
                        setNewExpertSpecialty(selectedBookingForDispatch.categoryName);
                        setDispatchModalOpen(false);
                        setRegisterModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] rounded-lg cursor-pointer transition-all uppercase"
                    >
                      + Add Specialist Now
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {getEligibleProviders(selectedBookingForDispatch.categoryName)
                      .sort((a, b) => {
                        const aOn = a.onDuty !== false ? 1 : 0;
                        const bOn = b.onDuty !== false ? 1 : 0;
                        return bOn - aOn;
                      })
                      .map((provider) => {
                        const isOnDuty = provider.onDuty !== false;
                        return (
                          <div
                            key={provider.id}
                            className={`flex items-center justify-between p-3 border rounded-xl transition-all ${
                              isOnDuty 
                                ? 'border-slate-150 hover:border-indigo-200 hover:bg-indigo-50/20' 
                                : 'border-slate-100 bg-slate-50/50 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={provider.avatar}
                                alt={provider.name}
                                className={`w-9 h-9 rounded-full object-cover border border-slate-300 ${!isOnDuty ? 'filter grayscale' : ''}`}
                              />
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <p className="text-xs font-bold text-slate-900">{provider.name}</p>
                                  <span className={`inline-block w-1.5 h-1.5 rounded-full ${isOnDuty ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                                </div>
                                <p className="text-[10px] text-slate-400 font-mono">{provider.phone}</p>
                                <p className="text-[10px] text-amber-500 font-bold flex items-center gap-0.5 mt-0.5 font-mono">
                                  ★ {provider.rating} Rating • <span className={isOnDuty ? 'text-emerald-600' : 'text-slate-500'}>{isOnDuty ? 'On Duty' : 'Off Duty'}</span>
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={() => handleAssignProvider(provider)}
                              className={`px-3 py-1.5 font-black text-[10px] uppercase tracking-wider rounded-lg transition-all cursor-pointer border-none ${
                                isOnDuty 
                                  ? 'bg-slate-900 hover:bg-indigo-600 text-white' 
                                  : 'bg-slate-250 hover:bg-slate-300 text-slate-600'
                              }`}
                            >
                              Assign
                            </button>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

              {/* Cancel Button */}
              <button
                onClick={handleCloseDispatch}
                className="w-full py-2.5 px-4 border text-slate-600 hover:bg-slate-50 font-bold text-xs rounded-xl transition-colors cursor-pointer uppercase font-mono tracking-wider"
              >
                Cancel
              </button>

            </div>
          </div>
        </div>
      )}

      {/* Register New Corporate Specialist / Expert Modal */}
      {registerModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 animate-fade-in text-slate-900"
            id="register-expert-modal"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
              <div>
                <h2 className="text-base font-display font-black uppercase tracking-wide flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-emerald-400" />
                  Add New Specialist
                </h2>
                <p className="text-xs text-slate-400 mt-1">Add a new provider to your available support team</p>
              </div>
              <button 
                onClick={() => setRegisterModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-850 transition-colors cursor-pointer border-none bg-transparent"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleRegisterSubmit} className="p-6 space-y-4">
              
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Richard Mwenda"
                  value={newExpertName}
                  onChange={(e) => setNewExpertName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                  Contact Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +254 700 999 888"
                    value={newExpertPhone}
                    onChange={(e) => setNewExpertPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-semibold font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                  Specialty / Service Category
                </label>
                <select
                  value={newExpertSpecialty}
                  onChange={(e) => setNewExpertSpecialty(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-bold appearance-none cursor-pointer"
                >
                  {specialties.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>

              {/* Avatar Preset */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                  Select Profile Avatar Preset
                </label>
                <div className="grid grid-cols-5 gap-2.5">
                  {presetAvatars.map((avatar, idx) => {
                    const isSelected = newExpertAvatar === avatar.url;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setNewExpertAvatar(avatar.url)}
                        className={`p-0.5 rounded-full border-2 transition-all ${
                          isSelected ? 'border-emerald-500 scale-110' : 'border-transparent hover:border-slate-300'
                        }`}
                        title={avatar.name}
                      >
                        <img
                          src={avatar.url}
                          alt={avatar.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setRegisterModalOpen(false)}
                  className="flex-1 py-2.5 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 cursor-pointer border-none"
                >
                  Save Specialist
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
