import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Star, Heart, Share2, Compass, ShieldCheck, MapPin, Wine, Calendar, CheckCircle2, ChevronRight, MessageSquare, Award, Clock, Sparkles, BookOpen, ThumbsUp, Search, SlidersHorizontal, AlertTriangle
} from 'lucide-react';
import { Restaurant, MenuItem, Review, Booking } from '../types';
import { DEGUSTATION_MENU, THE_MONOLITH_REVIEWS, CALENDAR_DATES, INITIAL_DATE_INDEX } from '../data';
import { displayNameFromEmail } from './CustomerBookingPanel';
import { useToast } from '../contexts/ToastContext';

interface DetailProps {
  restaurant: Restaurant;
  onBack: () => void;
  onBookSuccess: (
    bookingName: string,
    party: number,
    hour: string,
    calendarDate: string,
    customerEmail?: string,
    guestNotes?: string
  ) => void;
  customerEmail?: string;
  backLabel?: string;
}

export default function RestaurantDetailView({ restaurant, onBack, onBookSuccess, customerEmail, backLabel }: DetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'menu' | 'reviews'>('overview');

  // Booking reservation form state
  const { toast } = useToast();
  const [selectedDateIdx, setSelectedDateIdx] = useState(INITIAL_DATE_INDEX);
  const [dateError, setDateError] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState(restaurant.popularTimeSlots[1] || '19:30');
  const [partySize, setPartySize] = useState(2);
  const [guestName, setGuestName] = useState(customerEmail ? displayNameFromEmail(customerEmail) : '');
  const [guestNotes, setGuestNotes] = useState('');
  const [isFavorited, setIsFavorited] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Review section filter states
  const [reviewSearch, setReviewSearch] = useState('');
  const [helpfulReviews, setHelpfulReviews] = useState<string[]>([]);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  const handleDateClick = (idx: number) => {
    setSelectedDateIdx(idx);
    if (CALENDAR_DATES[idx].isPast) {
      setDateError("Error: Choosing a date in the past is not allowed.");
      toast("Error: Choosing a date in the past is not allowed.", "error");
    } else {
      setDateError(null);
    }
  };

  useEffect(() => {
    if (customerEmail) {
      setGuestName(displayNameFromEmail(customerEmail));
    }
  }, [customerEmail]);

  // Handle share click indicator
  const handleShare = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleHelpfulClick = (reviewId: string) => {
    setHelpfulReviews(prev =>
      prev.includes(reviewId) ? prev.filter(rId => rId !== reviewId) : [...prev, reviewId]
    );
  };

  const submitReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (CALENDAR_DATES[selectedDateIdx].isPast) {
      setDateError("Error: Choosing a date in the past is not allowed.");
      toast("Error: Choosing a date in the past is not allowed.", "error");
      throw new Error("Cannot book a date in the past");
    }
    const resolvedGuestName = customerEmail ? displayNameFromEmail(customerEmail) : guestName;
    if (!resolvedGuestName) return;

    // Trigger full state alignment on App.tsx Level
    onBookSuccess(resolvedGuestName, partySize, selectedTime, CALENDAR_DATES[selectedDateIdx].full, customerEmail, guestNotes.trim() || undefined);
    setCheckoutModalOpen(false);

    // Reset guest form
    if (!customerEmail) setGuestName('');
    setGuestNotes('');
  };

  const filteredReviews = THE_MONOLITH_REVIEWS.filter(rev =>
    rev.guestName.toLowerCase().includes(reviewSearch.toLowerCase()) ||
    rev.text.toLowerCase().includes(reviewSearch.toLowerCase())
  );

  return (
    <div id="detail-root" className="min-h-screen bg-neutral-950 text-neutral-100 font-sans relative">

      {/* Immersive Parallax Cover Photo overlapping header */}
      <div className="relative h-[45vh] bg-neutral-900 overflow-hidden select-none">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover grayscale opacity-45"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-neutral-950 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-neutral-950/80 to-transparent" />

        {/* Floating return actions button */}
        <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10 max-w-7xl mx-auto w-full">
          <button
            onClick={onBack}
            className="group px-4 py-2.5 bg-neutral-950/80 backdrop-blur rounded-full border border-neutral-850 hover:border-orange-300/30 text-xs font-mono tracking-widest uppercase text-neutral-300 flex items-center space-x-2 transition-all duration-300 pointer-events-auto"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>{backLabel ?? 'Discover Grid'}</span>
          </button>

          <div className="flex space-x-3">
            <button
              onClick={() => setIsFavorited(prev => !prev)}
              className="p-3 bg-neutral-950/90 backdrop-blur rounded-full border border-neutral-850 hover:border-rose-500/50 transition-colors pointer-events-auto"
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'text-rose-500 fill-current' : 'text-neutral-400'}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-3 bg-neutral-950/90 backdrop-blur rounded-full border border-neutral-850 hover:border-orange-300/50 transition-colors pointer-events-auto"
            >
              <Share2 className="w-4 h-4 text-neutral-450" />
            </button>
          </div>
        </div>

        {/* Title overlay block */}
        <div className="absolute bottom-10 left-6 right-6 max-w-7xl mx-auto w-full flex flex-col justify-end space-y-3">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-[10px] tracking-[0.3em] text-orange-300 uppercase">{restaurant.cuisine}</span>
            {restaurant.michelinStar && (
              <span className="bg-orange-300 text-neutral-950 px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-widest">
                {restaurant.michelinStar} Stars
              </span>
            )}
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-light tracking-tight text-neutral-105">{restaurant.name}</h1>
          <p className="text-xs text-neutral-400 font-mono tracking-wider uppercase flex items-center gap-1.5 pt-1.5">
            <MapPin className="w-3.5 h-3.5 text-orange-300" />
            <span>{restaurant.address}</span>
          </p>
        </div>
      </div>

      {/* Main Grid: Details Layout + Booking Sidebar */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-12 gap-8 relative">

        {/* LEFT COLUMN: INFORMATION PORTALS */}
        <div className="lg:col-span-8 space-y-12">

          {/* Action indicator for copied share link */}
          <AnimatePresence>
            {copiedLink && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-3 border border-orange-300/20 bg-orange-300/5 rounded text-xs text-orange-300 font-mono"
              >
                Share connection locked: Salon portfolio coordinates copied directly to clipboard.
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tab Navigation selectors */}
          <div className="flex overflow-x-auto scrollbar-none border-b border-neutral-900 text-xs font-mono tracking-widest uppercase">
            {[
              { id: 'overview', label: 'Culinary Overview', icon: <Compass className="w-3.5 h-3.5" /> },
              { id: 'menu', label: 'Degustation Menu', icon: <BookOpen className="w-3.5 h-3.5" /> },
              { id: 'reviews', label: 'Reviews', icon: <MessageSquare className="w-3.5 h-3.5" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-6 flex items-center space-x-2 border-b-2 transition-all duration-300 ${activeTab === tab.id ? 'border-orange-300 text-orange-300 font-bold' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">

            {/* OVERVIEW CONTENT */}
            {activeTab === 'overview' && (
              <motion.div
                key="details-overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-10"
              >
                <div className="space-y-4">
                  <h3 className="font-serif text-2xl font-light text-neutral-100">Establishment Manifesto</h3>
                  <p className="text-sm text-neutral-350 leading-relaxed font-light">{restaurant.description}</p>
                </div>

                <div className="w-full h-px bg-neutral-900" />

                {/* Philosophies bullet blocks */}
                <div className="space-y-4">
                  <h4 className="font-mono text-[10px] tracking-[0.34em] text-neutral-500 uppercase">Operational Cues</h4>
                  <div className="grid gap-6">
                    {restaurant.philosophies.map((p, i) => (
                      <div key={i} className="flex gap-4 p-5 bg-neutral-900/30 border border-neutral-900 rounded-lg">
                        <span className="font-serif text-lg text-orange-300/80">0{i + 1}</span>
                        <p className="text-xs text-neutral-400 font-light leading-relaxed">"{p}"</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-full h-px bg-neutral-900" />

                {/* Amenities grid */}
                <div className="space-y-4">
                  <h4 className="font-mono text-[10px] tracking-[0.34em] text-neutral-500 uppercase font-bold">Standard Salon Amenities</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {restaurant.amenities.map((amenity, i) => (
                      <div key={i} className="p-4 bg-neutral-950 border border-neutral-900 rounded hover:border-orange-300/20 transition-colors flex items-center space-x-3 group">
                        <ShieldCheck className="w-4 h-4 text-orange-300/70 group-hover:text-orange-300 transition-colors" />
                        <span className="text-xs text-neutral-300 font-light">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-full h-px bg-neutral-900" />

                {/* Abstract Local map pin section */}
                <div className="space-y-4">
                  <h4 className="font-mono text-[10px] tracking-[0.34em] text-neutral-500 uppercase">Coordinate Position</h4>
                  <div className="h-60 bg-neutral-900 rounded-lg border border-neutral-850 relative flex items-center justify-center overflow-hidden">
                    <svg className="absolute inset-0 w-full h-full stroke-neutral-800 opacity-20 fill-none">
                      <circle cx="50%" cy="50%" r="50" strokeWidth="1" strokeDasharray="5" />
                      <line x1="0" y1="50%" x2="100%" y2="50%" />
                      <line x1="50%" y1="0" x2="50%" y2="100%" />
                    </svg>
                    <div className="text-center z-10 flex flex-col items-center space-y-2">
                      <MapPin className="w-8 h-8 text-orange-300 animate-bounce" />
                      <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-200">{restaurant.address}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* DEGUSTATION MENU CONTENT */}
            {activeTab === 'menu' && (
              <motion.div
                key="details-menu"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="text-center max-w-xl mx-auto space-y-3 pb-8">
                  <span className="font-mono text-[9px] tracking-[0.4em] text-orange-300 uppercase">Degustation</span>
                  <h3 className="font-serif text-3xl font-light text-neutral-100">The Senses Pacing Map</h3>
                  <p className="text-xs text-neutral-400 font-light max-w-sm mx-auto leading-relaxed">
                    A multi-course alignment of texture, wind, stone, and absolute molecular fire. Pre-poured cellar reserves matched.
                  </p>
                </div>

                <div className="space-y-12">
                  {DEGUSTATION_MENU.map((item, i) => (
                    <div key={i} className="space-y-3 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-baseline gap-2">
                        <h4 className="font-serif text-lg tracking-wide text-orange-300 font-light">{item.name}</h4>
                        <div className="hidden sm:block flex-1 border-b border-dotted border-neutral-900 mx-4" />
                        <span className="font-mono text-sm text-neutral-100 font-bold">${item.price}</span>
                      </div>
                      <p className="text-xs text-neutral-400 font-light leading-relaxed max-w-2xl">{item.description}</p>
                      {item.pairing && (
                        <div className="inline-flex items-center space-x-2 text-[10px] font-mono tracking-wider text-orange-200/80 bg-neutral-900 px-3 py-1 rounded-full uppercase border border-neutral-850">
                          <Wine className="w-3 h-3 text-orange-300" />
                          <span>Matching Reserve: {item.pairing}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="pt-12 text-center text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                  <p>All items undergo strict molecular temperature control.</p>
                  <p className="text-neutral-600 mt-1">Certified allergen indicators displayed instantly upon check-in.</p>
                </div>
              </motion.div>
            )}

            {/* REVIEWS SECTION */}
            {activeTab === 'reviews' && (
              <motion.div
                key="details-reviews"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >

                {/* Upper score review overview block */}
                <div className="grid md:grid-cols-2 gap-8 items-center bg-neutral-900/30 p-6 border border-neutral-900 rounded-lg">
                  <div className="space-y-4">
                    <span className="font-mono text-[9px] tracking-widest text-orange-300 uppercase">Inspector rating index</span>
                    <div className="flex items-baseline space-x-3">
                      <span className="font-serif text-5xl font-light text-neutral-500">5.0</span>
                      <div className="space-y-1">
                        <div className="flex text-orange-300">
                          {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                        </div>
                        <div className="text-[10px] font-mono uppercase text-neutral-500 tracking-wider">Based on {restaurant.reviewsCount} verified audits</div>
                      </div>
                    </div>
                  </div>

                  {/* Inspector notebook quote card */}
                  <div className="p-4 bg-neutral-950 border border-neutral-850 rounded font-mono text-[11px] leading-relaxed text-neutral-400 relative">
                    <div className="absolute -top-3 left-4 bg-orange-300 text-neutral-950 font-bold px-2 py-0.5 rounded text-[8px] uppercase tracking-wider">
                      MICHELIN INSPECTOR CELL
                    </div>
                    <p className="font-serif font-light italic text-neutral-300">
                      "A profound, tectonic victory for modernist cooking of tectonic alignments."
                    </p>
                  </div>
                </div>

                {/* Filter and search reviews */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pb-4 border-b border-neutral-900">
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      value={reviewSearch}
                      onChange={(e) => setReviewSearch(e.target.value)}
                      placeholder="Search feedback registry..."
                      className="w-full bg-neutral-900 border border-neutral-850 text-xs px-3.5 pl-8 py-2 text-neutral-200 font-mono focus:outline-none rounded placeholder-neutral-600"
                    />
                    <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-neutral-600" />
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">{filteredReviews.length} Records</span>
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                  {filteredReviews.map((rev) => {
                    const isHelpful = helpfulReviews.includes(rev.id);
                    return (
                      <div key={rev.id} className="p-5 bg-neutral-900/40 border border-neutral-900/60 rounded-lg space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-serif text-sm font-medium text-neutral-200">{rev.guestName}</span>
                              {rev.hasVerifiedBooking && (
                                <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 bg-neutral-950 border border-orange-300/20 text-neutral-500 uppercase font-mono text-[7px] font-bold rounded">
                                  <span>Verified Guest</span>
                                </span>
                              )}
                            </div>
                            <span className="text-[9px] font-mono text-neutral-600 uppercase block mt-0.5">{rev.date}</span>
                          </div>

                          <div className="flex text-orange-300 scale-90">
                            {Array.from({ length: Math.floor(rev.rating) }).map((_, idx) => (
                              <Star key={idx} className="w-3 h-3 fill-current" />
                            ))}
                          </div>
                        </div>

                        <p className="text-xs text-neutral-350 leading-relaxed font-light font-sans">{rev.text}</p>

                        {/* Interactive Grayscale Review Gallery photo on hover */}
                        {rev.images && rev.images.length > 0 && (
                          <div className="flex gap-2.5 pt-1">
                            {rev.images.map((img, index) => (
                              <div key={index} className="w-20 h-20 rounded border border-neutral-850 overflow-hidden relative group cursor-pointer bg-neutral-950">
                                <img
                                  src={img}
                                  alt="Delicious detail"
                                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 duration-500 transition-all"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex justify-between items-center font-mono text-[9px] uppercase tracking-wider text-neutral-500 pt-3 border-t border-neutral-900/50">
                          <button
                            onClick={() => handleHelpfulClick(rev.id)}
                            className={`flex items-center space-x-1.5 hover:text-orange-300 transition-colors ${isHelpful ? 'text-orange-300 font-bold' : ''}`}
                          >
                            <ThumbsUp className="w-3 h-3" />
                            <span>Helpful ({rev.usefulCount + (isHelpful ? 1 : 0)})</span>
                          </button>
                          <span>Grid node aud</span>
                        </div>
                      </div>
                    );
                  })}

                  {filteredReviews.length === 0 && (
                    <div className="text-center py-12 text-neutral-600 font-mono text-xs">
                      No matching verified visitor records located.
                    </div>
                  )}
                </div>

              </motion.div>
            )}

          </AnimatePresence>

        </div>

        {/* RIGHT COLUMN: STICKY BOOKING SYSTEM PANEL */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit shrink-0 gap-6">
          <div className="bg-neutral-900 border border-neutral-850 rounded-lg p-6 space-y-6">
            <div className="pb-4 border-b border-neutral-850">
              <span className="font-mono text-[9px] tracking-[0.34em] text-orange-300 uppercase block font-bold">RESERVATION HUB</span>
              <h3 className="font-serif text-lg font-light text-neutral-100 mt-1">Book a Table</h3>
            </div>

            {/* Calendar date grid chooser */}
            <div className="space-y-2">
              <label className="block text-[8px] font-mono tracking-widest text-neutral-500 uppercase font-bold">1. Select Reservation Date</label>
              <div className="flex overflow-x-auto gap-2.5 pb-2.5 scrollbar-none snap-x">
                {CALENDAR_DATES.map((cal, i) => (
                  <button
                    key={i}
                    onClick={() => handleDateClick(i)}
                    className={`p-2 w-12 h-14 rounded flex flex-col items-center justify-between font-mono border text-center transition-all shrink-0 snap-start select-none ${selectedDateIdx === i ? 'bg-orange-300 border-orange-300 text-neutral-950 font-bold shadow-lg' : 'bg-neutral-950 border-neutral-900 text-neutral-400 hover:text-white hover:border-neutral-800'}`}
                  >
                    <span className={`text-[8px] uppercase tracking-wider ${selectedDateIdx === i ? 'text-neutral-900' : 'text-neutral-500'}`}>{cal.day}</span>
                    <span className="text-xs font-bold font-serif">{cal.date}</span>
                  </button>
                ))}
              </div>
              {dateError && (
                <div className="flex items-center gap-2 p-3 rounded-lg border border-red-500/25 bg-red-500/10 text-red-400 text-[10px] font-mono">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{dateError}</span>
                </div>
              )}
            </div>

            {/* Time slot selectors */}
            <div className="space-y-2">
              <label className="block text-[8px] font-mono tracking-widest text-neutral-500 uppercase font-bold">2. Select Session Hour</label>
              <div className="grid grid-cols-4 gap-2 font-mono text-[10px] uppercase text-center">
                {restaurant.popularTimeSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedTime(slot)}
                    className={`py-2 px-1.5 rounded transition-colors block border ${selectedTime === slot ? 'bg-orange-300 border-orange-300 text-neutral-950 font-bold shadow' : 'bg-neutral-950 border-neutral-900 text-neutral-400 hover:text-white'}`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Party Guest stepper */}
            <div className="space-y-2">
              <label className="block text-[8px] font-mono tracking-widest text-neutral-500 uppercase font-bold">3. Party Size (Steppers)</label>
              <div className="flex justify-between items-center bg-neutral-950 border border-neutral-850 p-2.5 rounded font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setPartySize(prev => Math.max(1, prev - 1))}
                  className="w-8 h-8 rounded hover:bg-neutral-900 text-neutral-400 font-bold text-center border border-neutral-800"
                >
                  -
                </button>
                <span className="font-bold text-neutral-200">{partySize} Guest{partySize > 1 ? 's' : ''}</span>
                <button
                  type="button"
                  onClick={() => setPartySize(prev => Math.min(10, prev + 1))}
                  className="w-8 h-8 rounded hover:bg-neutral-900 text-neutral-400 font-bold text-center border border-neutral-800"
                >
                  +
                </button>
              </div>
            </div>

            <div className="w-full h-px bg-neutral-850" />

            <button
              onClick={() => setCheckoutModalOpen(true)}
              className="w-full py-4 bg-gradient-to-r from-orange-400 to-orange-300 hover:from-orange-300 hover:to-orange-200 text-neutral-955 font-mono tracking-widest text-xs uppercase rounded duration-300 font-bold hover:shadow-[0_0_20px_rgba(249,185,93,0.2)] flex justify-center items-center space-x-2"
            >
              <span>Verify Reservation Availability</span>
              <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          </div>
        </div>

      </div>

      {/* CHECKOUT MODAL RECEIPT CONFIRMATION SHEET */}
      <AnimatePresence>
        {checkoutModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCheckoutModalOpen(false)}
              className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-neutral-900 border border-neutral-850 rounded-lg max-w-md w-full overflow-hidden relative z-10 p-6 md:p-8 space-y-6 shadow-2xl"
            >
              <div className="space-y-1">
                <span className="font-mono text-[10px] tracking-widest text-orange-300 uppercase block">Phase 4: Check-Out Secure</span>
                <h3 className="font-serif text-2xl font-light text-neutral-100">Establish Priority Ticket</h3>
              </div>

              {/* Dynamic printable summary receipt */}
              <div className="p-4 bg-neutral-950 border border-neutral-850 rounded font-mono text-[11px] uppercase tracking-wider space-y-3.5">
                <div className="flex justify-between border-b border-neutral-900 pb-2">
                  <span className="text-neutral-500">Establishment Node</span>
                  <span className="text-neutral-100 font-bold text-right truncate max-w-[180px]">{restaurant.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Session Date</span>
                  <span className="text-neutral-300 font-bold">{CALENDAR_DATES[selectedDateIdx].full}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Session Hour</span>
                  <span className="text-orange-300 font-bold">{selectedTime} PM</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-neutral-500">Covers Capacity</span>
                  <span className="text-neutral-300 font-bold">{partySize} Pax</span>
                </div>

                <div className="border-t border-neutral-900 pt-3 flex justify-between">
                  <span className="text-neutral-500">Secured Fee</span>
                  <span className="text-emerald-500 font-bold">No Charge ($0.0)</span>
                </div>
              </div>

              {/* Secure client checkout inputs form */}
              <form onSubmit={submitReservation} className="space-y-4 font-sans text-xs font-light">
                {customerEmail ? (
                  <div className="p-3 bg-neutral-950 border border-neutral-800 rounded flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[9px] font-mono tracking-widest text-neutral-500 uppercase font-bold">Reserved for</div>
                      <div className="text-sm font-serif text-neutral-100 mt-1">{displayNameFromEmail(customerEmail)}</div>
                    </div>
                    <div className="text-[10px] font-mono text-neutral-500 truncate max-w-[140px]">{customerEmail}</div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-mono tracking-widest text-neutral-500 uppercase font-bold">Your Account Full Name</label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="e.g. Sandra Bullock"
                      className="w-full bg-neutral-950 border border-neutral-800 pl-3.5 pr-3 py-3 text-neutral-105 rounded focus:outline-none placeholder-neutral-700 font-mono tracking-wide"
                      required
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-[9px] font-mono tracking-widest text-neutral-500 uppercase font-bold">Palette Allergy Preferences (Optional)</label>
                  <input
                    type="text"
                    value={guestNotes}
                    onChange={(e) => setGuestNotes(e.target.value)}
                    placeholder="e.g. Vegetarian, shellfish allergy..."
                    className="w-full bg-neutral-950 border border-neutral-800 pl-3.5 pr-3 py-3 text-neutral-100 rounded focus:outline-none placeholder-neutral-700 font-sans"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-orange-400 to-orange-300 text-neutral-950 font-mono tracking-widest text-xs uppercase duration-300 rounded font-bold hover:shadow-[0_0_15px_rgba(249,185,93,0.2)]"
                >
                  Authorize Reservation Entry
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

