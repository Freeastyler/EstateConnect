import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Droplet, 
  Zap, 
  Shirt, 
  ShoppingBag, 
  BookOpen,
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  CheckCircle2, 
  Loader2, 
  Truck, 
  User, 
  DollarSign, 
  FileText,
  X,
  Phone,
  Grid,
  Filter,
  Check,
  Tv,
  Bug,
  Scissors,
  Baby,
  Car,
  Bell
} from 'lucide-react';
import { Booking, User as UserType, ServiceCategory, ServiceItem } from '../types';
import { MOCK_SERVICES } from '../mockData';

interface ClientDashboardProps {
  currentUser: UserType;
  bookings: Booking[];
  messages: Array<{
    id: string;
    userId: string;
    title: string;
    content: string;
    createdAt: string;
    read: boolean;
    sender: string;
  }>;
  onMarkMessageAsRead?: (id: string) => void;
  onAddBooking: (booking: {
    categoryName: string;
    serviceName: string;
    date: string;
    time: string;
    notes: string;
    price: number;
    estateName: string;
    houseDetails: string;
    phone: string;
  }) => void;
  onCancelBooking: (id: string) => void;
  selectedCategoryPreview: string | null;
  onClearCategoryPreview: () => void;
}

export default function ClientDashboard({
  currentUser,
  bookings,
  messages,
  onMarkMessageAsRead,
  onAddBooking,
  onCancelBooking,
  selectedCategoryPreview,
  onClearCategoryPreview
}: ClientDashboardProps) {
  // Inbox notices collapsible state
  const [isInboxOpen, setIsInboxOpen] = useState(true);
  
  // Selected category in the service catalog (default to 'cleaning' or the landing-page prefocused category)
  const [activeCategory, setActiveCategory] = useState<string>('cleaning');
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);

  // Form states for booking
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('09:00 AM');
  const [houseNumber, setHouseNumber] = useState(currentUser.houseDetails || '');
  const [estateLocation, setEstateLocation] = useState(currentUser.estateName || 'Fedha Estate');
  const [contactPhone, setContactPhone] = useState(currentUser.phone || '');
  const [specialNotes, setSpecialNotes] = useState('');
  const [bookingFilter, setBookingFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Custom Service Request states
  const [customServiceName, setCustomServiceName] = useState('');
  const [customServiceDate, setCustomServiceDate] = useState('');
  const [customServiceTime, setCustomServiceTime] = useState('10:00 AM');
  const [customServiceNotes, setCustomServiceNotes] = useState('');

  // Sync selectedCategoryPreview from landing page click
  useEffect(() => {
    if (selectedCategoryPreview) {
      setActiveCategory(selectedCategoryPreview);
      onClearCategoryPreview(); // reset so we don't trigger re-sync continuously
    }
  }, [selectedCategoryPreview, onClearCategoryPreview]);

  // Set default minimum date to today (2026-06-25)
  const todayStr = '2026-06-25';

  const handleOpenBooking = (category: ServiceCategory, service: ServiceItem) => {
    setSelectedCategory(category);
    setSelectedService(service);
    setBookingModalOpen(true);
  };

  const handleCloseBooking = () => {
    setBookingModalOpen(false);
    setSelectedService(null);
    setSelectedCategory(null);
    setSpecialNotes('');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDate || !bookingTime || !houseNumber || !contactPhone || !selectedService || !selectedCategory) {
      return;
    }

    onAddBooking({
      categoryName: selectedCategory.name,
      serviceName: selectedService.name,
      date: bookingDate,
      time: bookingTime,
      notes: specialNotes,
      price: selectedService.price,
      estateName: estateLocation,
      houseDetails: houseNumber,
      phone: contactPhone
    });

    handleCloseBooking();
  };

  const handleCustomRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customServiceName || !customServiceDate || !customServiceNotes) {
      return;
    }

    onAddBooking({
      categoryName: 'Custom Request',
      serviceName: customServiceName,
      date: customServiceDate,
      time: customServiceTime,
      notes: customServiceNotes,
      price: 0,
      estateName: estateLocation,
      houseDetails: houseNumber || currentUser.houseDetails || 'Upper Fedha',
      phone: contactPhone || currentUser.phone || '+254 700 000 000'
    });

    setCustomServiceName('');
    setCustomServiceDate('');
    setCustomServiceNotes('');
  };

  const getCategoryTabStyles = (id: string, isActive: boolean) => {
    if (!isActive) return 'text-slate-500 hover:text-slate-800 hover:bg-slate-50/60 border-transparent';
    switch (id) {
      case 'cleaning': return 'bg-teal-50 border-t-2 border-teal-500 text-teal-800 font-bold border-x border-slate-200/60 shadow-sm';
      case 'plumbing': return 'bg-blue-50 border-t-2 border-blue-500 text-blue-800 font-bold border-x border-slate-200/60 shadow-sm';
      case 'electrical': return 'bg-amber-50 border-t-2 border-amber-500 text-amber-800 font-bold border-x border-slate-200/60 shadow-sm';
      case 'laundry': return 'bg-purple-50 border-t-2 border-purple-500 text-purple-800 font-bold border-x border-slate-200/60 shadow-sm';
      case 'grocery': return 'bg-emerald-50 border-t-2 border-emerald-500 text-emerald-800 font-bold border-x border-slate-200/60 shadow-sm';
      case 'tuition': return 'bg-[#FAF6F0] border-t-2 border-[#8B5E3C] text-[#5C3D2E] font-bold border-x border-slate-200/60 shadow-sm';
      case 'tv-mounting': return 'bg-indigo-50 border-t-2 border-indigo-500 text-indigo-800 font-bold border-x border-slate-200/60 shadow-sm';
      case 'pest-control': return 'bg-emerald-50/60 border-t-2 border-emerald-600 text-emerald-800 font-bold border-x border-slate-200/60 shadow-sm';
      case 'beauty-care': return 'bg-cyan-50 border-t-2 border-cyan-500 text-cyan-800 font-bold border-x border-slate-200/60 shadow-sm';
      case 'childcare': return 'bg-orange-50 border-t-2 border-orange-500 text-orange-800 font-bold border-x border-slate-200/60 shadow-sm';
      case 'moving-transport': return 'bg-slate-100 border-t-2 border-slate-600 text-slate-800 font-bold border-x border-slate-200/60 shadow-sm';
      case 'water-utility': return 'bg-sky-50 border-t-2 border-sky-500 text-sky-800 font-bold border-x border-slate-200/60 shadow-sm';
      case 'car-services': return 'bg-blue-50/60 border-t-2 border-blue-600 text-blue-950 font-bold border-x border-slate-200/60 shadow-sm';
      default: return 'bg-slate-50 border-t-2 border-slate-500 text-slate-800 font-bold border-x border-slate-200/60 shadow-sm';
    }
  };

  const getCategoryIconColor = (id: string, isActive: boolean) => {
    if (!isActive) return 'text-slate-400';
    switch (id) {
      case 'cleaning': return 'text-teal-600';
      case 'plumbing': return 'text-blue-600';
      case 'electrical': return 'text-amber-600';
      case 'laundry': return 'text-purple-600';
      case 'grocery': return 'text-emerald-600';
      case 'tuition': return 'text-[#8B5E3C]';
      case 'tv-mounting': return 'text-indigo-600';
      case 'pest-control': return 'text-emerald-600';
      case 'beauty-care': return 'text-cyan-600';
      case 'childcare': return 'text-orange-600';
      case 'moving-transport': return 'text-slate-600';
      case 'water-utility': return 'text-sky-600';
      case 'car-services': return 'text-blue-700';
      default: return 'text-slate-600';
    }
  };

  // Filter bookings for this user
  const userBookings = bookings.filter(b => b.residentId === currentUser.id);

  const filteredBookings = userBookings.filter(b => {
    if (bookingFilter === 'all') return true;
    if (bookingFilter === 'active') return b.status === 'Pending' || b.status === 'Dispatched';
    if (bookingFilter === 'completed') return b.status === 'Completed';
    return true;
  });

  const renderIcon = (iconName: string, className: string) => {
    switch (iconName) {
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

  const currentCategory = MOCK_SERVICES.find(c => c.id === activeCategory) || MOCK_SERVICES[0];

  return (
    <div className="bg-[#FAF7F2] min-h-screen py-8" id="client-dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
        
        {/* Welcome Banner */}
        <div className="theme-card p-8 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="theme-sub-label">Resident Account</span>
            <h1 className="text-3xl sm:text-4xl font-display font-black text-slate-900 uppercase tracking-tight mt-1">
              Welcome back, {currentUser.name ? currentUser.name.trim().split(/\s+/)[0] : 'Resident'}
            </h1>
            <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-teal-600 shrink-0" />
              <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-600">{currentUser.estateName || 'Fedha Estate'}</span>
              <span className="text-slate-400">•</span>
              <span className="font-mono text-slate-500">{currentUser.houseDetails || 'Villa B1'}</span>
            </p>
          </div>

          <div className="flex gap-2">
            <div className="bg-slate-100 px-4 py-2 rounded-xl text-center">
              <p className="text-xs text-slate-400 font-medium">Total Orders</p>
              <p className="text-lg font-bold text-slate-800">{userBookings.length}</p>
            </div>
            <div className="bg-teal-50 px-4 py-2 rounded-xl text-center border border-teal-100">
              <p className="text-xs text-teal-600 font-medium">Active Bookings</p>
              <p className="text-lg font-bold text-teal-800">
                {userBookings.filter(b => b.status !== 'Completed').length}
              </p>
            </div>
          </div>
        </div>

        {/* Inbox / Announcements Desk */}
        {messages && messages.filter(m => m.userId === currentUser.id).length > 0 && (() => {
          const userMessages = messages.filter(m => m.userId === currentUser.id);
          const unreadCount = userMessages.filter(m => !m.read).length;
          return (
            <div className="bg-white rounded-3xl p-6 border border-slate-200/60 shadow-sm space-y-4">
              <div 
                onClick={() => setIsInboxOpen(!isInboxOpen)}
                className="flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="relative p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-rose-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider font-display">
                      Resident Inbox &amp; Notices
                    </h3>
                    <p className="text-xs text-slate-500">
                      {unreadCount > 0 
                        ? `You have ${unreadCount} unread official message${unreadCount > 1 ? 's' : ''}` 
                        : 'All official notices and congratulations read'}
                    </p>
                  </div>
                </div>
                <button className="text-slate-500 group-hover:text-slate-800 transition-colors text-xs font-semibold px-3 py-1 bg-slate-50 rounded-lg border border-slate-200">
                  {isInboxOpen ? 'Collapse Notices' : 'Expand Inbox'}
                </button>
              </div>

              {isInboxOpen && (
                <div className="pt-4 border-t border-slate-100 space-y-3 divide-y divide-slate-100">
                  {userMessages.map((msg) => (
                    <div key={msg.id} className={`pt-3 first:pt-0 ${!msg.read ? 'bg-indigo-50/20 -mx-4 px-4 py-2.5 rounded-xl border-l-4 border-indigo-500' : ''}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-800">{msg.title}</span>
                            {!msg.read && (
                              <span className="bg-indigo-600 text-white font-mono text-[9px] font-black uppercase px-1.5 py-0.5 rounded">NEW</span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                            {msg.content}
                          </p>
                          <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono pt-1">
                            <span>From: {msg.sender}</span>
                            <span>•</span>
                            <span>{new Date(msg.createdAt).toLocaleDateString()} at {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                        </div>
                        
                        {!msg.read && onMarkMessageAsRead && (
                          <button
                            onClick={() => onMarkMessageAsRead(msg.id)}
                            className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1.5 rounded-xl transition-colors whitespace-nowrap cursor-pointer shrink-0 border border-indigo-100 shadow-sm"
                          >
                            Mark Read
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })()}

        {/* 1. Active Bookings Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <span className="theme-sub-label">Dispatch Desk</span>
              <h2 className="text-xl font-black text-slate-900 font-display uppercase tracking-tight mt-1">Your Domestic Bookings</h2>
              <p className="text-xs text-slate-500">Track current dispatches and view past completions.</p>
            </div>

            {/* Filter controls */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 shadow-sm self-start sm:self-center">
              <button
                onClick={() => setBookingFilter('all')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  bookingFilter === 'all' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                All ({userBookings.length})
              </button>
              <button
                onClick={() => setBookingFilter('active')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  bookingFilter === 'active' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Active ({userBookings.filter(b => b.status !== 'Completed').length})
              </button>
              <button
                onClick={() => setBookingFilter('completed')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  bookingFilter === 'completed' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Completed ({userBookings.filter(b => b.status === 'Completed').length})
              </button>
            </div>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="bg-white border border-slate-200/60 rounded-2xl p-12 text-center max-w-xl mx-auto space-y-4">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800">No bookings match</h3>
                <p className="text-xs text-slate-500 mt-1">Browse our core service catalog below to place your first estate domestic booking.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredBookings.map((booking) => {
                // Determine styling based on status
                const statusStyles = {
                  Pending: {
                    badge: 'bg-amber-50 text-amber-700 border-amber-200',
                    stepText: 'Pending Dispatcher Verification',
                    indicator: 'bg-amber-500'
                  },
                  Dispatched: {
                    badge: 'bg-blue-50 text-blue-700 border-blue-200',
                    stepText: 'Verified specialist is on the way',
                    indicator: 'bg-blue-500 animate-pulse'
                  },
                  Completed: {
                    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    stepText: 'Service successfully finished',
                    indicator: 'bg-emerald-500'
                  }
                };

                const activeStyle = statusStyles[booking.status];
                
                // 5-minute cancellation policy
                const createdAtTime = new Date(booking.createdAt).getTime();
                const timeDiffMs = Date.now() - createdAtTime;
                const minutesRemaining = Math.max(0, 5 - Math.floor(timeDiffMs / (60 * 1000)));
                const isCancellable = timeDiffMs < 5 * 60 * 1000;

                return (
                  <div 
                    key={booking.id}
                    className="theme-card p-6 flex flex-col justify-between space-y-4 bg-white"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-400">{booking.id}</span>
                          <span className="text-[10px] text-slate-400 font-medium">Placed {new Date(booking.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h4 className="text-base font-bold text-slate-900 font-display mt-0.5">{booking.serviceName}</h4>
                        <p className="text-xs text-slate-400">{booking.categoryName}</p>
                      </div>

                      <div className="flex flex-col items-end gap-1.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${activeStyle.badge}`}>
                          {booking.status}
                        </span>
                        <span className="text-sm font-bold text-slate-900">${booking.price}</span>
                      </div>
                    </div>

                    {/* Progress Track Indicator */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                        <span>Dispatch Progress</span>
                        <span className="text-slate-800">{activeStyle.stepText}</span>
                      </div>
                      
                      {/* Interactive Visual Bar */}
                      <div className="grid grid-cols-3 gap-1.5 h-1.5">
                        <div className={`rounded-full ${booking.status === 'Pending' || booking.status === 'Dispatched' || booking.status === 'Completed' ? 'bg-indigo-600' : 'bg-slate-200'}`} />
                        <div className={`rounded-full ${booking.status === 'Dispatched' || booking.status === 'Completed' ? 'bg-indigo-600' : 'bg-slate-200'}`} />
                        <div className={`rounded-full ${booking.status === 'Completed' ? 'bg-indigo-600' : 'bg-slate-200'}`} />
                      </div>
                    </div>

                    {/* Meta Schedule details */}
                    <div className="grid grid-cols-2 gap-3 text-xs border-y border-slate-100 py-3">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                        <span>{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                        <span>{booking.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 col-span-2">
                        <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                        <span className="truncate">{booking.estateName}, {booking.houseDetails}</span>
                      </div>
                    </div>

                    {/* Assigned Provider Detail */}
                    {booking.providerName ? (
                      <div className="flex items-center justify-between bg-teal-50/50 border border-teal-100 rounded-xl p-3">
                        <div className="flex items-center gap-2.5">
                          <div className="relative">
                            <img
                              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                              alt={booking.providerName}
                              className="w-8 h-8 rounded-full object-cover border border-teal-200"
                            />
                            <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">{booking.providerName}</p>
                            <p className="text-[10px] text-teal-600 font-medium">Assigned Specialist</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-[10px] text-slate-400">Contact</p>
                          <a href={`tel:${booking.providerPhone}`} className="text-xs font-semibold text-teal-800 hover:underline flex items-center gap-1 justify-end">
                            <Phone className="h-3 w-3" />
                            {booking.providerPhone}
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-xs text-slate-500 p-2 border border-dashed rounded-xl bg-slate-50/50">
                        <span className="flex items-center gap-1.5">
                          <Loader2 className="h-3.5 w-3.5 text-slate-400 animate-spin" />
                          Searching for nearest available worker...
                        </span>
                        {booking.status === 'Pending' && (
                          isCancellable ? (
                            <div className="flex flex-col items-end shrink-0">
                              <button
                                onClick={() => onCancelBooking(booking.id)}
                                className="text-rose-600 hover:text-rose-800 font-bold cursor-pointer underline text-[11px]"
                              >
                                Cancel Booking
                              </button>
                              <span className="text-[9px] text-slate-400 font-semibold font-mono">
                                ({minutesRemaining}m left)
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-end shrink-0 select-none">
                              <span className="text-slate-400 font-bold text-[11px] flex items-center gap-1">
                                🔒 Locked-in
                              </span>
                              <span className="text-[9px] text-slate-400 font-mono">
                                (&gt; 5m elapsed)
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    )}

                    {/* Special notes */}
                    {booking.notes && (
                      <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg">
                        " {booking.notes} "
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. Service Catalog Catalog Section */}
        <div className="space-y-6">
          <div>
            <span className="theme-sub-label">Services Desk</span>
            <h2 className="text-xl font-black text-slate-900 font-display uppercase tracking-tight mt-1">Explore Service Catalog</h2>
            <p className="text-xs sm:text-sm text-slate-500">Pick a category to check prices, duration and schedule a professional specialist.</p>
          </div>

          {/* Category Tabs */}
          <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 gap-2 border-b border-slate-200">
            {MOCK_SERVICES.map((category) => {
              const isActive = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${getCategoryTabStyles(category.id, isActive)}`}
                >
                  {renderIcon(category.icon, `h-4 w-4 ${getCategoryIconColor(category.id, isActive)}`)}
                  {category.name}
                </button>
              );
            })}
          </div>

          {/* Catalog Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {currentCategory.items.map((service) => (
              <div 
                key={service.id}
                className={`p-6 flex flex-col justify-between group min-h-56 rounded-3xl border transition-all hover:shadow-md ${currentCategory.bgColor}`}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-base font-bold text-slate-800 font-display leading-snug group-hover:text-indigo-600 transition-colors">
                      {service.name}
                    </h3>
                    <span className="text-lg font-extrabold text-slate-900">${service.price}</span>
                  </div>

                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Est. Time: {service.duration}</span>
                  </div>

                  <button
                    onClick={() => handleOpenBooking(currentCategory, service)}
                    className="flex items-center gap-1 py-1.5 px-3 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Schedule Service
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Specialized Custom Request Card */}
        <div className="bg-gradient-to-br from-slate-900 via-[#1E293B] to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
          <div className="absolute right-0 top-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 bottom-0 w-60 h-60 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-400/10 text-teal-400 border border-teal-400/20">
                  <Sparkles className="h-3 w-3" />
                  Bespoke Doorstep Request
                </span>
                <h3 className="text-xl sm:text-2xl font-black font-display uppercase tracking-tight mt-3 text-white">
                  Can't find your service in the catalog?
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Directly specify what specialized service or domestic help you need delivered to your doorstep.
                </p>
              </div>
            </div>

            <form onSubmit={handleCustomRequestSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Service Name / Category
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Garden Landscaping, Locksmith, Microwave Repair..."
                    value={customServiceName}
                    onChange={(e) => setCustomServiceName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-xs bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Preferred Date &amp; Time
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      required
                      min={todayStr}
                      value={customServiceDate}
                      onChange={(e) => setCustomServiceDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl text-xs bg-slate-900/90 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                    <select
                      value={customServiceTime}
                      onChange={(e) => setCustomServiceTime(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl text-xs bg-slate-900/90 border border-slate-800 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
                    >
                      <option value="08:00 AM">08:00 AM (Morning)</option>
                      <option value="10:00 AM">10:00 AM (Mid-morning)</option>
                      <option value="12:00 PM">12:00 PM (Noon)</option>
                      <option value="02:00 PM">02:00 PM (Afternoon)</option>
                      <option value="04:00 PM">04:00 PM (Late-afternoon)</option>
                      <option value="06:00 PM">06:00 PM (Evening)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Directly describe your requirements
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Tell our dispatch team exactly what you need. Mention any specific tools, urgent timelines, or safety instructions..."
                  value={customServiceNotes}
                  onChange={(e) => setCustomServiceNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-xs bg-slate-900/90 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-2 py-2.5 px-6 bg-teal-400 hover:bg-teal-300 text-slate-950 text-xs font-black rounded-xl transition-all shadow-md active:scale-95 cursor-pointer uppercase tracking-wider"
                >
                  Submit Special Request
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>

      {/* 3. Booking Confirmation Modal */}
      {bookingModalOpen && selectedService && selectedCategory && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 animate-fade-in"
            id="booking-modal-card"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-lg font-display font-bold text-slate-900">Configure Service Booking</h2>
                <p className="text-xs text-slate-400">Complete booking details for estate verification</p>
              </div>
              <button 
                onClick={handleCloseBooking}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              
              {/* Selected service summary card */}
              <div className="bg-slate-50 p-4 border border-slate-200/60 rounded-xl flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider block">
                    {selectedCategory.name}
                  </span>
                  <h4 className="text-sm font-bold text-slate-800 mt-0.5">{selectedService.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Est: {selectedService.duration}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400">Service Fee</p>
                  <p className="text-lg font-extrabold text-slate-900">${selectedService.price}</p>
                </div>
              </div>

              {/* Booking Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferred Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                      type="date"
                      required
                      min={todayStr}
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="pl-10 pr-3 py-2 w-full border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all bg-slate-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Preferred Start Hour
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <select
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="pl-10 pr-3 py-2 w-full border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all bg-slate-50/50 appearance-none"
                    >
                      <option value="08:00 AM">08:00 AM</option>
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="01:00 PM">01:00 PM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="03:00 PM">03:00 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                      <option value="05:00 PM">05:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Estate Location Details */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Estate Location
                  </label>
                  <input
                    type="text"
                    required
                    readOnly
                    value={estateLocation}
                    className="px-3 py-2 w-full border border-slate-100 rounded-xl text-xs bg-slate-100 text-slate-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    House/Apartment Sector
                  </label>
                  <select
                    required
                    value={houseNumber}
                    onChange={(e) => setHouseNumber(e.target.value)}
                    className="px-3 py-2 w-full border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all bg-slate-50/50 appearance-none cursor-pointer"
                  >
                    <option value="">Select Sector...</option>
                    <option value="Upper Fedha">Upper Fedha</option>
                    <option value="Lower Fedha">Lower Fedha</option>
                    <option value="Kwandege/Nyayo">Kwandege/Nyayo</option>
                  </select>
                </div>
              </div>

              {/* Contact phone */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Security Code / Contact Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="+254 799 111 222"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all bg-slate-50/50"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Used by dispatched workers at the estate gatehouse.
                </span >
              </div>

              {/* Special instructions */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Special Notes / Entry Code (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="E.g., Please call before arrival. Gate code is #5021."
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  className="px-3 py-2 w-full border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all bg-slate-50/50 resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseBooking}
                  className="flex-1 py-2 px-4 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Confirm Booking ($ {selectedService.price})
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
