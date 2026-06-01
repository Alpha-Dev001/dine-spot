import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, User, Lock, Mail, ChevronRight, CornerDownRight, Heart, Server } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface SignInProps {
  onSignInSuccess: (
    role: 'owner' | 'guest',
    target: 'dashboard' | 'onboarding',
    ownerDetails?: { email: string; password: string }
  ) => void;
  onBack: () => void;
}

const CINEMATIC_QUOTES = [
  { text: "Simplicity is the ultimate sophistication.", author: "Auguste Escoffier" },
  { text: "We do not construct recipes; we orchestrate sensory architectural alignments.", author: "Monolith Gastronomy Hub" },
  { text: "Modernism is not about tools; it is the study of pressure, moisture, and intense flavor bonds.", author: "Massimo Bottura" }
];

export default function SignInView({ onSignInSuccess, onBack }: SignInProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [quoteIndex, setQuoteIndex] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % CINEMATIC_QUOTES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast(authMode === 'signup'
        ? 'Create an owner account with an email and password before continuing.'
        : 'All security fields must be compiled.', 'warning');
      return;
    }

    onSignInSuccess('owner', authMode === 'signin' ? 'dashboard' : 'onboarding', { email, password });
  };
  return (
    <div id="signin-root" className="h-screen overflow-hidden bg-neutral-950 text-neutral-100 flex flex-col md:flex-row font-sans">

      {/* Ambient glowing orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange-300/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-300/3 rounded-full blur-[150px] pointer-events-none" />

      {/* Left Column: Form Terminal */}
      <div className="w-full md:w-[45%] h-full flex flex-col justify-between p-8 sm:p-10 z-10 border-r border-neutral-900 bg-neutral-950/45 backdrop-blur-xl">

        {/* Upper Brand Badge */}
        <div className="flex justify-between items-center">
          <button
            onClick={onBack}
            className="group flex items-center space-x-2 text-xs font-mono tracking-widest text-neutral-500 hover:text-orange-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span className="uppercase">Return</span>
          </button>
          <div className="flex items-center space-x-3">
            <img src="/favicon.svg" alt="Tableau" className="w-8 h-8" />
            <span className="font-serif text-lg tracking-widest text-orange-300">T A B L E A U</span>
          </div>
        </div>

        {/* Center: Actual Sign-In Core */}
        <div className="max-w-md w-full mx-auto space-y-6 my-auto py-3">
          <div className="space-y-3">
            <span className="font-mono text-[10px] tracking-[0.34em] text-orange-300 uppercase">Gateway Authorization</span>
            <h1 className="font-serif text-3xl font-light tracking-tight text-neutral-100">
              {authMode === 'signin' ? 'Sign In to Tableau' : 'Create an Owner Workspace'}
            </h1>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              {authMode === 'signin'
                ? 'Authenticate your identity to access live logistics, kitchen pipelines, and reservation floor plan matrices.'
                : 'New owners can start onboarding immediately and build their workspace without a prior account.'}
            </p>
          </div>

          <div className="grid grid-cols-2 rounded border border-neutral-800 bg-neutral-900/80 p-1">
            <button
              type="button"
              onClick={() => setAuthMode('signin')}
              className={`py-2 text-[10px] font-mono uppercase tracking-[0.24em] rounded transition-all ${authMode === 'signin'
                ? 'bg-orange-300 text-neutral-950 font-semibold shadow-[0_0_18px_rgba(249,185,93,0.2)]'
                : 'text-neutral-400 hover:text-neutral-200'
                }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
              }}
              className={`py-2 text-[10px] font-mono uppercase tracking-[0.24em] rounded transition-all ${authMode === 'signup'
                ? 'bg-orange-300 text-neutral-950 font-semibold shadow-[0_0_18px_rgba(249,185,93,0.2)]'
                : 'text-neutral-400 hover:text-neutral-200'
                }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-[10px] font-mono tracking-widest text-neutral-400 uppercase">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@tableau.com"
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-orange-300/30 text-xs text-neutral-100 py-3.5 pl-10 pr-4 rounded-md focus:outline-none placeholder-neutral-600 font-mono tracking-wide transition-colors"
                  required
                />
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-600" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] font-mono tracking-widest text-neutral-400 uppercase">Security Code</label>
                <a href="#reset" className="text-[10px] font-mono text-neutral-600 hover:text-orange-300 transition-colors">Recover?</a>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-orange-300/30 text-xs text-neutral-100 py-3.5 pl-10 pr-4 rounded-md focus:outline-none placeholder-neutral-600 transition-colors"
                  required
                />
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-600" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-orange-400 to-orange-300 hover:from-orange-300 hover:to-orange-200 text-neutral-950 font-mono tracking-widest text-xs uppercase rounded hover:shadow-[0_0_20px_rgba(249,185,93,0.2)] font-semibold transition-all duration-300"
            >
              {authMode === 'signin' ? 'Authorize Credentials' : 'Continue to Onboarding'}
            </button>
          </form>

        </div>

        {/* Lower System Indicator */}
        <div className="flex justify-between items-center text-[10px] font-mono text-neutral-600 mt-6 shrink-0">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-300 animate-pulse" />
            <span>GRID-PORTAL_ONLINE</span>
          </div>
          <span>v2.12.0_SECURE</span>
        </div>
      </div>

      {/* Right Column: Stunning Cinematic Display */}
      <div className="hidden md:flex md:w-[55%] h-full relative flex-col justify-end p-16 select-none bg-neutral-950">

        {/* Full cover background image with heavy luxury filters */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1000"
            alt="Cinematic Fine Dining"
            className="w-full h-full object-cover grayscale opacity-45 select-none"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-neutral-950/60" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(249,185,93,0.08)_0%,transparent_50%)]" />
        </div>

        {/* Center: Carousel Quote cards */}
        <div className="relative z-10 space-y-6 max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={quoteIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <span className="font-mono text-[9px] tracking-[0.4em] text-orange-300 uppercase">Operational Philosophy</span>
              <p className="font-serif text-3xl font-light italic text-neutral-200 leading-normal">
                "{CINEMATIC_QUOTES[quoteIndex].text}"
              </p>
              <div className="flex items-center space-x-3 text-xs font-mono tracking-widest text-neutral-500">
                <span className="w-6 h-px bg-neutral-700" />
                <span className="uppercase">{CINEMATIC_QUOTES[quoteIndex].author}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

