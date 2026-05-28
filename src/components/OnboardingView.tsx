import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Calendar, ArrowRight, Check, Upload, MapPin, Grid, Layers, BarChart, Server, Sparkles, Paintbrush, ShieldCheck } from 'lucide-react';
import { FloorAsset } from '../types';

interface OnboardingProps {
  onComplete: (establishmentDetails: {
    name: string;
    cuisine: string;
    color: string;
    assets: FloorAsset[];
  }) => void;
  onBack: () => void;
}

const PRESET_BG_IMAGES = [
  { name: 'Onyx Salon', url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400' },
  { name: 'Ivy Greenhouse', url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=400' },
  { name: 'Gilded Velvet', url: 'https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&q=80&w=400' }
];

export default function OnboardingView({ onComplete, onBack }: OnboardingProps) {
  const [step, setStep] = useState(1);

  // Form State
  const [establishmentName, setEstablishmentName] = useState('');
  const [cuisinePhil, setCuisinePhil] = useState('');
  const [sigDish, setSigDish] = useState('');

  // Map State
  const [searchLocation, setSearchLocation] = useState('San Francisco, CA');
  const [latitude, setLatitude] = useState(37.7749);
  const [longitude, setLongitude] = useState(-122.4194);
  const [isBouncing, setIsBouncing] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Visual Styling State
  const [selectedColor, setSelectedColor] = useState('orange');
  const [customImageUrl, setCustomImageUrl] = useState(PRESET_BG_IMAGES[0].url);

  // Floor Plan Builder State
  const [selectedAssetType, setSelectedAssetType] = useState<'table' | 'booth' | 'bar'>('table');
  const [floorPlan, setFloorPlan] = useState<FloorAsset[]>([
    { id: 'ob1', type: 'table', x: 2, y: 1, capacity: 4, number: '01', status: 'available' },
    { id: 'ob2', type: 'booth', x: 6, y: 3, capacity: 6, number: '02', status: 'available' },
    { id: 'ob3', type: 'bar', x: 2, y: 5, capacity: 1, number: 'B1', status: 'available' },
    { id: 'ob4', type: 'bar', x: 4, y: 5, capacity: 1, number: 'B2', status: 'available' }
  ]);

  const colorThemes: Record<string, { bg: string, text: string, border: string, glow: string }> = {
    orange: { bg: 'bg-orange-300', text: 'text-orange-300', border: 'border-orange-300', glow: 'shadow-[0_0_15px_rgba(249,185,93,0.2)]' },
    rose: { bg: 'bg-rose-500', text: 'text-rose-500', border: 'border-rose-500', glow: 'shadow-[0_0_15px_rgba(244,63,94,0.2)]' },
    emerald: { bg: 'bg-emerald-500', text: 'text-emerald-500', border: 'border-emerald-500', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.2)]' },
    violet: { bg: 'bg-violet-500', text: 'text-violet-500', border: 'border-violet-500', glow: 'shadow-[0_0_15px_rgba(139,92,246,0.2)]' }
  };

  const handleGeocode = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      return;
    }

    setLocationError(null);
    setIsBouncing(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setSearchLocation('Current location');
        setIsBouncing(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationError('Unable to detect location. Please allow location access or enter an address manually.');
        setIsBouncing(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleCellClick = (gridX: number, gridY: number) => {
    // Check if item already exists at this spot
    const existingIndex = floorPlan.findIndex(item => item.x === gridX && item.y === gridY);

    if (existingIndex > -1) {
      // Remove it
      setFloorPlan(prev => prev.filter((_, idx) => idx !== existingIndex));
    } else {
      // Place new asset
      const id = 'f_' + Date.now();
      const capacity = selectedAssetType === 'table' ? 4 : selectedAssetType === 'booth' ? 6 : 1;

      const tableCount = floorPlan.filter(item => item.type === selectedAssetType).length + 1;
      const prefix = selectedAssetType === 'table' ? '0' : selectedAssetType === 'booth' ? 'L' : 'B';
      const number = `${prefix}${tableCount}`;

      const newAsset: FloorAsset = {
        id,
        type: selectedAssetType,
        x: gridX,
        y: gridY,
        capacity,
        number,
        status: 'available'
      };
      setFloorPlan(prev => [...prev, newAsset]);
    }
  };

  const totalCapacity = floorPlan.reduce((acc, curr) => acc + curr.capacity, 0);

  const handleNextStep = () => {
    if (step < 5) {
      setStep(prev => prev + 1);
    } else {
      onComplete({
        name: establishmentName,
        cuisine: cuisinePhil,
        color: selectedColor,
        assets: floorPlan
      });
    }
  };

  const handleBackStep = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    } else {
      onBack();
    }
  };

  const activeTheme = colorThemes[selectedColor] || colorThemes.orange;

  return (
    <div id="onboarding-root" className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between font-sans relative">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-300/2 rounded-full blur-[120px] pointer-events-none" />

      {/* Onboarding Header */}
      <header className="px-8 py-5 border-b border-neutral-900 bg-neutral-950/80 backdrop-blur-md flex justify-between items-center z-10">
        <div className="flex items-center space-x-3">
          <span className="font-mono text-[9px] tracking-[0.4em] text-neutral-600 uppercase">ONBOARDING SETUP</span>
          <span className="font-serif text-lg tracking-widest text-orange-300">T A B L E A U</span>
        </div>
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${step === s ? `${activeTheme.bg} w-6` : step > s ? 'bg-neutral-600' : 'bg-neutral-800'}`}
            />
          ))}
        </div>
      </header>

      {/* Onboarding Content Box */}
      <main className="flex-1 flex items-center justify-center p-6 md:p-12 max-w-5xl mx-auto w-full z-10">
        <AnimatePresence mode="wait">

          {/* STEP 1: WELCOME & PHILOSOPHY */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="space-y-8 max-w-xl text-center"
            >
              <div className="mx-auto w-14 h-14 bg-orange-300/10 border border-orange-300/20 rounded-full flex items-center justify-center">
                <Compass className="w-6 h-6 text-orange-300" />
              </div>
              <div className="space-y-3">
                <span className="font-mono text-[10px] tracking-[0.3em] text-orange-300 uppercase">Phase 01 | Welcome</span>
                <h1 className="font-serif text-4xl font-light tracking-tight text-neutral-100">The Art of the Reservation</h1>
                <p className="text-sm text-neutral-400 font-light leading-relaxed">
                  Welcome to the Tableau operating grid. In five quick stages, we will establish your dining room identity, declare culinary parameters, geolocate your pin coordinates, and physically draft your floor coordinate plan.
                </p>
              </div>
              <div className="p-4 bg-neutral-900/50 border border-neutral-900 text-left text-xs text-neutral-400 space-y-3 rounded">
                <p className="font-bold flex items-center gap-2 text-neutral-300">
                  <ShieldCheck className="w-4 h-4 text-orange-300" />
                  Tableau Hardware Alignment Complete
                </p>
                <p className="font-light">
                  All systems certified. We do not operate with local storage cookies; your floor plans and settings sync directly with server state in production.
                </p>
              </div>
              <button
                onClick={handleNextStep}
                className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-orange-400 to-orange-300 text-neutral-950 font-mono tracking-widest text-xs uppercase cursor-pointer rounded transition-all duration-300 hover:shadow-[0_0_20px_rgba(249,185,93,0.2)] font-semibold"
              >
                <span>Begin System Setup</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* STEP 2: ESSENTIAL DETAILS */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-lg space-y-8"
            >
              <div className="space-y-2">
                <span className="font-mono text-[10px] tracking-[0.3em] text-orange-300 uppercase">Phase 02 | Culinary Identity</span>
                <h2 className="font-serif text-3xl font-light tracking-tight text-neutral-100">Establishment Metrics</h2>
                <p className="text-xs text-neutral-400 font-light">Describe the culinary core of your salon's vision.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-[10px] font-mono tracking-widest text-neutral-500 uppercase">Establishment Name</label>
                  <input
                    type="text"
                    value={establishmentName}
                    onChange={(e) => setEstablishmentName(e.target.value)}
                    className="w-full bg-neutral-900 border-b border-neutral-800 focus:border-orange-300/50 text-md py-3 px-4 font-serif tracking-wide focus:outline-none focus:placeholder-transparent placeholder-neutral-700 transition-colors"
                    placeholder="Enter restaurant name..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-mono tracking-widest text-neutral-500 uppercase">Cuisine Philosophy</label>
                  <input
                    type="text"
                    value={cuisinePhil}
                    onChange={(e) => setCuisinePhil(e.target.value)}
                    className="w-full bg-neutral-900 border-b border-neutral-800 focus:border-orange-300/50 text-xs py-3 px-4 font-mono tracking-wide focus:outline-none focus:placeholder-transparent placeholder-neutral-700 transition-colors"
                    placeholder="e.g. Neo-Nordic Fermentations & Woods"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-mono tracking-widest text-neutral-500 uppercase">Signature Dish / Masterpiece</label>
                  <input
                    type="text"
                    value={sigDish}
                    onChange={(e) => setSigDish(e.target.value)}
                    className="w-full bg-neutral-900 border-b border-neutral-800 focus:border-orange-300/50 text-xs py-3 px-4 font-mono tracking-wide focus:outline-none focus:placeholder-transparent placeholder-neutral-700 transition-colors"
                    placeholder="e.g. Hay Smoked Langoustine in Pine Fat"
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button onClick={handleBackStep} className="px-6 py-3.5 border border-neutral-800 text-neutral-400 font-mono text-xs uppercase rounded hover:bg-neutral-900 transition-colors">Back</button>
                <button
                  onClick={handleNextStep}
                  disabled={!establishmentName || !cuisinePhil || !sigDish}
                  className="flex-1 py-3.5 bg-gradient-to-r from-orange-400 to-orange-300 text-neutral-950 font-mono tracking-widest text-xs uppercase duration-300 rounded hover:shadow-[0_0_15px_rgba(249,185,93,0.15)] font-semibold disabled:opacity-40"
                >
                  Continue Setup
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: MOCK GEOLOCATION */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full grid md:grid-cols-2 gap-8 items-center"
            >
              <div className="space-y-6">
                <div className="space-y-2">
                  <span className="font-mono text-[10px] tracking-[0.3em] text-orange-300 uppercase">Phase 03 | Geolocation</span>
                  <h2 className="font-serif text-3xl font-light tracking-tight text-neutral-100">Establishment Coordinates</h2>
                  <p className="text-xs text-neutral-400 font-light">Specify your physical salon terrain to initialize local client directions.</p>
                </div>

                <div className="space-y-3 font-mono text-xs bg-neutral-900/60 p-4 border border-neutral-900 rounded">
                  <div className="space-y-1">
                    <label className="text-[9px] text-neutral-500 uppercase tracking-widest">Location</label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <input
                        type="text"
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                        className="flex-1 bg-neutral-950 border border-neutral-800 focus:border-orange-300/30 text-xs px-3 py-2 text-neutral-100 focus:outline-none rounded"
                        placeholder="Leave blank to detect your current location"
                      />
                      <button onClick={handleGeocode} className="px-3 py-2 bg-orange-300 hover:bg-orange-200 text-neutral-950 font-bold uppercase rounded text-[10px]">Detect</button>
                    </div>
                    {locationError && (
                      <p className="text-[10px] text-rose-300 mt-2">{locationError}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-neutral-850">
                    <div>
                      <div className="text-[9px] text-neutral-500 uppercase tracking-widest">Latitude (Y)</div>
                      <div className="font-bold text-orange-300 text-xs py-1.5 px-2 bg-neutral-950 border border-neutral-850 rounded">{latitude.toFixed(6)}</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-neutral-500 uppercase tracking-widest">Longitude (X)</div>
                      <div className="font-bold text-orange-300 text-xs py-1.5 px-2 bg-neutral-950 border border-neutral-850 rounded">{longitude.toFixed(6)}</div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button onClick={handleBackStep} className="px-6 py-3.5 border border-neutral-800 text-neutral-400 font-mono text-xs uppercase rounded hover:bg-neutral-900 transition-colors">Back</button>
                  <button onClick={handleNextStep} className="flex-1 py-3.5 bg-gradient-to-r from-orange-400 to-orange-300 text-neutral-950 font-mono tracking-widest text-xs uppercase rounded hover:shadow-[0_0_15px_rgba(249,185,93,0.15)] font-semibold">Confirm Location</button>
                </div>
              </div>

              {/* Graphic Mock Map */}
              <div className="relative h-[280px] sm:h-[320px] bg-neutral-900 rounded-lg border border-neutral-850 overflow-hidden flex items-center justify-center p-4">
                {/* Schematic backdrop representing abstract streets */}
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(249,185,93,0.02)_0%,transparent_70%)]" />
                <div className="absolute inset-0 opacity-[0.05] bg-[linear-gradient(to_right,#aaa_1px,transparent_1px),linear-gradient(to_bottom,#aaa_1px,transparent_1px)] bg-[size:20px_20px]" />

                <svg className="absolute inset-0 w-full h-full stroke-neutral-800 stroke-1 fill-none opacity-30">
                  <circle cx="50%" cy="50%" r="40" strokeWidth="1" strokeDasharray="4" />
                  <circle cx="50%" cy="50%" r="80" strokeWidth="1" strokeDasharray="4" />
                  <line x1="0" y1="50%" x2="100%" y2="50%" />
                  <line x1="50%" y1="0" x2="50%" y2="100%" />
                  <path d="M 30,50 Q 150,20 280,180" />
                  <path d="M 120,0 Q 190,150 210,320" />
                </svg>

                {/* Animated bouncing custom Pin */}
                <motion.div
                  animate={isBouncing ? { y: [0, -20, 0] } : { y: [0, -4, 0] }}
                  transition={isBouncing ? { repeat: 1, duration: 0.6 } : { repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  className="z-10 flex flex-col items-center"
                >
                  <MapPin className="w-10 h-10 text-orange-300 drop-shadow-[0_4px_10px_rgba(249,185,93,0.4)]" />
                  <div className="absolute -bottom-1 w-6 h-1.5 bg-orange-300/20 blur-sm rounded-full" />
                </motion.div>

                {/* Address Box Tag Overlay */}
                <div className="absolute bottom-4 left-4 right-4 p-3 bg-neutral-950/80 backdrop-blur border border-neutral-800 rounded font-mono text-[9px] uppercase tracking-wider flex justify-between">
                  <div>
                    <span className="text-neutral-500 block">Identified Hub Node</span>
                    <span className="text-neutral-200 mt-1 font-bold">{searchLocation || 'Undefined Target'}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-neutral-500 block">Accuracy Rating</span>
                    <span className="text-orange-300 font-bold">99.9% aligned</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: VISUAL STYLE & BRAND THEMING */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full max-w-lg space-y-8"
            >
              <div className="space-y-2">
                <span className="font-mono text-[10px] tracking-[0.3em] text-orange-300 uppercase">Phase 04 | Visual Interface</span>
                <h2 className="font-serif text-3xl font-light tracking-tight text-neutral-100">Aesthetic Accent Styling</h2>
                <p className="text-xs text-neutral-400 font-light">Configure color themes and salon backdrop profiles represented on guest booking portals.</p>
              </div>

              {/* Accent Color Chooser */}
              <div className="space-y-3">
                <span className="block text-[10px] font-mono tracking-widest text-neutral-500 uppercase">Interactive Applet Accent Color</span>
                <div className="flex space-x-4">
                  {(['orange', 'rose', 'emerald', 'violet'] as const).map((color) => {
                    const bgClass = color === 'orange' ? 'bg-orange-300' : color === 'rose' ? 'bg-rose-500' : color === 'emerald' ? 'bg-emerald-500' : 'bg-violet-500';
                    return (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-9 h-9 rounded-full relative flex items-center justify-center transition-all ${bgClass} ${selectedColor === color ? 'ring-4 ring-neutral-100' : 'opacity-70 hover:opacity-100'}`}
                      >
                        {selectedColor === color && <Check className="w-5 h-5 text-neutral-950 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cover Presets selection */}
              <div className="space-y-3">
                <span className="block text-[10px] font-mono tracking-widest text-neutral-500 uppercase">Background Cover Presets</span>
                <div className="grid grid-cols-3 gap-3">
                  {PRESET_BG_IMAGES.map((img, i) => (
                    <div
                      key={i}
                      onClick={() => setCustomImageUrl(img.url)}
                      className={`h-20 rounded border overflow-hidden cursor-pointer relative group transition-all ${customImageUrl === img.url ? `${activeTheme.border} border-2` : 'border-neutral-900 grayscale opacity-60 hover:opacity-100 hover:grayscale-0'}`}
                    >
                      <img src={img.url} alt={img.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-neutral-950/40 flex items-end p-1.5 justify-center">
                        <span className="text-[8px] font-mono tracking-widest text-neutral-100 text-center uppercase">{img.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Client Ticket Rendering Sample */}
              <div className="bg-neutral-900/60 p-4 border border-neutral-900 rounded space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-neutral-850">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase">Portal Mock Preview</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <div className="flex justify-between items-start font-serif font-light">
                  <div>
                    <h3 className="text-sm text-neutral-250 font-normal">{establishmentName}</h3>
                    <p className="text-[9px] font-mono text-neutral-500 uppercase mt-0.5">{cuisinePhil}</p>
                  </div>
                  <div className={`text-[10px] font-mono uppercase bg-neutral-950 px-2 py-1 rounded inline-block border ${activeTheme.border} ${activeTheme.text}`}>
                    RESERVED
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button onClick={handleBackStep} className="px-6 py-3.5 border border-neutral-800 text-neutral-400 font-mono text-xs uppercase rounded hover:bg-neutral-900 transition-colors">Back</button>
                <button onClick={handleNextStep} className="flex-1 py-3.5 bg-gradient-to-r from-orange-400 to-orange-300 text-neutral-950 font-mono tracking-widest text-xs uppercase duration-300 rounded hover:shadow-[0_0_15px_rgba(249,185,93,0.15)] font-semibold">Confirm Brand Assets</button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: INTERACTIVE FLOOR PLAN DRAFTER */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              className="w-full grid md:grid-cols-12 gap-8"
            >

              {/* Left Column Controls */}
              <div className="md:col-span-5 space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="font-mono text-[9px] tracking-[0.3em] text-orange-300 uppercase">Phase 05 | Floor Logistics</span>
                    <h2 className="font-serif text-2xl font-light tracking-tight text-neutral-100">Tactile Table Layout</h2>
                    <p className="text-xs text-neutral-400 font-light leading-relaxed">
                      Select an asset type below, then click any intersection block on the 12×8 grid canvas to place or remove elements.
                    </p>
                  </div>

                  {/* Asset Selectors buttons */}
                  <div className="space-y-2">
                    <span className="block text-[9px] font-mono tracking-widest text-neutral-500 uppercase">Active Asset Cursor</span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { type: 'table', label: 'Table (4p)', cap: 4, labelSub: 'Standard' },
                        { type: 'booth', label: 'Booth (6p)', cap: 6, labelSub: 'Comfort' },
                        { type: 'bar', label: 'Bar (1p)', cap: 1, labelSub: 'Stool' }
                      ].map((asset) => (
                        <button
                          key={asset.type}
                          onClick={() => setSelectedAssetType(asset.type as any)}
                          className={`p-3 rounded text-left transition-all border ${selectedAssetType === asset.type ? `${activeTheme.border} ${activeTheme.glow} bg-neutral-900/40 text-neutral-100` : 'border-neutral-900 bg-neutral-950 text-neutral-500 hover:text-neutral-300'}`}
                        >
                          <div className="font-sans text-xs font-bold">{asset.label}</div>
                          <div className="text-[9px] font-mono uppercase text-neutral-500 mt-1">{asset.labelSub}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Operational Telemetry Summary */}
                  <div className="p-4 bg-neutral-900/60 border border-neutral-900 rounded font-mono text-xs space-y-2.5">
                    <div className="text-[9px] text-neutral-500 uppercase tracking-widest pb-1.5 border-b border-neutral-850">Operational Calculations</div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Total Placement Nodes</span>
                      <span className="font-bold text-neutral-200">{floorPlan.length} items</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Accumulated Room Chairs</span>
                      <span className="font-bold text-orange-300">{totalCapacity} covers</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4 pt-4 mt-auto">
                  <button onClick={handleBackStep} className="px-5 py-3 border border-neutral-800 text-neutral-400 font-mono text-xs uppercase rounded hover:bg-neutral-900 transition-colors">Back</button>
                  <button
                    onClick={handleNextStep}
                    className="flex-1 py-3 text-neutral-950 font-mono tracking-widest text-xs uppercase rounded bg-gradient-to-r from-orange-400 to-orange-300 hover:from-orange-300 font-bold hover:shadow-[0_0_20px_rgba(249,185,93,0.25)] transition-all duration-300"
                  >
                    Deploy Floor Plan
                  </button>
                </div>
              </div>

              {/* Right Column Grid Interactive Arena */}
              <div className="md:col-span-7 flex flex-col justify-center items-center">
                <div className="mb-2 text-[10px] font-mono tracking-widest text-neutral-500 uppercase flex justify-between w-full">
                  <span>SALON GRID CO-PLAN</span>
                  <span>12 × 8 SPATIAL COORDS</span>
                </div>

                <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-900 select-none w-full shadow-inner">
                  {/* Outer Frame with grid boxes */}
                  <div className="grid grid-cols-12 gap-2 aspect-[12/8] w-full bg-neutral-900/20 p-2.5 rounded border border-neutral-950">
                    {Array.from({ length: 96 }).map((_, i) => {
                      const gridX = i % 12;
                      const gridY = Math.floor(i / 12);

                      // Check if asset is placed at this grid coordination point
                      const placedAsset = floorPlan.find(item => item.x === gridX && item.y === gridY);

                      return (
                        <div
                          key={i}
                          onClick={() => handleCellClick(gridX, gridY)}
                          className={`aspect-square rounded flex items-center justify-center cursor-pointer transition-all duration-300 transform active:scale-90 border overflow-hidden ${placedAsset ? `${activeTheme.border} ${activeTheme.bg} ${activeTheme.glow} text-neutral-950 shadow-md scale-105` : 'border-neutral-900/60 bg-neutral-950/40 hover:bg-neutral-900/40 hover:border-neutral-800'}`}
                          title={`Coord (${gridX}, ${gridY})`}
                        >
                          {placedAsset ? (
                            <div className="font-mono text-[9px] font-extrabold tracking-tighter flex flex-col items-center">
                              <span>{placedAsset.number}</span>
                              <span className="text-[7px] text-neutral-950/60 font-semibold">{placedAsset.capacity}P</span>
                            </div>
                          ) : (
                            <div className="w-[3px] h-[3px] rounded-full bg-neutral-800" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Grid legend indicators */}
                <div className="flex gap-4 justify-center py-2.5 font-mono text-[9px] uppercase tracking-wider text-neutral-600 mt-2">
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-orange-300" /> Placed Standard Table</span>
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Placed Lounge Booth</span>
                  <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 text-neutral-950" /> Placed Bar Seat</span>
                </div>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Onboarding Footer */}
      <footer className="px-8 py-5 border-t border-neutral-900 text-center font-mono text-[10px] tracking-widest text-neutral-600 uppercase">
        <span>SOCIÉTÉ CIVILIENNE TABLEAU • ALIGNED COORDS VALIDATION SECURE</span>
      </footer>
    </div>
  );
}

