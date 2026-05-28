import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Calendar, Users, Heart, Star, Compass, ArrowRight, Table, AlertCircle, HeartCrack, CheckCircle2 } from 'lucide-react';
import { Restaurant } from '../types';

interface DiscoverProps {
  restaurants: Restaurant[];
  onSelectRestaurant: (id: string) => void;
  onBack: () => void;
}

const CATEGORIES = ['All', 'Modernist Contemporary', 'Mediterranean Gastronomy', 'Neo-Tokyo Omakase & Mixology', 'Avant-Garde French Haute', 'Heritage Steakhouse & Cellar'];

export default function DiscoverView({ restaurants, onSelectRestaurant, onBack }: DiscoverProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [partySize, setPartySize] = useState(2);
  const [favorites, setFavorites] = useState<string[]>(['the-monolith']);
  const [bookedStatus, setBookedStatus] = useState<string | null>(null);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  const handleInstantBook = (restaurantName: string, slot: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookedStatus(`Direct VIP booking locked: ${restaurantName} at ${slot} for ${partySize} guests. A secure SMS ticket has been issued.`);
    setTimeout(() => {
      setBookedStatus(null);
    }, 5000);
  };

  // Filter query + categories
  const filteredRestaurants = restaurants.filter(r => {
    const matchesCategory = selectedCategory === 'All' || r.cuisine === selectedCategory;
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) || r.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="discover-root" className="min-h-screen bg-neutral-950 text-neutral-100 font-sans relative selection:bg-orange-300/20">

      {/* Background ambient gold splash */}
      <div className="absolute top-0 right-1/4 w-[700px] h-[500px] bg-orange-300/3 rounded-full blur-[140px] pointer-events-none" />

      {/* Embedded Top bar header */}
      <div className="px-4 pt-4">
        <nav
          id="discover-nav"
          className="fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2 flex items-center justify-between rounded-[30px] border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl shadow-[0_20px_70px_-30px_rgba(0,0,0,0.95)] md:px-6"
        >
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-xs font-mono tracking-widest text-neutral-300 hover:text-orange-300 transition-colors"
          >
            <Compass className="w-4 h-4" />
            <span className="uppercase">Return to Editorial</span>
          </button>
          <div className="flex items-center space-x-3">
            <span className="font-mono text-[9px] tracking-[0.4em] text-neutral-600 uppercase">EXPLORE MODE</span>
            <span className="font-serif text-lg tracking-[0.2em] font-light text-orange-300">T A B L E A U</span>
          </div>
          <div className="text-right text-[10px] font-mono text-neutral-500 hidden sm:block">
            <span>PORTAL VERIFIED</span>
          </div>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-28 pb-12 space-y-12">

        {/* UPPER HERO SEARCH DECK */}
        <div className="space-y-6 text-center max-w-3xl mx-auto">
          <span className="font-mono text-[10px] tracking-[0.3em] text-orange-300 uppercase">Synchronized Reservation Portals</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light tracking-tight text-neutral-100 leading-tight">Discover Exceptional Dining</h1>
          <p className="text-neutral-400 text-xs sm:text-sm font-light max-w-xl mx-auto">
            Review real-time slots, configure preference telemetry models, and secure priority bookings at world-awarded multi-star sanctuaries.
          </p>

          {/* Floating Search Controls Container */}
          <div className="p-4 bg-neutral-900 border border-neutral-850 rounded-lg shadow-xl grid md:grid-cols-12 gap-3 text-left">
            <div className="md:col-span-5 relative">
              <span className="block text-[8px] font-mono tracking-wider text-neutral-500 uppercase mb-1">Cuisine / Restaurant Name</span>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g. The Monolith, French, Tasting..."
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-orange-300/20 text-xs py-2.5 pl-8 pr-3 text-neutral-200 outline-none rounded"
                />
                <Search className="absolute left-2.5 top-3 w-3.5 h-3.5 text-neutral-600" />
              </div>
            </div>

            <div className="md:col-span-3">
              <span className="block text-[8px] font-mono tracking-wider text-neutral-500 uppercase mb-1">Table Date</span>
              <div className="relative">
                <button className="w-full bg-neutral-950 border border-neutral-800 text-xs py-2.5 px-3 text-left text-neutral-300 rounded flex justify-between items-center font-mono">
                  <span>Tonight, May 28</span>
                  <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                </button>
              </div>
            </div>

            <div className="md:col-span-4 flex items-end gap-2">
              <div className="flex-1">
                <span className="block text-[8px] font-mono tracking-wider text-neutral-500 uppercase mb-1">Guests Size</span>
                <div className="relative">
                  <select
                    value={partySize}
                    onChange={(e) => setPartySize(Number(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 text-xs py-2.5 px-3.5 rounded text-neutral-300 font-mono outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 8].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button className="bg-gradient-to-r from-orange-400 to-orange-300 hover:from-orange-300 hover:to-orange-200 text-neutral-950 font-mono text-xs uppercase px-5 py-3 rounded hover:shadow-[0_0_15px_rgba(249,185,93,0.2)] font-bold transition-all">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* ALERTS POPUP FEED FOR BOOKINGS */}
        <AnimatePresence>
          {bookedStatus && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded text-xs font-mono text-emerald-400 flex items-center space-x-3"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{bookedStatus}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TAB CAROUSEL FILTERS */}
        <section id="discover-categories" className="space-y-6">
          <div className="flex overflow-x-auto gap-2.5 pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`py-2 px-4 rounded-full font-mono text-[10px] tracking-widest uppercase transition-all whitespace-nowrap border shrink-0 ${selectedCategory === cat ? 'bg-orange-300 text-neutral-950 border-orange-300 font-bold' : 'bg-neutral-950 text-neutral-400 border-neutral-900 hover:text-white hover:border-neutral-800'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* MAIN RESTAURANTS GRID */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 pt-4">
            {filteredRestaurants.map((restaurant) => {
              const isFav = favorites.includes(restaurant.id);
              return (
                <div
                  key={restaurant.id}
                  onClick={() => onSelectRestaurant(restaurant.id)}
                  className="group bg-neutral-900/30 border border-neutral-900 hover:border-orange-300/20 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative h-56 overflow-hidden bg-neutral-950">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 transition-all duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />

                    {/* Top actions badges */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                      {restaurant.michelinStar ? (
                        <div className="bg-orange-300/95 text-neutral-950 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider">
                          {restaurant.michelinStar} Michelin Star{restaurant.michelinStar > 1 ? 's' : ''}
                        </div>
                      ) : <div />}

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => toggleFavorite(restaurant.id, e)}
                        className="p-1.5 bg-neutral-950/80 backdrop-blur rounded-full border border-neutral-800 hover:border-rose-500/50 transition-colors pointer-events-auto"
                      >
                        <Heart className={`w-3.5 h-3.5 transition-colors ${isFav ? 'text-rose-500 fill-current' : 'text-neutral-400 hover:text-rose-400'}`} />
                      </button>
                    </div>

                    {/* Bottom overlay titles */}
                    <div className="absolute bottom-4 left-4 right-4 capitalize">
                      <span className="font-mono text-[8px] tracking-widest text-orange-300 uppercase">{restaurant.cuisine}</span>
                      <h3 className="font-serif text-lg tracking-wide font-light text-neutral-100 mt-0.5">{restaurant.name}</h3>
                    </div>
                  </div>

                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-neutral-400 font-light leading-relaxed line-clamp-2">{restaurant.description}</p>

                    <div className="flex justify-between items-center font-mono text-[9px] text-neutral-500 uppercase tracking-widest pt-2.5 border-t border-neutral-900 mt-auto">
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-orange-300 fill-current" />
                        <span className="font-bold text-neutral-200">{restaurant.rating.toFixed(1)}</span>
                        <span>({restaurant.reviewsCount} reviews)</span>
                      </span>
                      <span className="text-neutral-600">|</span>
                      <span className="truncate max-w-[130px]">{restaurant.address.split(',')[0]}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <span className="text-[9px] font-mono text-neutral-500 uppercase flex items-center justify-center p-2 rounded border border-neutral-900 bg-neutral-950/50">Next: 19:30</span>
                      <button className="py-2 bg-neutral-900 hover:bg-neutral-850 border border-neutral-850 hover:border-orange-300/30 font-mono text-[9px] uppercase tracking-widest text-orange-300/90 rounded font-bold flex items-center justify-center gap-1 group">
                        <span>Terminal</span>
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredRestaurants.length === 0 && (
              <div className="text-center py-24 col-span-3 text-neutral-500 space-y-3 font-mono">
                <HeartCrack className="w-12 h-12 mx-auto text-neutral-700 animate-pulse" />
                <h3 className="text-sm font-bold">No partner salons matching query coordinates.</h3>
                <p className="text-[10px] text-neutral-600 max-w-sm mx-auto">Try clearing search parameters or checking the "All Salons" categories pill.</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}

