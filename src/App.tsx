import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import ClientDashboard from './components/ClientDashboard';
import AdminDashboard from './components/AdminDashboard';
import SpecialistRoster from './components/SpecialistRoster';
import SpecialistDashboard from './components/SpecialistDashboard';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import FaqModal from './components/FaqModal';
import ProviderApplicationModal from './components/ProviderApplicationModal';
import Toast, { ToastMessage } from './components/Toast';
import { User, Booking, Provider } from './types';
import { INITIAL_BOOKINGS, MOCK_PROVIDERS } from './mockData';
import { ShieldCheck, UserCheck, Sparkles, HelpCircle } from 'lucide-react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where, 
  getDoc 
} from 'firebase/firestore';
import { auth, db } from './firebase';

export default function App() {
  // Core Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Bookings state
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Providers (Experts) state
  const [providers, setProviders] = useState<Provider[]>([]);

  // Message Inbox state (for automated notifications)
  const [messages, setMessages] = useState<Array<{
    id: string;
    userId: string;
    title: string;
    content: string;
    createdAt: string;
    read: boolean;
    sender: string;
  }>>([]);

  // UI state
  const [currentView, setCurrentView] = useState<'landing' | 'client' | 'admin' | 'roster' | 'specialist'>('landing');

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [providerApplyModalOpen, setProviderApplyModalOpen] = useState(false);
  const [selectedCategoryPreview, setSelectedCategoryPreview] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

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

  // Helper to determine starting view based on role
  const getViewForUser = (user: User): 'admin' | 'specialist' | 'client' => {
    if (user.role === 'admin') return 'admin';
    if (user.role === 'provider') return 'specialist';
    return 'client';
  };

  // 1. Firebase Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      setAuthLoading(true);
      if (userAuth) {
        try {
          const userDocRef = doc(db, 'users', userAuth.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const profile = userDocSnap.data() as User;
            setCurrentUser(profile);
            setCurrentView(getViewForUser(profile));
          } else {
            // Profile document doesn't exist yet, create default resident
            const cleanName = userAuth.email ? userAuth.email.split('@')[0] : 'Resident';
            const isDemoAdmin = userAuth.email === 'f6144050@gmail.com' || userAuth.email === 'admin@estateconnect.co.ke';
            
            const profile: User = {
              id: userAuth.uid,
              name: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
              email: userAuth.email || '',
              role: isDemoAdmin ? 'admin' : 'resident',
              estateName: 'Fedha Estate',
              houseDetails: 'Block C, Apartment 4B',
              phone: '+254 799 111 222',
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, profile);
            setCurrentUser(profile);
            setCurrentView(getViewForUser(profile));
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
          triggerToast("Notice connecting to database backend", "info");
        }
      } else {
        const savedSession = localStorage.getItem('estateease_user_session');
        if (savedSession) {
          try {
            const parsedUser = JSON.parse(savedSession) as User;
            setCurrentUser(parsedUser);
            setCurrentView(getViewForUser(parsedUser));
          } catch (e) {
            setCurrentUser(null);
            setCurrentView('landing');
          }
        } else {
          setCurrentUser(null);
          setCurrentView('landing');
        }
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Real-time Bookings synchronization
  useEffect(() => {
    if (!currentUser) {
      setBookings([]);
      return;
    }

    const q = (currentUser.role === 'admin' || currentUser.role === 'provider')
      ? query(collection(db, 'bookings'))
      : query(collection(db, 'bookings'), where('residentId', '==', currentUser.id));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      if (snapshot.empty && currentUser.role === 'resident' && (currentUser.email === 'resident@estateconnect.co.ke' || currentUser.email === 'iankariri2@gmail.com')) {
        // Automatically seed demo bookings to keep visual state rich
        try {
          for (const b of INITIAL_BOOKINGS) {
            await setDoc(doc(db, 'bookings', b.id), b);
          }
        } catch (err) {
          console.warn("Notice seeding initial bookings: ", err);
        }
      } else {
        const list: Booking[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as Booking);
        });
        // Sort descending by createdAt
        list.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
        setBookings(list.length > 0 ? list : (currentUser.role === 'resident' ? INITIAL_BOOKINGS : []));
      }
    }, (err) => {
      console.warn("Bookings subscription notice:", err?.message || err);
      if (currentUser.role === 'resident') {
        setBookings(INITIAL_BOOKINGS);
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  // 3. Real-time Messages synchronization
  useEffect(() => {
    if (!currentUser) {
      setMessages([]);
      return;
    }

    const q = currentUser.role === 'admin'
      ? query(collection(db, 'messages'))
      : query(collection(db, 'messages'), where('userId', '==', currentUser.id));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      if (snapshot.empty && currentUser.role === 'resident') {
        try {
          const defaultMsg = {
            id: 'msg-default-1',
            userId: currentUser.id,
            title: 'Welcome to EstateConnect Portal! 🎉',
            content: `Hello ${currentUser.name || 'Resident'}! Welcome to EstateConnect. We are thrilled to have you as a verified member of our Fedha Estate community. We look forward to fulfilling your service requests with premium domestic assistance!`,
            createdAt: new Date().toISOString(),
            read: false,
            sender: 'Estate Administration'
          };
          await setDoc(doc(db, 'messages', 'msg-default-1'), defaultMsg);
        } catch (err) {
          console.warn("Notice seeding messages: ", err);
        }
      } else {
        const list: any[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() });
        });
        list.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
        setMessages(list);
      }
    }, (err) => {
      console.warn("Messages subscription notice:", err?.message || err);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // 4. Real-time Providers (Specialists) synchronization
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'providers'), async (snapshot) => {
      if (snapshot.empty && currentUser && currentUser.role === 'admin') {
        try {
          for (const prov of MOCK_PROVIDERS) {
            await setDoc(doc(db, 'providers', prov.id), prov);
          }
        } catch (err) {
          console.warn("Notice seeding providers database: ", err);
        }
      } else {
        const list: Provider[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as Provider);
        });
        setProviders(list.length > 0 ? list : MOCK_PROVIDERS);
      }
    }, (err) => {
      console.warn("Providers subscription notice:", err?.message || err);
      setProviders(MOCK_PROVIDERS);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Auth Callbacks
  const handleAuthSuccess = async (user: User, message: string) => {
    localStorage.setItem('estateease_user_session', JSON.stringify(user));
    setCurrentUser(user);
    setCurrentView(getViewForUser(user));
    triggerToast(message, 'success');

    // Automatically welcome new residents with congratulations depending on their gender
    if (user.role === 'resident' && user.id !== 'user-1') {
      try {
        const alreadyHasWelcomeMsg = messages.some(m => m.userId === user.id);
        if (!alreadyHasWelcomeMsg) {
          let salutation = 'esteemed resident';
          if (user.gender === 'male') {
            salutation = 'sir';
          } else if (user.gender === 'female') {
            salutation = 'madam';
          }

          const welcomeText = `Hello ${user.name}! Congratulations, ${salutation}, for joining EstateConnect! We are absolutely thrilled to welcome you to our community. We are looking forward to your first service order with us! Let our team of professional dispatchers and vetted experts make your household management effortless.`;

          const msgId = `msg-${Date.now()}`;
          const newMsg = {
            id: msgId,
            userId: user.id,
            title: 'Congratulations on Joining EstateConnect! 🎉',
            content: welcomeText,
            createdAt: new Date().toISOString(),
            read: false,
            sender: 'Estate Administration'
          };

          await setDoc(doc(db, 'messages', msgId), newMsg);
          
          setTimeout(() => {
            triggerToast(`You have an official notification in your inbox!`, 'info');
          }, 1500);
        }
      } catch (err) {
        console.error("Error adding welcome message:", err);
      }
    }
  };

  const handleMarkMessageAsRead = async (msgId: string) => {
    try {
      await updateDoc(doc(db, 'messages', msgId), { read: true });
    } catch (err) {
      console.error("Error marking message as read:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Signout error:", e);
    }
    localStorage.removeItem('estateease_user_session');
    setCurrentUser(null);
    setCurrentView('landing');
    triggerToast('You have signed out safely. Come back soon!', 'info');
  };

  // ----------------------------------------------------
  // Resident Action Handlers
  // ----------------------------------------------------
  const handleAddBooking = async (newBookingData: Omit<Booking, 'id' | 'createdAt' | 'status'>) => {
    const bookingId = `book-${Date.now()}`;
    const newBooking: Booking = {
      ...newBookingData,
      id: bookingId,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'bookings', bookingId), newBooking);
      triggerToast(`Order placed for ${newBooking.serviceName}! Our dispatchers are assigning a vetted specialist.`, 'success');
    } catch (err: any) {
      console.error("Error saving booking to Firestore:", err);
      setBookings(prev => [newBooking, ...prev]);
      triggerToast(`Order for ${newBooking.serviceName} scheduled!`, 'success');
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), { status: 'Cancelled' });
      triggerToast('Service request was cancelled.', 'info');
    } catch (err) {
      console.error("Error cancelling booking in Firestore:", err);
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'Cancelled' } : b));
      triggerToast('Service request cancelled locally.', 'info');
    }
  };

  const handleAcceptQuote = async (bookingId: string) => {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), { 
        status: 'Dispatched',
        quotedPriceStatus: 'Accepted' 
      });
      triggerToast('Custom quote accepted! Specialist dispatched to your residence.', 'success');
    } catch (err) {
      console.error("Error accepting quote:", err);
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'Dispatched', quotedPriceStatus: 'Accepted' } : b));
    }
  };

  // ----------------------------------------------------
  // Admin & Specialist Action Handlers
  // ----------------------------------------------------
  const handleDispatchBooking = async (bookingId: string, provider: Provider) => {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        status: 'Dispatched',
        providerName: provider.name,
        providerPhone: provider.phone
      });
      triggerToast(`Specialist ${provider.name} successfully dispatched to the resident!`, 'success');
    } catch (err) {
      console.error("Error dispatching booking in Firestore:", err);
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'Dispatched', providerName: provider.name, providerPhone: provider.phone } : b));
      triggerToast(`Specialist ${provider.name} dispatched!`, 'success');
    }
  };

  const handleCompleteBooking = async (bookingId: string) => {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), { status: 'Completed' });
      triggerToast('Service work verified and marked as Completed!', 'success');
    } catch (err) {
      console.error("Error completing booking:", err);
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'Completed' } : b));
      triggerToast('Order marked completed locally.', 'success');
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    try {
      await deleteDoc(doc(db, 'bookings', bookingId));
      triggerToast('Booking order deleted from estate database.', 'info');
    } catch (err) {
      console.error("Error deleting booking:", err);
      setBookings(prev => prev.filter(b => b.id !== bookingId));
      triggerToast('Order deleted.', 'info');
    }
  };

  const handleOfferQuote = async (bookingId: string, quotedAmount: number) => {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        price: quotedAmount,
        quotedPriceStatus: 'Pending_Approval'
      });
      triggerToast(`Custom inspection quote of KES ${quotedAmount.toLocaleString()} sent to resident for approval!`, 'success');
    } catch (err) {
      console.error("Error offering quote:", err);
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, price: quotedAmount, quotedPriceStatus: 'Pending_Approval' } : b));
    }
  };

  const handleRegisterProvider = async (newProviderData: Omit<Provider, 'id' | 'rating'>) => {
    const provId = `prov-${Date.now()}`;
    const newProv: Provider = {
      ...newProviderData,
      rating: 5.0,
      id: provId
    };

    try {
      await setDoc(doc(db, 'providers', provId), newProv);
      triggerToast(`Specialist ${newProv.name} added to the verified roster!`, 'success');
    } catch (err) {
      console.error("Error adding provider:", err);
      setProviders(prev => [...prev, newProv]);
      triggerToast(`Specialist ${newProv.name} registered.`, 'success');
    }
  };

  const handleToggleProviderDuty = async (providerId: string) => {
    const existing = providers.find(p => p.id === providerId);
    const newStatus = existing ? !existing.onDuty : true;

    try {
      await updateDoc(doc(db, 'providers', providerId), { onDuty: newStatus });
      triggerToast(`Specialist duty status updated to ${newStatus ? 'On Duty' : 'Off Duty'}`, 'info');
    } catch (err) {
      console.error("Error toggling provider duty:", err);
      setProviders(prev => prev.map(p => p.id === providerId ? { ...p, onDuty: newStatus } : p));
    }
  };

  const handleSelectCategoryPreview = (categoryName: string) => {
    setSelectedCategoryPreview(categoryName);
    if (!currentUser) {
      setAuthModalOpen(true);
      triggerToast(`Please sign in or register to book ${categoryName}!`, 'info');
    } else if (currentUser.role === 'provider') {
      setCurrentView('specialist');
    } else if (currentUser.role === 'admin') {
      setCurrentView('admin');
    } else {
      setCurrentView('client');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans antialiased selection:bg-amber-100 selection:text-amber-900">
      
      {/* Official Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuth={() => setAuthModalOpen(true)}
        currentView={currentView}
        onSwitchView={(view) => {
          if (!currentUser && view !== 'landing') {
            setAuthModalOpen(true);
            triggerToast('Please sign in first to access dashboards.', 'info');
          } else if (currentUser && view !== 'landing') {
            const isAuthorized = currentUser.role === 'admin' 
              ? (view === 'admin' || view === 'roster')
              : currentUser.role === 'provider'
              ? (view === 'specialist')
              : (view === 'client');
            
            if (!isAuthorized) {
              triggerToast('Security Alert: You are signed into a specific role profile.', 'info');
            } else {
              setCurrentView(view);
            }
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
            onAcceptQuote={handleAcceptQuote}
            selectedCategoryPreview={selectedCategoryPreview}
            onClearCategoryPreview={() => setSelectedCategoryPreview(null)}
          />
        )}

        {currentView === 'specialist' && currentUser && (
          <SpecialistDashboard
            currentUser={currentUser}
            bookings={bookings}
            onCompleteBooking={handleCompleteBooking}
          />
        )}

        {currentView === 'admin' && currentUser && (
          <AdminDashboard
            bookings={bookings}
            providers={providers}
            onDispatchBooking={handleDispatchBooking}
            onCompleteBooking={handleCompleteBooking}
            onDeleteBooking={handleDeleteBooking}
            onOfferQuote={handleOfferQuote}
            onRegisterProvider={handleRegisterProvider}
            onToggleProviderDuty={handleToggleProviderDuty}
            onNavigateToRoster={() => setCurrentView('roster')}
          />
        )}

        {currentView === 'roster' && currentUser && currentUser.role === 'admin' && (
          <SpecialistRoster
            providers={providers}
            onToggleProviderDuty={handleToggleProviderDuty}
            onBackToDashboard={() => setCurrentView('admin')}
          />
        )}
      </main>

      {/* Footer component */}
      <Footer 
        onSelectServiceCategory={handleSelectCategoryPreview}
        onOpenFaq={() => setFaqModalOpen(true)}
        onOpenProviderApply={() => setProviderApplyModalOpen(true)}
      />

      {/* Popups & Dialogs */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <FaqModal
        isOpen={faqModalOpen}
        onClose={() => setFaqModalOpen(false)}
        onOpenProviderApply={() => setProviderApplyModalOpen(true)}
      />

      <ProviderApplicationModal
        isOpen={providerApplyModalOpen}
        onClose={() => setProviderApplyModalOpen(false)}
        onSubmitSuccess={(ref) => triggerToast(`Application ${ref} saved! Your specialist credentials are registered in the backend.`, 'success')}
      />

      {/* Floating notifications */}
      <Toast toasts={toasts} onClose={removeToast} />

    </div>
  );
}
