import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ViewState, Restaurant, Booking, LiveActivity, FloorAsset } from './types';
import { INITIAL_BOOKINGS, INITIAL_LIVE_ACTIVITIES, INITIAL_RESTAURANTS } from './data';

import LandingView from './components/LandingView';
import SignInView from './components/SignInView';
import OnboardingView from './components/OnboardingView';
import DashboardView from './components/DashboardView';
import DiscoverView from './components/DiscoverView';
import RestaurantDetailView from './components/RestaurantDetailView';

const DEFAULT_RESTAURANT_IMAGE = 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800';

type StoredOwnerAccount = {
  email: string;
  establishmentName: string;
  isAuthenticated: boolean;
  dashboardData: {
    restaurants: Restaurant[];
    bookings: Booking[];
    activities: LiveActivity[];
  };
  createdAt: string;
  updatedAt: string;
};

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [targetRestaurantId, setTargetRestaurantId] = useState<string>(INITIAL_RESTAURANTS[0]?.id || 'the-monolith');

  const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');

  async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${apiBaseUrl}${path}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `Request failed with status ${response.status}`);
    }

    return response.json() as Promise<T>;
  }

  const [restaurants, setRestaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [liveActivities, setLiveActivities] = useState<LiveActivity[]>(INITIAL_LIVE_ACTIVITIES);
  const [ownerAccount, setOwnerAccount] = useState<StoredOwnerAccount | null>(null);
  const [ownerEstablishmentName, setOwnerEstablishmentName] = useState('Owner Dashboard');
  const [hasOwnerAccess, setHasOwnerAccess] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      try {
        const [restaurantsData, bookingsData, activitiesData] = await Promise.all([
          apiRequest<Restaurant[]>('/api/restaurants'),
          apiRequest<Booking[]>('/api/bookings'),
          apiRequest<LiveActivity[]>('/api/activities')
        ]);

        if (!isMounted) return;

        setRestaurants(restaurantsData.length ? restaurantsData : INITIAL_RESTAURANTS);
        setBookings(bookingsData.length ? bookingsData : INITIAL_BOOKINGS);
        setLiveActivities(activitiesData.length ? activitiesData : INITIAL_LIVE_ACTIVITIES);
      } catch (error) {
        console.error('Unable to load Tableau data from API', error);
      }
    };

    void loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  const handleNavigate = (targetView: ViewState, restaurantId?: string) => {
    if (restaurantId) {
      setTargetRestaurantId(restaurantId);
    }

    if (targetView === 'landing') {
      navigate('/');
      return;
    }
    if (targetView === 'signin') {
      navigate('/signin');
      return;
    }
    if (targetView === 'onboarding') {
      navigate('/onboarding');
      return;
    }
    if (targetView === 'dashboard') {
      navigate('/dashboard');
      return;
    }
    if (targetView === 'discover') {
      navigate('/discover');
      return;
    }
    if (targetView === 'detail') {
      if (restaurantId) {
        navigate(`/restaurant/${restaurantId}`);
      } else {
        navigate('/discover');
      }
      return;
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleSignInSuccess = async (
    role: 'owner' | 'guest',
    target: 'dashboard' | 'onboarding',
    ownerDetails?: { email: string; password: string }
  ) => {
    if (role === 'owner') {
      try {
        if (target === 'dashboard') {
          const authenticatedAccount = await apiRequest<StoredOwnerAccount>('/api/owners/login', {
            method: 'POST',
            body: JSON.stringify({
              email: ownerDetails?.email || 'owner@tableau.com',
              password: ownerDetails?.password || 'securepass'
            })
          });

          setOwnerAccount(authenticatedAccount);
          setOwnerEstablishmentName(authenticatedAccount.establishmentName || 'Owner Dashboard');
          setHasOwnerAccess(true);
          navigate('/dashboard');
        } else {
          const createdAccount = await apiRequest<StoredOwnerAccount>('/api/owners/signup', {
            method: 'POST',
            body: JSON.stringify({
              email: ownerDetails?.email,
              password: ownerDetails?.password,
              establishmentName: 'Owner Dashboard'
            })
          });

          setOwnerAccount(createdAccount);
          setOwnerEstablishmentName(createdAccount.establishmentName || 'Owner Dashboard');
          setHasOwnerAccess(false);
          navigate('/onboarding');
        }
      } catch (error) {
        console.error('Unable to persist owner account', error);
      }
    } else {
      setHasOwnerAccess(false);
      navigate('/discover');
    }

    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleOnboardingComplete = async (details: {
    name: string;
    cuisine: string;
    color: string;
    assets: FloorAsset[];
  }) => {
    setOwnerEstablishmentName(details.name);

    const restaurantId = details.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');

    const newRest: Restaurant = {
      id: restaurantId || 'custom-establishment',
      name: details.name,
      cuisine: details.cuisine,
      rating: 5.0,
      reviewsCount: 1,
      image: DEFAULT_RESTAURANT_IMAGE,
      gallery: [DEFAULT_RESTAURANT_IMAGE],
      description: `Newly deployed dining sanctuary: ${details.name}. Specializing in ${details.cuisine}. Crafted customized layouts align.`,
      philosophies: ['Simplicity in action', 'Precision is hospitality art'],
      amenities: ['Private Cellar', 'Chef Table', 'Valet Parking'],
      address: '77 Grid Avenue Center, Main Hall',
      coordinates: { lat: 37.7749, lng: -122.4194 },
      popularTimeSlots: ['18:00', '19:30', '20:45', '21:30']
    };

    const onboardingBookingId = `ob_${Date.now()}`;
    const optimisticBooking: Booking = {
      id: onboardingBookingId,
      guestName: 'Chef Massimo (VIP Audit)',
      covers: 2,
      tableNo: details.assets[0]?.number || '01',
      time: '19:30',
      status: 'confirmed',
      specialNotes: 'Grand opening setup verified.',
      restaurantId: newRest.id
    };

    const onboardingActivity: LiveActivity = {
      id: 'onboard_act_' + Date.now(),
      type: 'system',
      message: `Onboarding completed for ${details.name}: live floor grid published and reservation operations activated.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      latency: '0.8ms',
      category: 'success'
    };

    setRestaurants(prev => [newRest, ...prev]);
    setBookings(prev => [optimisticBooking, ...prev]);
    setLiveActivities(prev => [onboardingActivity, ...prev]);
    setTargetRestaurantId(newRest.id);

    try {
      const createdRestaurant = await apiRequest<Restaurant>('/api/restaurants', {
        method: 'POST',
        body: JSON.stringify(newRest)
      });

      setRestaurants(prev => prev.map(item => item.id === newRest.id ? createdRestaurant : item));
      setTargetRestaurantId(createdRestaurant.id);

      const createdBooking = await apiRequest<Booking>('/api/bookings', {
        method: 'POST',
        body: JSON.stringify({
          ...optimisticBooking,
          restaurantId: createdRestaurant.id
        })
      });

      setBookings(prev => prev.map(item => item.id === optimisticBooking.id ? createdBooking : item));

      const createdActivity = await apiRequest<LiveActivity>('/api/activities', {
        method: 'POST',
        body: JSON.stringify(onboardingActivity)
      });

      setLiveActivities(prev => prev.map(item => item.id === onboardingActivity.id ? createdActivity : item));

      if (!ownerAccount?.email) {
        throw new Error('Owner account is not available for onboarding persistence.');
      }

      const persistedOwnerAccount = await apiRequest<StoredOwnerAccount>(`/api/owners/${encodeURIComponent(ownerAccount.email)}`, {
        method: 'PATCH',
        body: JSON.stringify({
          establishmentName: details.name,
          dashboardData: {
            restaurants: [createdRestaurant],
            bookings: [createdBooking],
            activities: [createdActivity]
          },
          isAuthenticated: true
        })
      });

      setOwnerAccount(persistedOwnerAccount);
    } catch (error) {
      console.error('Failed to persist onboarding data', error);
      setRestaurants(prev => prev.filter(item => item.id !== newRest.id));
      setBookings(prev => prev.filter(item => item.id !== optimisticBooking.id));
      setLiveActivities(prev => prev.filter(item => item.id !== onboardingActivity.id));
    }

    setHasOwnerAccess(true);
    navigate('/dashboard');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleBookSuccess = async (guestName: string, party: number, hour: string, calendarDate: string) => {
    const targetRest = restaurants.find(r => r.id === targetRestaurantId) || restaurants[0];
    const restaurantName = targetRest?.name ?? 'selected restaurant';

    const mockTableNo = ['02', '04', '07', '12', '09'][Math.floor(Math.random() * 5)];
    const bookingId = 'cus_' + Date.now();

    const optimisticBooking: Booking = {
      id: bookingId,
      guestName,
      covers: party,
      tableNo: mockTableNo,
      time: hour,
      status: 'confirmed',
      specialNotes: `Online checkout entry. Scheduled sequence on ${calendarDate}.`,
      restaurantId: targetRestaurantId
    };

    const optimisticActivity: LiveActivity = {
      id: 'cus_act_' + Date.now(),
      type: 'booking',
      message: `Consumer app reservation locked: ${guestName} (Party of ${party}) booked table ${mockTableNo} at ${restaurantName}.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      latency: '1.2ms',
      category: 'success'
    };

    setBookings(prev => [optimisticBooking, ...prev]);
    setLiveActivities(prev => [optimisticActivity, ...prev]);

    try {
      const createdBooking = await apiRequest<Booking>('/api/bookings', {
        method: 'POST',
        body: JSON.stringify(optimisticBooking)
      });

      setBookings(prev => prev.map(item => item.id === optimisticBooking.id ? createdBooking : item));

      const createdActivity = await apiRequest<LiveActivity>('/api/activities', {
        method: 'POST',
        body: JSON.stringify(optimisticActivity)
      });

      setLiveActivities(prev => prev.map(item => item.id === optimisticActivity.id ? createdActivity : item));
    } catch (error) {
      console.error('Failed to persist booking activity', error);
      setBookings(prev => prev.filter(item => item.id !== optimisticBooking.id));
      setLiveActivities(prev => prev.filter(item => item.id !== optimisticActivity.id));
    }

    navigate('/discover');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleUpdateBookingStatus = async (id: string, newStatus: 'seated' | 'confirmed' | 'arriving' | 'canceled') => {
    const targetBooking = bookings.find(b => b.id === id);
    if (!targetBooking) return;

    const previousBooking = { ...targetBooking };
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));

    const statusActivity: LiveActivity = {
      id: 'stat_act_' + Date.now(),
      type: 'attendance',
      message: `Operational check: ${targetBooking.guestName} marked as ${newStatus.toUpperCase()} at table ${targetBooking.tableNo}.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      latency: '0.9ms',
      category: 'info'
    };

    setLiveActivities(prev => [statusActivity, ...prev]);

    try {
      const updatedBooking = await apiRequest<Booking>(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });

      setBookings(prev => prev.map(b => b.id === id ? updatedBooking : b));

      const createdActivity = await apiRequest<LiveActivity>('/api/activities', {
        method: 'POST',
        body: JSON.stringify(statusActivity)
      });

      setLiveActivities(prev => prev.map(activity => activity.id === statusActivity.id ? createdActivity : activity));
    } catch (error) {
      console.error('Failed to update booking status', error);
      setBookings(prev => prev.map(b => b.id === id ? previousBooking : b));
      setLiveActivities(prev => prev.filter(activity => activity.id !== statusActivity.id));
    }
  };

  const handleAddManualBooking = async (newBooking: Booking) => {
    const optimisticBooking: Booking = {
      ...newBooking,
      restaurantId: newBooking.restaurantId ?? targetRestaurantId
    };

    setBookings(prev => [optimisticBooking, ...prev]);

    try {
      const createdBooking = await apiRequest<Booking>('/api/bookings', {
        method: 'POST',
        body: JSON.stringify(optimisticBooking)
      });

      setBookings(prev => prev.map(item => item.id === optimisticBooking.id ? createdBooking : item));
    } catch (error) {
      console.error('Failed to add manual booking', error);
      setBookings(prev => prev.filter(item => item.id !== optimisticBooking.id));
    }
  };

  const activeRestaurant = restaurants.find(r => r.id === targetRestaurantId) || restaurants[0];

  const DetailPage = () => {
    const { restaurantId } = useParams<{ restaurantId: string }>();

    useEffect(() => {
      if (restaurantId) {
        setTargetRestaurantId(restaurantId);
      }
    }, [restaurantId]);

    const selectedRestaurant = restaurants.find(r => r.id === restaurantId) || activeRestaurant;

    return (
      <RestaurantDetailView
        restaurant={selectedRestaurant}
        onBack={() => navigate('/discover')}
        onBookSuccess={handleBookSuccess}
      />
    );
  };

  return (
    <div id="tableau-application-container" className="selection:bg-orange-500/20 antialiased">
      <Routes>
        <Route
          path="/"
          element={
            <LandingView
              restaurants={restaurants}
              onNavigate={(targetView, restaurantId) => handleNavigate(targetView as ViewState, restaurantId)}
            />
          }
        />
        <Route
          path="/signin"
          element={
            <SignInView
              onSignInSuccess={handleSignInSuccess}
              onBack={() => navigate('/')}
            />
          }
        />
        <Route
          path="/onboarding"
          element={
            <OnboardingView
              onComplete={handleOnboardingComplete}
              onBack={() => navigate('/signin')}
            />
          }
        />
        <Route
          path="/dashboard"
          element={
            hasOwnerAccess ? (
              <DashboardView
                establishmentName={ownerEstablishmentName}
                bookings={bookings}
                activities={liveActivities}
                onAddBooking={handleAddManualBooking}
                onUpdateBookingStatus={handleUpdateBookingStatus}
                onLogout={async () => {
                  if (ownerAccount?.email) {
                    try {
                      await apiRequest<StoredOwnerAccount>(`/api/owners/${encodeURIComponent(ownerAccount.email)}`, {
                        method: 'PATCH',
                        body: JSON.stringify({
                          isAuthenticated: false
                        })
                      });
                    } catch (error) {
                      console.error('Unable to clear owner session', error);
                    }
                  }

                  setHasOwnerAccess(false);
                  setOwnerAccount(null);
                  setOwnerEstablishmentName('Owner Dashboard');
                  navigate('/signin');
                }}
              />
            ) : (
              <Navigate to="/signin" replace />
            )
          }
        />
        <Route
          path="/discover"
          element={
            <DiscoverView
              restaurants={restaurants}
              onSelectRestaurant={(id) => navigate(`/restaurant/${id}`)}
              onBack={() => navigate('/')}
            />
          }
        />
        <Route path="/restaurant/:restaurantId" element={<DetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
