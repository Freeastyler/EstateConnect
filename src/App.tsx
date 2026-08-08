import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import ClientDashboard from './components/ClientDashboard';
import AdminDashboard from './components/AdminDashboard';
import SpecialistRoster from './components/SpecialistRoster';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
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

  // Message Inbox state (for automated congratulations and notices)
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
  const [currentView, setCurrentView] = useState<'landing' | 'client' | 'admin' | 'roster'>('landing');

  const [authModalOpen, setAuthModalOpen] = useState(false);
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
            setCurrentView(profile.role === 'admin' ? 'admin' : 'client');
          } else {
            // Profile document doesn't exist yet, create default resident
            const cleanName = userAuth.email ? userAuth.email.split('@')[0] : 'Resident';
            const isDemoAdmin = userAuth.email === 'f6144050@gmail.com' || userAuth.email === 'iankariri2@gmail.com';
            
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
            setCurrentView(profile.role === 'admin' ? 'admin' : 'client');
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
          triggerToast("Error loading profile from database", "error");
        }
      } else {
        const savedSession = localStorage.getItem('estateease_user_session');
        if (savedSession) {
          try {
            const parsedUser = JSON.parse(savedSession) as User;
            setCurrentUser(parsedUser);
            setCurrentView(parsedUser.role === 'admin' ? 'admin' : 'client');
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

  // 2. Real-time Bookings synchronization & Seeding
  useEffect(() => {
    if (!currentUser) {
      setBookings([]);
      return;
    }

    const q = currentUser.role === 'admin'
      ? query(collection(db, 'bookings'))
      : query(collection(db, 'bookings'), where('residentId', '==', currentUser.id));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      if (snapshot.empty && currentUser.role === 'resident' && currentUser.email === 'iankariri2@gmail.com') {
        // Automatically seed demo bookings for Ian to keep visual state rich
        try {
          for (const b of INITIAL_BOOKINGS) {
            await setDoc(doc(db, 'bookings', b.id), b);
          }
        } catch (err) {
          console.error("Error seeding initial bookings: ", err);
        }
      } else {
        const list: Booking[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as Booking);
        });
        // Sort descending by createdAt
        list.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
        setBookings(list);
      }
    }, (err) => {
      console.error("Bookings subscription error: ", err);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // 3. Real-time Messages synchronization & Seeding
  useEffect(() => {
    if (!currentUser) {
      setMessages([]);
      return;
    }

    const q = currentUser.role === 'admin'
      ? query(collection(db, 'messages'))
      : query(collection(db, 'messages'), where('userId', '==', currentUser.id));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      if (snapshot.empty && currentUser.role === 'resident' && currentUser.email === 'iankariri2@gmail.com') {
        // Seed default welcome message
        try {
          const defaultMsg = {
            id: 'msg-default-1',
            userId: currentUser.id,
            title: 'Welcome to EstateConnect Portal! 🎉',
            content: 'Hello Ian! Congratulations, sir, on joining EstateConnect! We are absolutely thrilled to have you as a verified member of our Fedha Estate family. We look forward to fulfilling your first service order with us and ensuring premium domestic assistance!',
            createdAt: new Date().toISOString(),
            read: false,
            sender: 'Estate Administration'
          };
          await setDoc(doc(db, 'messages', 'msg-default-1'), defaultMsg);
        } catch (err) {
          console.error("Error seeding messages: ", err);
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
      console.error("Messages subscription error: ", err);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // 4. Real-time Providers (Specialists) synchronization & Auto-seeding
  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = onSnapshot(collection(db, 'providers'), async (snapshot) => {
      if (snapshot.empty && currentUser.role === 'admin') {
        // Automatically seed providers if empty and user is admin
        try {
          for (const prov of MOCK_PROVIDERS) {
            await setDoc(doc(db, 'providers', prov.id), prov);
          }
        } catch (err) {
          console.error("Error seeding providers database: ", err);
        }
      } else {
        const list: Provider[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as Provider);
        });
        setProviders(list.length > 0 ? list : MOCK_PROVIDERS);
      }
    }, (err) => {
      console.error("Providers subscription error: ", err);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Auth Callbacks
  const handleAuthSuccess = async (user: User, message: string) => {
    localStorage.setItem('estateease_user_session', JSON.stringify(user));
    setCurrentUser(user);
    setCurrentView(user.role === 'admin' ? 'admin' : 'client');
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
            triggerToast(`You have an official automated notification in your inbox!`, 'info');
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
      localStorage.removeItem('estateease_user_session');
      await signOut(auth);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setCurrentUser(null);
      setCurrentView('landing');
      triggerToast('Logged out of EstateConnect.', 'info');
    }
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
  const handleAddBooking = async (newBooking: {
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

    const bookingId = `EE-${Math.floor(1000 + Math.random() * 9000)}`;
    const booking: Booking = {
      id: bookingId,
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
      status: 'Awaiting Quote',
      providerName: null,
      providerPhone: null,
      price: 0,
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'bookings', bookingId), booking);
      triggerToast(`Booking ${bookingId} requested! Awaiting price quote from dispatchers.`, 'success');
    } catch (err) {
      console.error("Error adding booking:", err);
      triggerToast("Failed to request booking.", "error");
    }
  };

  const handleOfferQuote = async (bookingId: string, price: number) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    try {
      const msgId = `msg-${Date.now()}`;
      const newMsg = {
        id: msgId,
        userId: booking.residentId,
        title: `Price Quote Proposed for Booking ${bookingId} 🏷️`,
        content: `Hello ${booking.residentName}! EstateConnect Administration has reviewed your booking request for ${booking.serviceName} (${booking.categoryName}). We have proposed a total cost of $${price.toFixed(2)}. Please accept the quote on your dashboard so we can proceed with dispatching a support specialist to your residence at ${booking.houseDetails}.`,
        createdAt: new Date().toISOString(),
        read: false,
        sender: 'Estate Administration'
      };

      await setDoc(doc(db, 'messages', msgId), newMsg);
      
      await updateDoc(doc(db, 'bookings', bookingId), {
        price,
        status: 'Quote Offered'
      });

      triggerToast(`Quote of $${price.toFixed(2)} sent to resident for order ${bookingId}.`, 'success');
    } catch (err) {
      console.error("Error offering quote:", err);
      triggerToast("Failed to send quote.", "error");
    }
  };

  const handleAcceptQuote = async (bookingId: string) => {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        status: 'Pending'
      });
      triggerToast(`Quote accepted! Your order is now pending specialist dispatch.`, 'success');
    } catch (err) {
      console.error("Error accepting quote:", err);
      triggerToast("Failed to accept quote.", "error");
    }
  };

  const handleCancelBooking = async (id: string) => {
    const booking = bookings.find(b => b.id === id);
    if (!booking) return;

    const createdAtTime = new Date(booking.createdAt).getTime();
    const timeDiffMs = Date.now() - createdAtTime;
    const fiveMinutesMs = 5 * 60 * 1000;

    if (timeDiffMs > fiveMinutesMs) {
      triggerToast(`Unable to cancel booking ${id}. Bookings can only be cancelled within 5 minutes of order placement.`, 'error');
      return;
    }

    try {
      await updateDoc(doc(db, 'bookings', id), {
        status: 'Canceled'
      });
      triggerToast(`Booking ${id} was cancelled successfully.`, 'info');
    } catch (err) {
      console.error("Error cancelling booking:", err);
      triggerToast("Failed to cancel booking.", "error");
    }
  };

  // Admin Dispatcher Actions
  const handleDispatchBooking = async (bookingId: string, provider: Provider) => {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        status: 'Dispatched',
        providerName: provider.name,
        providerPhone: provider.phone
      });
      triggerToast(`Assigned ${provider.name} to order ${bookingId}. Worker dispatched!`, 'success');
    } catch (err) {
      console.error("Error dispatching booking:", err);
      triggerToast("Failed to dispatch specialist.", "error");
    }
  };

  const handleCompleteBooking = async (bookingId: string) => {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        status: 'Completed'
      });
      triggerToast(`Order ${bookingId} marked as Completed. Security notified!`, 'success');
    } catch (err) {
      console.error("Error completing booking:", err);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    try {
      await deleteDoc(doc(db, 'bookings', bookingId));
      triggerToast(`Booking ${bookingId} has been deleted and archived.`, 'success');
    } catch (err) {
      console.error("Error deleting booking:", err);
    }
  };

  const handleRegisterProvider = async (newProvider: Omit<Provider, 'id' | 'rating'>) => {
    const providerId = `prov-${Date.now()}`;
    const provider: Provider = {
      ...newProvider,
      id: providerId,
      rating: 5.0,
      onDuty: true
    };
    try {
      await setDoc(doc(db, 'providers', providerId), provider);
      triggerToast(`Registered new specialist: ${provider.name} (${provider.specialty})`, 'success');
    } catch (err) {
      console.error("Error registering provider:", err);
    }
  };

  const handleToggleProviderDuty = async (providerId: string) => {
    const p = providers.find(prov => prov.id === providerId);
    if (!p) return;
    const nextDuty = !(p.onDuty !== false);
    try {
      await updateDoc(doc(db, 'providers', providerId), {
        onDuty: nextDuty
      });
    } catch (err) {
      console.error("Error toggling provider duty:", err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF7F2] font-sans">
      
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
          } else if (currentUser && view !== 'landing') {
            const isAuthorized = currentUser.role === 'admin' 
              ? (view === 'admin' || view === 'roster')
              : (view === 'client');
            
            if (!isAuthorized) {
              triggerToast('Security Alert: You cannot switch accounts or roles without signing out and logging in again first.', 'error');
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
      <Footer onSelectServiceCategory={handleSelectCategoryPreview} />

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
