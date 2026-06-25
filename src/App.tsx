import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import ClientDashboard from './components/ClientDashboard';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import Toast, { ToastMessage } from './components/Toast';
import { User, Booking, Provider } from './types';
import { INITIAL_BOOKINGS } from './mockData';
import { ShieldCheck, UserCheck, Sparkles, HelpCircle } from 'lucide-react';

export default function App() {
  // Core Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('estateease_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Bookings state
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem('estateease_bookings');
      return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
    } catch {
      return INITIAL_BOOKINGS;
    }
  });

  // Message Inbox state (for automated congratulations and notices)
  const [messages, setMessages] = useState<Array<{
    id: string;
    userId: string;
    title: string;
    content: string;
    createdAt: string;
    read: boolean;
    sender: string;
  }>>(() => {
    try {
      const saved = localStorage.getItem('estateconnect_messages');
      if (saved) return JSON.parse(saved);
      
      // Default welcome for demo resident (Ian)
      return [
        {
          id: 'msg-default-1',
          userId: 'user-1',
          title: 'Welcome to EstateConnect Portal! 🎉',
          content: 'Hello Ian! Congratulations, sir, on joining EstateConnect! We are absolutely thrilled to have you as a verified member of our Fedha Estate family. We look forward to fulfilling your first service order with us and ensuring premium domestic assistance!',
          createdAt: new Date().toISOString(),
          read: false,
          sender: 'Estate Administration'
        }
      ];
    } catch {
      return [];
    }
  });

  // UI state
  const [currentView, setCurrentView] = useState<'landing' | 'client' | 'admin'>(() => {
    try {
      const savedUser = localStorage.getItem('estateease_user');
      if (savedUser) {
        const parsed: User = JSON.parse(savedUser);
        return parsed.role === 'admin' ? 'admin' : 'client';
      }
      return 'landing';
    } catch {
      return 'landing';
    }
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedCategoryPreview, setSelectedCategoryPreview] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [showDemoTip, setShowDemoTip] = useState(true);

  // Sync state to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('estateease_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('estateease_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('estateease_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('estateconnect_messages', JSON.stringify(messages));
  }, [messages]);

  // Toast handler
  const triggerToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      message,
      type
    };
    setToasts(prev => [...prev, newToast]);

    // Auto-remove after 4.5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Auth Callbacks
  const handleAuthSuccess = (user: User, message: string) => {
    setCurrentUser(user);
    setCurrentView(user.role === 'admin' ? 'admin' : 'client');
    triggerToast(message, 'success');

    // Automatically welcome new residents with congratulations depending on their gender
    if (user.role === 'resident' && user.id !== 'user-1') {
      const alreadyHasWelcomeMsg = messages.some(m => m.userId === user.id);
      if (!alreadyHasWelcomeMsg) {
        let salutation = 'esteemed resident';
        if (user.gender === 'male') {
          salutation = 'sir';
        } else if (user.gender === 'female') {
          salutation = 'madam';
        }

        const welcomeText = `Hello ${user.name}! Congratulations, ${salutation}, for joining EstateConnect! We are absolutely thrilled to welcome you to our community. We are looking forward to your first service order with us! Let our team of professional dispatchers and vetted experts make your household management effortless.`;

        const newMsg = {
          id: `msg-${Date.now()}`,
          userId: user.id,
          title: 'Congratulations on Joining EstateConnect! 🎉',
          content: welcomeText,
          createdAt: new Date().toISOString(),
          read: false,
          sender: 'Estate Administration'
        };

        setMessages(prev => [newMsg, ...prev]);
        
        setTimeout(() => {
          triggerToast(`You have an official automated notification in your inbox!`, 'info');
        }, 1500);
      }
    }
  };

  const handleMarkMessageAsRead = (msgId: string) => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, read: true } : m));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('landing');
    triggerToast('Logged out of EstateConnect.', 'info');
  };

  // Switch Category from Landing page preview
  const handleSelectCategoryPreview = (categoryId: string) => {
    setSelectedCategoryPreview(categoryId);
    if (currentUser) {
      setCurrentView('client');
    } else {
      setAuthModalOpen(true);
      triggerToast('Please sign in or use Demo quick-pass to book from our catalog.', 'info');
    }
  };

  // Booking Actions
  const handleAddBooking = (newBooking: {
    categoryName: string;
    serviceName: string;
    date: string;
    time: string;
    notes: string;
    price: number;
    estateName: string;
    houseDetails: string;
    phone: string;
  }) => {
    if (!currentUser) return;

    const booking: Booking = {
      id: `EE-${Math.floor(1000 + Math.random() * 9000)}`,
      residentId: currentUser.id,
      residentName: currentUser.name,
      phone: newBooking.phone,
      estateName: newBooking.estateName,
      houseDetails: newBooking.houseDetails,
      categoryName: newBooking.categoryName,
      serviceName: newBooking.serviceName,
      date: newBooking.date,
      time: newBooking.time,
      notes: newBooking.notes,
      status: 'Pending',
      providerName: null,
      providerPhone: null,
      price: newBooking.price,
      createdAt: new Date().toISOString()
    };

    setBookings(prev => [booking, ...prev]);
    triggerToast(`Booking ${booking.id} placed successfully! Waiting for dispatcher assignment.`, 'success');
  };

  const handleCancelBooking = (id: string) => {
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;

    const createdAtTime = new Date(booking.createdAt).getTime();
    const timeDiffMs = Date.now() - createdAtTime;
    const fiveMinutesMs = 5 * 60 * 1000;

    if (timeDiffMs > fiveMinutesMs) {
      triggerToast(`Unable to cancel booking ${id}. Bookings can only be cancelled within 5 minutes of order placement.`, 'error');
      return;
    }

    setBookings(prev => prev.filter(b => b.id !== id));
    triggerToast(`Booking ${id} was cancelled successfully.`, 'info');
  };

  // Admin Dispatcher Actions
  const handleDispatchBooking = (bookingId: string, provider: Provider) => {
    setBookings(prev => prev.map(booking => {
      if (booking.id === bookingId) {
        return {
          ...booking,
          status: 'Dispatched',
          providerName: provider.name,
          providerPhone: provider.phone
        };
      }
      return booking;
    }));
    triggerToast(`Assigned ${provider.name} to order ${bookingId}. Worker dispatched!`, 'success');
  };

  const handleCompleteBooking = (bookingId: string) => {
    setBookings(prev => prev.map(booking => {
      if (booking.id === bookingId) {
        return {
          ...booking,
          status: 'Completed'
        };
      }
      return booking;
    }));
    triggerToast(`Order ${bookingId} marked as Completed. Security notified!`, 'success');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF7F2] font-sans">
      
      {/* Interactive Floating Quick Demo Header */}
      {showDemoTip && (
        <div className="bg-slate-900 text-white text-[11px] sm:text-xs py-2 px-4 flex items-center justify-between gap-4 border-b border-slate-800 relative z-50">
          <div className="flex items-center gap-2 max-w-full truncate">
            <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
            <span className="truncate">
              <strong>💡 Demo Tip:</strong> Log in, schedule a service as a <strong>Resident</strong>, then toggle to <strong>Dispatcher</strong> mode to assign workers in real-time!
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {currentUser && currentUser.role === 'admin' && (
              <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700">
                <button
                  onClick={() => {
                    setCurrentView('client');
                    triggerToast('Switched to Resident View', 'info');
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-all ${
                    currentView === 'client' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Resident View
                </button>
                <button
                  onClick={() => {
                    setCurrentView('admin');
                    triggerToast('Switched to Dispatcher View', 'info');
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-all ${
                    currentView === 'admin' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Dispatcher View
                </button>
              </div>
            )}
            <button
              onClick={() => setShowDemoTip(false)}
              className="text-slate-400 hover:text-white font-bold p-0.5 rounded cursor-pointer"
              title="Close Tip"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuth={() => setAuthModalOpen(true)}
        currentView={currentView}
        onSwitchView={(view) => {
          if (!currentUser && view !== 'landing') {
            setAuthModalOpen(true);
            triggerToast('Please sign in first to access dashboards.', 'info');
          } else {
            setCurrentView(view);
          }
        }}
      />

      {/* Primary Content View Router */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onOpenAuth={() => setAuthModalOpen(true)}
            onSelectCategoryPreview={handleSelectCategoryPreview}
          />
        )}

        {currentView === 'client' && currentUser && (
          <ClientDashboard
            currentUser={currentUser}
            bookings={bookings}
            messages={messages}
            onMarkMessageAsRead={handleMarkMessageAsRead}
            onAddBooking={handleAddBooking}
            onCancelBooking={handleCancelBooking}
            selectedCategoryPreview={selectedCategoryPreview}
            onClearCategoryPreview={() => setSelectedCategoryPreview(null)}
          />
        )}

        {currentView === 'admin' && currentUser && (
          <AdminDashboard
            bookings={bookings}
            onDispatchBooking={handleDispatchBooking}
            onCompleteBooking={handleCompleteBooking}
          />
        )}
      </main>

      {/* Footer component */}
      <Footer />

      {/* Popups & Dialogs */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Floating notifications */}
      <Toast toasts={toasts} onClose={removeToast} />

    </div>
  );
}
