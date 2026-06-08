import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Lock, Mail, UserPlus, LogIn } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

type CustomerCredentials = { email: string; password: string };

interface CustomerAuthViewProps {
  restaurantId: string;
  restaurantName: string;
  onSignIn: (details: CustomerCredentials, restaurantId: string) => Promise<void> | void;
  onSignUp: (details: CustomerCredentials, restaurantId: string) => Promise<void> | void;
  onBack: () => void;
}

export default function CustomerAuthView({ restaurantId, restaurantName, onSignIn, onSignUp, onBack }: CustomerAuthViewProps) {
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast('Email and password are required to continue.', 'warning');
      return;
    }

    setBusy(true);
    try {
      if (authMode === 'signin') {
        await onSignIn({ email, password }, restaurantId);
      } else {
        await onSignUp({ email, password }, restaurantId);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-neutral-950 text-neutral-100 flex flex-col md:flex-row font-sans">
      {/* Ambient glowing orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange-300/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-300/3 rounded-full blur-[150px] pointer-events-none" />

      {/* Left: auth form */}
      <div className="w-full md:w-[45%] h-full flex flex-col justify-between p-8 sm:p-10 z-10 border-r border-neutral-900 bg-neutral-950/45 backdrop-blur-xl">
        <div className="flex justify-between items-center">
          <button
            onClick={onBack}
            className="group flex items-center space-x-2 text-xs font-mono tracking-widest text-neutral-500 hover:text-orange-300 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span className="uppercase">Back</span>
          </button>

          <div className="flex items-center space-x-3">
            <img src="/favicon.svg" alt="Tableau" className="w-8 h-8" />
            <span className="font-serif text-lg tracking-widest text-orange-300">TABLEAU</span>
          </div>
        </div>

        <div className="max-w-md w-full mx-auto space-y-6 my-auto py-3">
          <div className="space-y-3">
            <span className="font-mono text-[10px] tracking-[0.34em] text-orange-300 uppercase">
              Customer Access
            </span>
            <h1 className="font-serif text-3xl font-light tracking-tight text-neutral-100">
              {authMode === 'signin' ? 'Sign In to Book' : 'Create Account to Book'}
            </h1>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              You selected <span className="text-neutral-200 font-serif">{restaurantName}</span>. Create an account or sign in to continue to your booking dashboard.
            </p>
          </div>

          <div className="grid grid-cols-2 rounded border border-neutral-800 bg-neutral-900/80 p-1">
            <button
              type="button"
              onClick={() => setAuthMode('signin')}
              className={`py-2 text-[10px] font-mono uppercase tracking-[0.24em] rounded transition-all ${
                authMode === 'signin'
                  ? 'bg-orange-300 text-neutral-950 font-semibold shadow-[0_0_18px_rgba(249,185,93,0.2)]'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('signup')}
              className={`py-2 text-[10px] font-mono uppercase tracking-[0.24em] rounded transition-all ${
                authMode === 'signup'
                  ? 'bg-orange-300 text-neutral-950 font-semibold shadow-[0_0_18px_rgba(249,185,93,0.2)]'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Create
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-[10px] font-mono tracking-widest text-neutral-400 uppercase">Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-orange-300/30 text-xs text-neutral-100 py-3.5 pl-10 pr-4 rounded-md focus:outline-none placeholder-neutral-600 font-mono tracking-wide transition-colors"
                  required
                />
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-600" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
                Password
              </label>
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
              disabled={busy}
              className="w-full py-4 bg-gradient-to-r from-orange-400 to-orange-300 hover:from-orange-300 hover:to-orange-200 text-neutral-950 font-mono tracking-widest text-xs uppercase rounded hover:shadow-[0_0_20px_rgba(249,185,93,0.2)] font-semibold transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span className="inline-flex items-center justify-center gap-2">
                {authMode === 'signin' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                {busy ? 'Please wait...' : authMode === 'signin' ? 'Authorize & Continue' : 'Create & Continue'}
              </span>
            </button>
          </form>
        </div>

        <AnimatePresence>
          {busy && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-between items-center text-[10px] font-mono text-neutral-600 mt-6 shrink-0"
            >
              <span>GRID-PORTAL_ONLINE</span>
              <span className="text-neutral-500">AUTH_SYNC...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right: cinematic */}
      <div className="hidden md:flex md:w-[55%] h-full relative flex-col justify-end p-16 select-none bg-neutral-950">
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

        <div className="relative z-10 space-y-4 max-w-xl">
          <span className="font-mono text-[9px] tracking-[0.4em] text-orange-300 uppercase">Operational Philosophy</span>
          <p className="font-serif text-3xl font-light italic text-neutral-200 leading-normal">
            “Account access unlocks reservation choreography.”
          </p>
          <div className="text-xs text-neutral-500 font-mono">
            Secure booking pipeline for customer sessions.
          </div>
        </div>
      </div>
    </div>
  );
}

