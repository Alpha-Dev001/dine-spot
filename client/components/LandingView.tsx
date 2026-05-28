import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Star, Compass, Shield, Zap, Sparkles, ChefHat, UserCheck, Utensils, Award } from 'lucide-react';
import { Restaurant } from '../types';

interface LandingViewProps {
  restaurants: Restaurant[];
  onNavigate: (view: any, restaurantId?: string) => void;
}

export default function LandingView({ restaurants, onNavigate }: LandingViewProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'michelin' | 'cuisine'>('all');

  const filteredRestaurants = restaurants.filter(r => {
    if (activeFilter === 'michelin') return (r.michelinStar || 0) >= 2;
    return true;
  });

  return (
    <div id="landing-root" className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-orange-300/30 selection:text-orange-200">
      {/* Editorial Top Navigation */}
      <div className="px-4 pt-4">
        <nav
          id="landing-nav"
          className="fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-6xl -translate-x-1/2 flex items-center justify-between rounded-[30px] border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl shadow-[0_20px_70px_-30px_rgba(0,0,0,0.95)] md:px-6"
        >
          <a href="#landing-hero" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
            <div className="flex items-center justify-center w-8 h-8 rounded-md border border-orange-300/30 bg-orange-300/10 shadow-[0_0_20px_rgba(249,185,93,0.18)]">
              <span className="font-serif text-sm font-semibold tracking-[0.18em] text-orange-200">T</span>
            </div>
            <span className="font-serif text-xl tracking-[0.2em] font-light text-orange-300">T A B L E A U</span>
          </a>
          <div className="hidden md:flex items-center space-x-8 text-xs font-mono tracking-widest text-neutral-400">
            <a href="#stats" className="hover:text-orange-300 transition-colors uppercase">Telemetry</a>
            <a href="#features" className="hover:text-orange-300 transition-colors uppercase">Logistics</a>
            <a href="#portfolio" className="hover:text-orange-300 transition-colors uppercase">Salons</a>
            <a href="#pricing" className="hover:text-orange-300 transition-colors uppercase">Investment</a>
          </div>
          <div className="flex items-center space-x-4">
            <button
              id="book-table-btn"
              onClick={() => onNavigate('discover')}
              className="hidden sm:inline-flex items-center space-x-2 text-xs font-mono tracking-widest text-neutral-300 hover:text-orange-300 transition-colors uppercase"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Discover Salons</span>
            </button>
            <button
              id="signin-btn"
              onClick={() => onNavigate('signin')}
              className="px-5 py-2 bg-gradient-to-r from-orange-400 to-orange-300 hover:from-orange-300 hover:to-orange-200 text-neutral-950 text-xs font-mono tracking-widest uppercase rounded shadow-[0_0_15px_rgba(249,185,93,0.15)] hover:shadow-[0_0_25px_rgba(249,185,93,0.30)] transition-all duration-300 transform active:scale-95"
            >
              Owner Portal
            </button>
          </div>
        </nav>
      </div>

      {/* Hero / Cinematic Intro */}
      <section id="landing-hero" className="relative min-h-screen pt-24 flex flex-col justify-center items-center px-6 overflow-hidden border-b border-neutral-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,185,93,0.06)_0%,transparent_65%)] pointer-events-none" />
        
        {/* Fine grid dynamic background */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1 }}
          className="absolute inset-0 z-0"
          aria-hidden="true"
        >
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1400"
            alt="Luxury restaurant dining room"
            className="absolute inset-0 h-full w-full object-cover brightness-70 contrast-105 saturate-80"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(2,2,2,0.88),rgba(2,2,2,0.55)_35%,rgba(2,2,2,0.90))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,185,93,0.22),transparent_33%)]" />
        </motion.div>

        <div className="max-w-4xl text-center z-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center space-x-2 px-3 py-1 bg-orange-300/10 border border-orange-300/20 rounded-full text-orange-300 text-[10px] font-mono tracking-[0.2em] uppercase"
          >
            <Sparkles className="w-3 h-3 text-orange-300" />
            <span>Editorial Reservation & Guest Intelligence</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight leading-[1.1] text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.55)]"
          >
            Precision in Hospitality is <span className="font-italic text-orange-300">Pure Art</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-neutral-200/85 text-sm sm:text-lg font-light tracking-wide max-w-2xl mx-auto leading-relaxed drop-shadow-[0_1px_8px_rgba(0,0,0,0.55)]"
          >
            An advanced digital operating grid tailored exclusively for legendary dining rooms, certified multi-star establishments, and progressive gastronomical creators.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6"
          >
            <button
              onClick={() => onNavigate('discover')}
              className="w-full sm:w-auto px-8 py-4 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-orange-300/30 text-orange-300 font-mono tracking-widest text-xs uppercase duration-300 rounded flex items-center justify-center space-x-3 group"
            >
              <span>Explore Premium Salons</span>
              <Compass className="w-4 h-4 text-orange-300 group-hover:rotate-45 transition-transform" />
            </button>
            <button
              onClick={() => onNavigate('signin')}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-orange-400 to-orange-300 text-neutral-950 font-mono tracking-widest text-xs uppercase duration-300 rounded hover:shadow-[0_0_20px_rgba(249,185,93,0.2)] flex items-center justify-center space-x-3 group"
            >
              <span>Owner Onboarding Setup</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

        </div>

        {/* Scrolling bottom-facing anchor indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center space-y-2 opacity-50">
          <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-neutral-500">scroll</span>
          <div className="w-px h-6 bg-gradient-to-b from-orange-300/50 to-transparent" />
        </div>
      </section>

      <section className="border-b border-neutral-900 bg-neutral-950/85">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="font-mono text-[9px] tracking-[0.3em] text-orange-300 uppercase">Tonight's Top Tables</span>
              <p className="mt-1 font-serif text-lg sm:text-xl tracking-wide text-white">Priority availability slides right across the spotlight</p>
            </div>
            <span className="hidden sm:inline-flex rounded-full border border-orange-300/20 bg-orange-300/10 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.24em] text-orange-200">
              Live scroll
            </span>
          </div>

          <div className="relative mt-4 overflow-hidden rounded-3xl bg-neutral-950/65 shadow-[0_30px_90px_-32px_rgba(0,0,0,0.95),0_10px_30px_-18px_rgba(249,185,93,0.16)]">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-32 bg-[radial-gradient(circle_at_left,rgba(249,185,93,0.22),rgba(0,0,0,0.62)_36%,rgba(0,0,0,0.18)_58%,transparent_78%)] blur-[1px]" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-32 bg-[radial-gradient(circle_at_right,rgba(249,185,93,0.22),rgba(0,0,0,0.62)_36%,rgba(0,0,0,0.18)_58%,transparent_78%)] blur-[1px]" />
            <motion.div
              className="relative z-10 flex w-max py-2"
              animate={{ x: ['-50%', '0%'] }}
              transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
            >
              {(() => {
                const marqueeTables = restaurants.slice(0, 5).map((restaurant, index) => ({
                  id: restaurant.id,
                  name: restaurant.name,
                  cuisine: restaurant.cuisine,
                  slot: restaurant.popularTimeSlots[index % restaurant.popularTimeSlots.length],
                  michelin: restaurant.michelinStar || 1,
                  image: restaurant.image
                }));

                return [...marqueeTables, ...marqueeTables].map((table, index) => (
                  <div
                    key={`${table.id}-${index}`}
                    onClick={() => onNavigate('detail', table.id)}
                    className="mx-2 my-2 flex min-w-88 max-w-96 cursor-pointer items-center gap-4 rounded-2xl bg-white/5 px-4 py-4 backdrop-blur-sm shadow-[0_26px_70px_-28px_rgba(0,0,0,0.98),0_12px_24px_-14px_rgba(249,185,93,0.24)] transition-all duration-300 hover:shadow-[0_32px_90px_-24px_rgba(0,0,0,1),0_16px_28px_-12px_rgba(249,185,93,0.32)]"
                  >
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-900">
                      <img
                        src={table.image}
                        alt={table.name}
                        className="h-full w-full object-cover grayscale"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-mono text-[8px] uppercase tracking-[0.24em] text-orange-200">{table.cuisine}</p>
                        <div className="flex text-orange-300">
                          {Array.from({ length: table.michelin }).map((_, starIndex) => (
                            <Star key={`${table.id}-star-${starIndex}`} className="h-3 w-3 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="mt-1 font-serif text-base text-white">{table.name}</p>
                      <div className="mt-2 flex items-center justify-between gap-3">
                        <span className="rounded-full bg-neutral-800/80 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.24em] text-neutral-200">{table.slot} slot</span>
                        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-neutral-400">tap to view</span>
                      </div>
                    </div>
                  </div>
                ));
              })()}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Restaurateur Salons Portfolio */}
      <section id="portfolio" className="py-24 bg-neutral-950 border-b border-neutral-900 max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-16 gap-6">
          <div className="space-y-4">
            <span className="font-mono text-[10px] tracking-[0.3em] text-orange-300 uppercase">Synchronized Establishments</span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight">Michelin Star Portfolio</h2>
            <p className="text-neutral-400 text-sm max-w-xl font-light">
              Tableau integrates with historic culinary shrines. Hover and click an establishment to view their reservation terminals.
            </p>
          </div>
          <div className="flex bg-neutral-900 p-1 rounded-lg border border-neutral-800 text-[10px] font-mono tracking-widest uppercase">
            {(['all', 'michelin'] as const).map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 rounded-md transition-all ${activeFilter === f ? 'bg-orange-300 text-neutral-950 font-semibold' : 'text-neutral-400 hover:text-white'}`}
              >
                {f === 'all' ? 'All Salons' : 'Grand Reserve (2-3 ★)'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              onClick={() => onNavigate('detail', restaurant.id)}
              className="group bg-neutral-900/30 border border-neutral-900 hover:border-orange-300/20 rounded-lg overflow-hidden cursor-pointer transition-all duration-300"
            >
              <div className="relative h-64 overflow-hidden bg-neutral-950">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 transition-all duration-700 pointer-events-none"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-80" />
                
                {/* Michelin Star display badge */}
                {restaurant.michelinStar && (
                  <div className="absolute top-4 left-4 flex items-center space-x-1 bg-orange-300/90 text-neutral-950 px-2.5 py-1 rounded text-[10px] font-mono font-semibold uppercase tracking-wider">
                    <Star className="w-3 h-3 fill-current text-neutral-950" />
                    <span>{restaurant.michelinStar} Stars</span>
                  </div>
                )}

                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div>
                    <span className="font-mono text-[9px] tracking-widest text-orange-300 uppercase">{restaurant.cuisine}</span>
                    <h3 className="font-serif text-lg tracking-wide font-light text-neutral-100">{restaurant.name}</h3>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-400 group-hover:text-orange-300 transition-colors flex items-center space-x-1 bg-neutral-950/80 px-2 py-1 rounded border border-neutral-800">
                    <span>Terminal</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs text-neutral-400 font-light line-clamp-2 leading-relaxed">{restaurant.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Grid Logistics & Technical Capabilities */}
      <section id="features" className="py-24 bg-neutral-950 border-b border-neutral-900 max-w-7xl mx-auto px-6">
        <div className="mb-16 space-y-4">
          <span className="font-mono text-[10px] tracking-[0.3em] text-orange-300 uppercase">Core Logistics</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight">The Architecture of Hospitality</h2>
          <p className="text-neutral-400 text-sm max-w-2xl font-light">
            Engineered server-side and client-side to operate with zero friction, transforming manual reservations into physical choreography.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Compass className="w-5 h-5 text-orange-300" />,
              title: "Front-of-House Precision",
              description: "Interactive floor plan modeling with draggable grid anchors, live guest duration forecasts, and visual seat orchestration overlays.",
              badge: "FOH Log"
            },
            {
              icon: <ChefHat className="w-5 h-5 text-orange-300" />,
              title: "Back-of-House Orchestra",
              description: "Direct-to-kitchen tasting sequence meters, instant chef communication nodes, and automated cellar wine pairing checklists.",
              badge: "BOH Sync"
            },
            {
              icon: <UserCheck className="w-5 h-5 text-orange-300" />,
              title: "Guest Deep intelligence",
              description: "Palate preference tracking with historic reservation timelines, VIP highlight banners, and bespoke allergy telemetry cards.",
              badge: "CRM Grid"
            }
          ].map((feat, i) => (
            <div key={i} className="p-8 bg-neutral-900/40 border border-neutral-900 rounded-lg hover:border-neutral-800 transition-all group duration-300">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 group-hover:border-orange-300/20 transition-colors">
                  {feat.icon}
                </div>
                <span className="font-mono text-[9px] tracking-widest text-neutral-500 bg-neutral-950 px-2 py-1 rounded border border-neutral-900">{feat.badge}</span>
              </div>
              <h3 className="text-md font-sans tracking-wide font-medium text-neutral-100 mb-3">{feat.title}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">{feat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Investment Plans Section */}
      <section id="pricing" className="py-24 bg-neutral-950 max-w-7xl mx-auto px-6">
        <div className="mb-16 space-y-4 text-center">
          <span className="font-mono text-[10px] tracking-[0.3em] text-orange-300 uppercase">Investments</span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight">System Licences & Plans</h2>
          <p className="text-neutral-400 text-sm max-w-xl mx-auto font-light">
            Surgically tailored software support tiers suited to the size and ambition of your fine-dining vision.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Salon Plan",
              subtitle: "Best for single room boutiques & speakeasies",
              price: "$190",
              features: [
                "15 Real-time Grid table limits",
                "Advanced client digital check-in",
                "Basic guest historical preference notes",
                "Standard 101 cell setup support",
                "Email support grid queue response"
              ],
              btnText: "Choose Boutique",
              isPopular: false
            },
            {
              title: "Michelin Plan",
              subtitle: "Best for awarded fine-dining sanctuaries",
              price: "$490",
              features: [
                "Unlimited dynamic floor plans",
                "Smart kitchen pacing sequences",
                "Hyper-detailed guest historical CRM cards",
                "Cellar wine indicators with barcode scanners",
                "Dedicated operational engineer (24/7)"
              ],
              btnText: "Reserve Licence",
              isPopular: true
            },
            {
              title: "Grand Maison",
              subtitle: "Best for multi-national luxury groups",
              price: "$1,290",
              features: [
                "Multi-location unified guest telemetry",
                "Cross-property priority blacklists",
                "Custom visual branding theme overlays",
                "Real-time backup cell redundant grids",
                "In-person hardware training & audit"
              ],
              btnText: "Contact Sales Engineering",
              isPopular: false
            }
          ].map((plan, i) => (
            <div
              key={i}
              className={`p-8 bg-neutral-900/30 border rounded-lg flex flex-col justify-between relative transition-all duration-300 ${plan.isPopular ? 'border-orange-300/40 shadow-[0_0_30px_rgba(249,185,93,0.05)]' : 'border-neutral-900'}`}
            >
              {plan.isPopular && (
                <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-300 text-neutral-950 text-[9px] font-mono tracking-[0.2em] px-3 py-1 rounded font-bold uppercase shadow">
                  MOST POPULAR
                </span>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-xl tracking-wide font-light text-neutral-100">{plan.title}</h3>
                  <p className="text-[11px] text-neutral-500 mt-1 font-light leading-snug">{plan.subtitle}</p>
                </div>

                <div className="flex items-baseline space-x-2">
                  <span className="font-serif text-4xl font-light text-orange-300">{plan.price}</span>
                  <span className="text-xs font-mono text-neutral-500">/mo</span>
                </div>

                <div className="w-full h-px bg-neutral-900" />

                <ul className="space-y-3.5 text-xs text-neutral-400 font-light">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start space-x-2.5">
                      <Star className="w-3.5 h-3.5 text-orange-300/75 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => onNavigate('signin')}
                className={`w-full py-3.5 mt-8 font-mono tracking-widest text-[10px] uppercase rounded transition-all duration-300 ${plan.isPopular ? 'bg-gradient-to-r from-orange-400 to-orange-300 hover:from-orange-300 hover:to-orange-200 text-neutral-950 font-bold' : 'bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-orange-300/30 text-neutral-300'}`}
              >
                {plan.btnText}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Simple elegant footer */}
      <footer className="bg-neutral-950 border-t border-neutral-900 py-12 px-6 text-center max-w-7xl mx-auto text-neutral-500 font-mono text-[10px] tracking-widest uppercase">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-3">
            <span className="font-serif text-sm tracking-widest text-orange-300/80">T A B L E A U</span>
            <span className="text-neutral-700">|</span>
            <span>PRECISION HOSPITALITY SERVICES</span>
          </div>
          <div>
            <span>© {new Date().getFullYear()} TABLEAU GLOBAL INC. ALL LICENCES PERSIST.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

