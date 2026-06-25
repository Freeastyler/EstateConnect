import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Truck, 
  Phone, 
  UserCheck, 
  Loader2, 
  Search, 
  Star, 
  X,
  Filter,
  AlertCircle
} from 'lucide-react';
import { Booking, Provider } from '../types';
import { MOCK_PROVIDERS } from '../mockData';

interface AdminDashboardProps {
  bookings: Booking[];
  onDispatchBooking: (bookingId: string, provider: Provider) => void;
  onCompleteBooking: (bookingId: string) => void;
}

export default function AdminDashboard({
  bookings,
  onDispatchBooking,
  onCompleteBooking
}: AdminDashboardProps) {
  const [selectedBookingForDispatch, setSelectedBookingForDispatch] = useState<Booking | null>(null);
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Dispatched' | 'Completed'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Statistics
  const totalCount = bookings.length;
  const pendingCount = bookings.filter(b => b.status === 'Pending').length;
  const dispatchedCount = bookings.filter(b => b.status === 'Dispatched').length;
  const completedCount = bookings.filter(b => b.status === 'Completed').length;

  // Filter logic
  const filteredBookings = bookings.filter(booking => {
    // Status Filter
    if (statusFilter !== 'All' && booking.status !== statusFilter) return false;

    // Search Query (resident name, house details, estate name, service name)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = booking.residentName.toLowerCase().includes(q);
      const matchHouse = booking.houseDetails.toLowerCase().includes(q);
      const matchEstate = booking.estateName.toLowerCase().includes(q);
      const matchService = booking.serviceName.toLowerCase().includes(q);
      return matchName || matchHouse || matchEstate || matchService;
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

  // Helper to find matching providers for a specific booking category
  const getEligibleProviders = (categoryName: string): Provider[] => {
    // Standard cleaning maps to Cleaning Services, plumbing to Plumbing, etc.
    return MOCK_PROVIDERS.filter(provider => {
      const pSpecialty = provider.specialty.toLowerCase();
      const cat = categoryName.toLowerCase();
      
      if (cat.includes('cleaning') && pSpecialty.includes('cleaning')) return true;
      if (cat.includes('plumbing') && pSpecialty.includes('plumbing')) return true;
      if (cat.includes('electrical') && pSpecialty.includes('electrical')) return true;
      if (cat.includes('laundry') && pSpecialty.includes('laundry')) return true;
      if (cat.includes('grocery') && pSpecialty.includes('grocery')) return true;
      
      return false;
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8" id="admin-dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <span className="theme-sub-label text-amber-600">Dispatcher Control Panel</span>
            <h1 className="text-3xl sm:text-4xl font-display font-black text-slate-900 mt-2 uppercase tracking-tight">
              Estate Domestic Requests Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Verify security-cleared requests, allocate active workers, and supervise dispatch milestones.
            </p>
          </div>
          
          <div className="text-xs text-slate-400 font-mono self-start md:self-end bg-white px-4 py-2.5 border rounded-2xl shadow-sm">
            <span>System Status: </span>
            <span className="text-emerald-500 font-bold uppercase tracking-wider text-[11px]">● Operational</span>
          </div>
        </div>

        {/* 1. Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total */}
          <div className="theme-card p-6 space-y-2 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Total Orders</span>
              <div className="p-2 bg-slate-50 rounded-xl text-slate-500">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 pt-2">
              <p className="text-3xl font-black text-slate-950 font-display tracking-tight">{totalCount}</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Total placed</p>
            </div>
          </div>

          {/* Pending */}
          <div className="theme-card p-6 space-y-2 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-600">Pending Dispatch</span>
              <div className="p-2 bg-amber-50 rounded-xl text-amber-500">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 pt-2">
              <p className="text-3xl font-black text-slate-950 font-display tracking-tight">{pendingCount}</p>
              <p className="text-[10px] uppercase tracking-wider text-amber-500 font-bold">Needs worker</p>
            </div>
          </div>

          {/* Dispatched */}
          <div className="theme-card p-6 space-y-2 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-600">Out for Service</span>
              <div className="p-2 bg-indigo-50 rounded-xl text-indigo-500">
                <Truck className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 pt-2">
              <p className="text-3xl font-black text-slate-950 font-display tracking-tight">{dispatchedCount}</p>
              <p className="text-[10px] uppercase tracking-wider text-indigo-500 font-bold">Active dispatch</p>
            </div>
          </div>

          {/* Completed */}
          <div className="theme-card p-6 space-y-2 bg-white">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600">Completed Jobs</span>
              <div className="p-2 bg-emerald-50 rounded-xl text-emerald-500">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 pt-2">
              <p className="text-3xl font-black text-slate-950 font-display tracking-tight">{completedCount}</p>
              <p className="text-[10px] uppercase tracking-wider text-emerald-500 font-bold">Archived jobs</p>
            </div>
          </div>
        </div>

        {/* 2. List Control Area (Search, Filter Tabs) */}
        <div className="theme-card bg-white overflow-hidden">
          
          {/* Filtering bar */}
          <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-slate-50/40">
            {/* Search Input */}
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by resident name, house number, estate..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-slate-900 bg-white"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-1 overflow-x-auto p-0.5 bg-slate-100 rounded-xl self-start md:self-center border">
              {(['All', 'Pending', 'Dispatched', 'Completed'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    statusFilter === tab 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Bookings Table / List */}
          {filteredBookings.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-3">
              <AlertCircle className="h-8 w-8 text-slate-300 mx-auto" />
              <p className="text-sm font-medium text-slate-700">No estate requests found</p>
              <p className="text-xs text-slate-400">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold font-mono tracking-wider">
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Resident / Location</th>
                    <th className="p-4">Requested Service</th>
                    <th className="p-4">Schedule</th>
                    <th className="p-4">Fee</th>
                    <th className="p-4">Status / Allocation</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {filteredBookings.map((booking) => {
                    return (
                      <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                        
                        {/* Order ID */}
                        <td className="p-4 font-mono font-bold text-slate-500">
                          {booking.id}
                        </td>

                        {/* Resident / Location */}
                        <td className="p-4 space-y-0.5">
                          <p className="font-bold text-slate-900">{booking.residentName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{booking.phone}</p>
                          <p className="text-[10px] text-slate-500 truncate max-w-[180px]">
                            {booking.estateName}, {booking.houseDetails}
                          </p>
                        </td>

                        {/* Requested Service */}
                        <td className="p-4 space-y-0.5">
                          <p className="font-semibold text-slate-900">{booking.serviceName}</p>
                          <p className="text-[10px] text-slate-400">{booking.categoryName}</p>
                          {booking.notes && (
                            <p className="text-[10px] text-indigo-500 italic truncate max-w-[150px]" title={booking.notes}>
                              " {booking.notes} "
                            </p>
                          )}
                        </td>

                        {/* Schedule */}
                        <td className="p-4 space-y-0.5 text-slate-600">
                          <p className="font-semibold">{booking.date}</p>
                          <p className="text-[10px] font-mono">{booking.time}</p>
                        </td>

                        {/* Fee */}
                        <td className="p-4 font-bold text-slate-900 text-sm">
                          ${booking.price}
                        </td>

                        {/* Status / Worker Assignment */}
                        <td className="p-4 space-y-1.5">
                          <div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                              booking.status === 'Pending' 
                                ? 'bg-amber-50 text-amber-700 border-amber-200' 
                                : booking.status === 'Dispatched'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}>
                              ● {booking.status}
                            </span>
                          </div>

                          {booking.providerName ? (
                            <div className="flex items-center gap-1.5">
                              <img
                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&auto=format&fit=crop&q=80"
                                alt={booking.providerName}
                                className="w-5 h-5 rounded-full object-cover border"
                              />
                              <span className="text-[10px] font-semibold text-slate-800">{booking.providerName}</span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic flex items-center gap-1">
                              <Loader2 className="h-3 w-3 animate-spin" /> Unassigned
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right">
                          {booking.status === 'Pending' && (
                            <button
                              onClick={() => handleOpenDispatch(booking)}
                              className="px-3 py-1.5 bg-slate-900 hover:bg-indigo-600 text-white font-semibold text-[11px] rounded-lg shadow-sm transition-colors cursor-pointer"
                            >
                              Assign Provider
                            </button>
                          )}
                          
                          {booking.status === 'Dispatched' && (
                            <button
                              onClick={() => onCompleteBooking(booking.id)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] rounded-lg shadow-sm transition-colors cursor-pointer"
                            >
                              Mark Completed
                            </button>
                          )}

                          {booking.status === 'Completed' && (
                            <span className="text-[11px] text-slate-400 flex items-center gap-1 justify-end font-semibold">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Finished
                            </span>
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
                <h2 className="text-lg font-display font-bold text-slate-900">Dispatch Local Specialist</h2>
                <p className="text-xs text-slate-400">Match verified contractors for specialty requirements</p>
              </div>
              <button 
                onClick={handleCloseDispatch}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              
              {/* Target Service Info */}
              <div className="bg-slate-50 p-4 border rounded-xl space-y-1">
                <div className="flex justify-between text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                  <span>Requirement</span>
                  <span>Fee</span>
                </div>
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-slate-800">{selectedBookingForDispatch.serviceName}</h4>
                  <span className="text-sm font-extrabold text-slate-950">${selectedBookingForDispatch.price}</span>
                </div>
                <p className="text-xs text-slate-500 pt-1">
                  Resident: <span className="font-semibold text-slate-700">{selectedBookingForDispatch.residentName}</span> ({selectedBookingForDispatch.houseDetails})
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  Eligible Verified Providers
                </span>

                {getEligibleProviders(selectedBookingForDispatch.categoryName).length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No specialist registered for this specific category yet.</p>
                ) : (
                  <div className="space-y-2.5">
                    {getEligibleProviders(selectedBookingForDispatch.categoryName).map((provider) => (
                      <div
                        key={provider.id}
                        className="flex items-center justify-between p-3 border border-slate-150 hover:border-indigo-200 hover:bg-indigo-50/30 rounded-xl transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={provider.avatar}
                            alt={provider.name}
                            className="w-10 h-10 rounded-full object-cover border"
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-900">{provider.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{provider.phone}</p>
                            <p className="text-[10px] text-amber-500 font-semibold flex items-center gap-0.5 mt-0.5">
                              <Star className="h-3 w-3 fill-current" /> {provider.rating} Rating
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleAssignProvider(provider)}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-indigo-600 text-white font-semibold text-[11px] rounded-lg transition-all cursor-pointer"
                        >
                          Dispatch
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cancel Button */}
              <button
                onClick={handleCloseDispatch}
                className="w-full py-2 px-4 border text-slate-600 hover:bg-slate-50 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Close Allocation Panel
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
