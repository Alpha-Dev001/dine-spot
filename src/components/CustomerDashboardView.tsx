import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  LogOut, CalendarRange, User, MapPin, Star, Compass, LayoutGrid, Utensils, Clock, Users
} from 'lucide-react';
import { Booking, Restaurant } from '../types';
import CustomerBookingPanel, { displayNameFromEmail } from './CustomerBookingPanel';

interface CustomerDashboardViewProps {
  restaurant: Restaurant;
  restaurants: Restaurant[];
  bookings: Booking[];
  customerEmail: string;
  onBookSuccess: (
    bookingName: string,
    party: number,
    hour: string,
    calendarDate: string,
    customerEmail?: string,
    guestNotes?: string
  ) => void | Promise<void>;
  onLogout: () => void | Promise<void>;
  onSelectRestaurant: (id: string) => void;
  onBrowseRestaurants: () => void;
}

type CustomerTab = 'book' | 'reservations';

export default function CustomerDashboardView({
  restaurant,
  restaurants,
  bookings,
  customerEmail,
  onBookSuccess,
  onLogout,
  onSelectRestaurant,
  onBrowseRestaurants
}: CustomerDashboardViewProps) {
  const [activeTab, setActiveTab] = useState<CustomerTab>('book');
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>(restaurant.id);
  const guestName = displayNameFromEmail(customerEmail);

  useEffect(() => {
    setSelectedRestaurantId(restaurant.id);
  }, [restaurant.id]);

  const myBookings = useMemo(() => {
    return bookings
      .filter((b) => (b.email || '').toLowerCase() === customerEmail.toLowerCase())
      .slice(0, 12);
  }, [bookings, customerEmail]);

  const restaurantLookup = useMemo(() => {
    return new Map(restaurants.map((r) => [r.id, r]));
  }, [restaurants]);

  const upcomingCount = myBookings.filter((b) => b.status === 'confirmed' || b.status === 'arriving').length;

  return (
    <div className="min-h-screen p-3 bg-[radial-gradient(circle_at_top,#241d1a_0%,#070707_44%,#020202_100%)] text-[#fffaf4] font-sans">
      <div className="h-[calc(100vh-1.5rem)] overflow-hidden rounded-[30px] border border-white/5 bg-[#050505]/70 backdrop-blur-xl shadow-[0_30px_120px_-35px_rgba(0,0,0,0.95)] flex">

        {/* Sidebar */}
        <aside className="hidden lg:flex my-4 ml-4 h-[calc(100%-2rem)] flex-col justify-between w-72 rounded-[26px] border border-[#2b241f]/70 bg-[#070707]/70 backdrop-blur-xl p-6 shrink-0 z-20">
          <div className="space-y-8">
            <div className="flex items-center space-x-3">
              <img src="/favicon.svg" alt="Tableau" className="w-8 h-8" />
              <span className="font-serif text-lg font-light text-orange-300">T A B L E A U</span>
            </div>

            <div className="space-y-1.5">
              <span className="font-mono text-[9px] tracking-widest text-neutral-600 uppercase block pl-2.5">Guest Portal</span>

              <button
                onClick={() => setActiveTab('book')}
                className={`w-full flex items-center space-x-3 text-xs font-mono uppercase tracking-widest px-3 py-3 rounded-md transition-all text-left ${
                  activeTab === 'book'
                    ? 'bg-orange-300 text-[#251b14] font-bold'
                    : 'text-[#a38d7d] hover:text-[#fffaf5] hover:bg-[#14110f]'
                }`}
              >
                <Utensils className="w-4 h-4 shrink-0" />
                <span>Book a Table</span>
              </button>

              <button
                onClick={() => setActiveTab('reservations')}
                className={`w-full flex items-center space-x-3 text-xs font-mono uppercase tracking-widest px-3 py-3 rounded-md transition-all text-left ${
                  activeTab === 'reservations'
                    ? 'bg-orange-300 text-[#251b14] font-bold'
                    : 'text-[#a38d7d] hover:text-[#fffaf5] hover:bg-[#14110f]'
                }`}
              >
                <CalendarRange className="w-4 h-4 shrink-0" />
                <span>My Reservations</span>
              </button>

              <button
                onClick={onBrowseRestaurants}
                className="w-full flex items-center space-x-3 text-xs font-mono uppercase tracking-widest px-3 py-2 text-left text-neutral-500 hover:text-neutral-300 hover:bg-[#14110f] rounded-md transition-all"
              >
                <Compass className="w-3.5 h-3.5 shrink-0" />
                <span>Discover Salons</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-3 bg-neutral-900/40 rounded-lg border border-neutral-900">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-orange-300/15 border border-orange-300/20 flex items-center justify-center">
                  <span className="font-serif text-orange-300 text-xs">{guestName.charAt(0)}</span>
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-serif text-neutral-200 truncate">{guestName}</div>
                  <div className="text-[9px] font-mono text-neutral-500 truncate">{customerEmail}</div>
                </div>
              </div>
              <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
                {myBookings.length} total · {upcomingCount} upcoming
              </div>
            </div>

            <button
              onClick={() => void onLogout()}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-neutral-900 hover:bg-red-950/20 border border-neutral-900 hover:border-red-500/20 text-neutral-400 hover:text-red-400 text-xs font-mono tracking-widest uppercase rounded transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign out</span>
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="m-4 lg:m-0 lg:my-4 lg:mr-4 flex-1 flex flex-col min-w-0 overflow-hidden rounded-[26px] bg-[#030303]/25">

          {/* Top bar */}
          <header className="mx-4 mt-4 px-4 sm:px-6 py-4 rounded-[22px] border border-[#2b241f]/60 bg-[#070707]/70 backdrop-blur-xl flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center shrink-0">
            <div className="flex items-center gap-3 min-w-0">
              <img src="/favicon.svg" alt="Tableau" className="lg:hidden w-7 h-7 shrink-0" />
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-orange-400/10 border border-orange-300/20 text-orange-300 text-[10px] font-mono tracking-widest uppercase rounded-full mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-300 animate-pulse" />
                  Guest session active
                </div>
                <div className="font-serif text-lg font-light text-[#fffaf5] truncate">
                  Welcome, {guestName}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedRestaurantId}
                onChange={(e) => {
                  const next = e.target.value;
                  setSelectedRestaurantId(next);
                  onSelectRestaurant(next);
                }}
                className="flex-1 sm:w-56 bg-[#11100f] border border-[#3a2d27] hover:border-[#5a3b29] focus:border-orange-300/40 text-[11px] font-mono px-3 py-2 rounded-lg text-neutral-200 outline-none"
              >
                {restaurants.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
          </header>

          {/* Mobile tabs */}
          <div className="lg:hidden mx-4 mt-3 flex gap-2 overflow-x-auto scrollbar-none shrink-0">
            {([
              { id: 'book' as const, label: 'Book', icon: Utensils },
              { id: 'reservations' as const, label: 'Reservations', icon: CalendarRange }
            ]).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-mono uppercase tracking-widest whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-orange-300 text-[#251b14] font-bold'
                    : 'bg-[#11100f] border border-[#3a2d27] text-neutral-400'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* KPI strip */}
          <div className="mx-4 mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
            {[
              { label: 'Salon', value: restaurant.name, icon: LayoutGrid },
              { label: 'Rating', value: restaurant.rating.toFixed(1), icon: Star },
              { label: 'Your bookings', value: String(myBookings.length), icon: CalendarRange },
              { label: 'Upcoming', value: String(upcomingCount), icon: Clock }
            ].map((kpi) => (
              <div key={kpi.label} className="p-3 bg-[#0f0d0c]/85 border border-[#302923]/70 rounded-xl">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#bfa08b]">{kpi.label}</span>
                  <kpi.icon className="w-3.5 h-3.5 text-orange-300/70" />
                </div>
                <div className="font-serif text-sm text-[#fffaf5] truncate">{kpi.value}</div>
              </div>
            ))}
          </div>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 mt-2">
            <AnimatePresence mode="wait">
              {activeTab === 'book' && (
                <motion.div
                  key="book-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid xl:grid-cols-12 gap-6 max-w-7xl"
                >
                  {/* Restaurant showcase */}
                  <div className="xl:col-span-5 xl:sticky xl:top-0 h-fit space-y-4">
                    <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden border border-[#2a241f] shadow-[0_20px_60px_-30px_rgba(0,0,0,0.9)]">
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-neutral-950/20" />

                      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                        {restaurant.michelinStar ? (
                          <div className="flex items-center gap-1 bg-orange-300/95 text-neutral-950 px-2.5 py-1 rounded text-[9px] font-mono font-bold uppercase">
                            <Star className="w-3 h-3 fill-current" />
                            {restaurant.michelinStar} Michelin
                          </div>
                        ) : <span />}
                        <div className="px-2 py-1 rounded bg-neutral-950/80 border border-neutral-800 text-[9px] font-mono text-orange-200 uppercase">
                          {restaurant.cuisine}
                        </div>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h2 className="font-serif text-2xl sm:text-3xl font-light text-white">{restaurant.name}</h2>
                        <div className="flex items-center gap-1.5 mt-2 text-[10px] font-mono text-neutral-300">
                          <MapPin className="w-3.5 h-3.5 text-orange-300 shrink-0" />
                          <span className="line-clamp-1">{restaurant.address}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 bg-[#0f0d0c]/85 border border-[#302923]/70 rounded-2xl space-y-3">
                      <span className="font-mono text-[9px] tracking-widest text-orange-300 uppercase">About this salon</span>
                      <p className="text-xs text-neutral-400 font-light leading-relaxed line-clamp-4">{restaurant.description}</p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {restaurant.amenities.slice(0, 4).map((amenity) => (
                          <span
                            key={amenity}
                            className="px-2 py-1 rounded-full bg-[#070707] border border-[#2a241f] text-[9px] font-mono text-neutral-400 uppercase tracking-wider"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Booking panel */}
                  <div className="xl:col-span-7">
                    <div className="p-6 sm:p-8 bg-[#0f0d0c]/85 border border-[#302923]/70 rounded-2xl shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
                      <div className="pb-5 mb-6 border-b border-[#362f2c]">
                        <span className="font-mono text-[9px] tracking-[0.34em] text-orange-300 uppercase">Reservation terminal</span>
                        <h3 className="font-serif text-2xl font-light text-[#fffaf5] mt-1">Secure your table</h3>
                        <p className="text-xs text-neutral-500 font-light mt-1">Select your preferred date, time, and party size below.</p>
                      </div>
                      <CustomerBookingPanel
                        restaurant={restaurant}
                        customerEmail={customerEmail}
                        onBook={onBookSuccess}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'reservations' && (
                <motion.div
                  key="reservations-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="max-w-7xl space-y-6"
                >
                  <div className="flex justify-between items-end border-b border-[#302923] pb-4">
                    <div>
                      <span className="font-mono text-[9px] tracking-widest text-orange-300 uppercase">Your ledger</span>
                      <h3 className="font-serif text-2xl font-light text-[#fffaf5] mt-1">Reservation history</h3>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-500 uppercase">{myBookings.length} entries</span>
                  </div>

                  {myBookings.length === 0 ? (
                    <div className="text-center py-20 space-y-4">
                      <CalendarRange className="w-12 h-12 text-neutral-700 mx-auto" />
                      <p className="text-sm text-neutral-500 font-light">No reservations yet.</p>
                      <button
                        onClick={() => setActiveTab('book')}
                        className="px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-300 text-neutral-950 font-mono text-[10px] uppercase tracking-widest rounded-lg font-bold"
                      >
                        Book your first table
                      </button>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      {myBookings.map((b) => {
                        const rest = b.restaurantId ? restaurantLookup.get(b.restaurantId) : undefined;
                        const restaurantName = rest?.name ?? 'Restaurant';

                        return (
                          <div
                            key={b.id}
                            className="group p-5 bg-[#0f0d0c]/85 rounded-xl border border-[#302923]/70 hover:border-orange-300/25 transition-all duration-300 space-y-4"
                          >
                            {rest?.image && (
                              <div className="h-28 rounded-lg overflow-hidden border border-[#2a241f]">
                                <img
                                  src={rest.image}
                                  alt={restaurantName}
                                  className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            )}

                            <div className="flex justify-between items-start gap-2">
                              <div className="min-w-0">
                                <div className="font-serif text-lg font-light text-neutral-100 truncate">{restaurantName}</div>
                                <div className="text-[10px] font-mono text-neutral-500 mt-0.5">{b.guestName}</div>
                              </div>
                              <span
                                className={`shrink-0 px-2.5 py-1 text-[8px] font-mono font-bold uppercase rounded border tracking-wider ${
                                  b.status === 'confirmed'
                                    ? 'border-orange-300/30 text-orange-200 bg-orange-400/10'
                                    : b.status === 'seated'
                                      ? 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10'
                                      : b.status === 'arriving'
                                        ? 'border-rose-500/30 text-rose-300 bg-rose-500/10'
                                        : 'border-neutral-700 text-neutral-400 bg-neutral-900'
                                }`}
                              >
                                {b.status}
                              </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-center font-mono text-[10px]">
                              <div className="p-2 bg-[#070707] rounded-lg border border-[#2a241f]">
                                <Clock className="w-3 h-3 text-orange-300 mx-auto mb-1" />
                                <div className="text-neutral-500 text-[8px] uppercase">Time</div>
                                <div className="text-neutral-200 font-bold mt-0.5">{b.time}</div>
                              </div>
                              <div className="p-2 bg-[#070707] rounded-lg border border-[#2a241f]">
                                <Users className="w-3 h-3 text-orange-300 mx-auto mb-1" />
                                <div className="text-neutral-500 text-[8px] uppercase">Guests</div>
                                <div className="text-neutral-200 font-bold mt-0.5">{b.covers}</div>
                              </div>
                              <div className="p-2 bg-[#070707] rounded-lg border border-[#2a241f]">
                                <LayoutGrid className="w-3 h-3 text-orange-300 mx-auto mb-1" />
                                <div className="text-neutral-500 text-[8px] uppercase">Table</div>
                                <div className="text-orange-200 font-bold mt-0.5">{b.tableNo}</div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
