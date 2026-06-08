import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Clock, Users, CalendarDays, Sparkles, AlertTriangle } from 'lucide-react';
import { Restaurant } from '../types';
import { CALENDAR_DATES, INITIAL_DATE_INDEX } from '../data';
import { useToast } from '../contexts/ToastContext';

export function displayNameFromEmail(email: string): string {
  const local = email.split('@')[0] ?? 'Guest';
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ') || 'Guest';
}

interface CustomerBookingPanelProps {
  restaurant: Restaurant;
  customerEmail: string;
  onBook: (
    guestName: string,
    party: number,
    hour: string,
    calendarDate: string,
    customerEmail: string,
    guestNotes?: string
  ) => void | Promise<void>;
}

export default function CustomerBookingPanel({
  restaurant,
  customerEmail,
  onBook
}: CustomerBookingPanelProps) {
  const guestName = displayNameFromEmail(customerEmail);
  const { toast } = useToast();
  const [selectedDateIdx, setSelectedDateIdx] = useState(INITIAL_DATE_INDEX);
  const [dateError, setDateError] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState(
    restaurant.popularTimeSlots[1] || restaurant.popularTimeSlots[0] || '19:30'
  );
  const [partySize, setPartySize] = useState(2);
  const [guestNotes, setGuestNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const selectedDate = CALENDAR_DATES[selectedDateIdx];

  const handleDateClick = (idx: number) => {
    setSelectedDateIdx(idx);
    if (CALENDAR_DATES[idx].isPast) {
      setDateError("Error: Choosing a date in the past is not allowed.");
      toast("Error: Choosing a date in the past is not allowed.", "error");
    } else {
      setDateError(null);
    }
  };

  const summary = useMemo(
    () => ({
      date: selectedDate.full,
      time: selectedTime,
      party: partySize
    }),
    [selectedDate.full, selectedTime, partySize]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (CALENDAR_DATES[selectedDateIdx].isPast) {
      setDateError("Error: Choosing a date in the past is not allowed.");
      toast("Error: Choosing a date in the past is not allowed.", "error");
      throw new Error("Cannot book a date in the past");
    }
    setSubmitting(true);
    try {
      await onBook(
        guestName,
        partySize,
        selectedTime,
        selectedDate.full,
        customerEmail,
        guestNotes.trim() || undefined
      );
      setGuestNotes('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Guest identity */}
      <div className="p-4 rounded-xl border border-[#362f2c] bg-[#070707]/90 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-orange-300/15 border border-orange-300/25 flex items-center justify-center shrink-0">
            <span className="font-serif text-orange-300 text-sm">{guestName.charAt(0)}</span>
          </div>
          <div className="min-w-0">
            <div className="text-[9px] font-mono uppercase tracking-widest text-neutral-500">Reserved for</div>
            <div className="font-serif text-base text-[#fffaf5] truncate">{guestName}</div>
            <div className="text-[10px] font-mono text-neutral-500 truncate">{customerEmail}</div>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[9px] font-mono uppercase tracking-widest shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Verified
        </div>
      </div>

      {/* Live summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: CalendarDays, label: 'Date', value: `${selectedDate.day} ${selectedDate.date}` },
          { icon: Clock, label: 'Time', value: summary.time },
          { icon: Users, label: 'Guests', value: String(summary.party) }
        ].map((item) => (
          <div key={item.label} className="p-3 rounded-lg border border-[#302923]/70 bg-[#0f0d0c]/60 text-center">
            <item.icon className="w-3.5 h-3.5 text-orange-300 mx-auto mb-1.5" />
            <div className="text-[8px] font-mono uppercase tracking-widest text-neutral-500">{item.label}</div>
            <div className="text-xs font-mono text-neutral-200 mt-0.5">{item.value}</div>
          </div>
        ))}
      </div>

      {/* Step 1: Date */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-orange-300 text-neutral-950 text-[10px] font-mono font-bold flex items-center justify-center">1</span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">Select your date</span>
        </div>
        <div className="flex overflow-x-auto gap-2 pb-1 scrollbar-none snap-x">
          {CALENDAR_DATES.map((cal, i) => (
            <button
              key={cal.full}
              type="button"
              onClick={() => handleDateClick(i)}
              className={`p-2.5 w-14 h-16 rounded-lg flex flex-col items-center justify-between font-mono border text-center transition-all shrink-0 snap-start ${
                selectedDateIdx === i
                  ? 'bg-orange-300 border-orange-300 text-neutral-950 font-bold shadow-[0_0_18px_rgba(249,185,93,0.25)] scale-105'
                  : 'bg-[#070707] border-[#2a241f] text-neutral-400 hover:border-neutral-600 hover:text-white'
              }`}
            >
              <span className={`text-[8px] uppercase tracking-wider ${selectedDateIdx === i ? 'text-neutral-900' : 'text-neutral-500'}`}>
                {cal.day}
              </span>
              <span className="text-sm font-bold font-serif">{cal.date}</span>
            </button>
          ))}
        </div>
        {dateError && (
          <div className="flex items-center gap-2 p-3 rounded-lg border border-red-500/25 bg-red-500/10 text-red-400 text-xs font-mono">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{dateError}</span>
          </div>
        )}
      </div>

      {/* Step 2: Time */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-orange-300 text-neutral-950 text-[10px] font-mono font-bold flex items-center justify-center">2</span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">Choose a session hour</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {restaurant.popularTimeSlots.map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => setSelectedTime(slot)}
              className={`py-2.5 rounded-lg font-mono text-[11px] uppercase border transition-all ${
                selectedTime === slot
                  ? 'bg-orange-300 border-orange-300 text-neutral-950 font-bold shadow-[0_0_12px_rgba(249,185,93,0.2)]'
                  : 'bg-[#070707] border-[#2a241f] text-neutral-400 hover:border-neutral-600 hover:text-white'
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      {/* Step 3: Party */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-orange-300 text-neutral-950 text-[10px] font-mono font-bold flex items-center justify-center">3</span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">Party size</span>
        </div>
        <div className="flex justify-between items-center bg-[#070707] border border-[#2a241f] p-3 rounded-lg font-mono text-sm">
          <button
            type="button"
            onClick={() => setPartySize((prev) => Math.max(1, prev - 1))}
            className="w-9 h-9 rounded-lg hover:bg-neutral-900 text-neutral-300 font-bold border border-[#362f2c] transition-colors"
          >
            −
          </button>
          <span className="font-bold text-[#fffaf5]">{partySize} Guest{partySize > 1 ? 's' : ''}</span>
          <button
            type="button"
            onClick={() => setPartySize((prev) => Math.min(10, prev + 1))}
            className="w-9 h-9 rounded-lg hover:bg-neutral-900 text-neutral-300 font-bold border border-[#362f2c] transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Step 4: Notes */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-full bg-neutral-800 text-neutral-400 text-[10px] font-mono font-bold flex items-center justify-center">4</span>
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">Special requests (optional)</span>
        </div>
        <textarea
          value={guestNotes}
          onChange={(e) => setGuestNotes(e.target.value)}
          placeholder="Allergies, window seat, anniversary..."
          rows={2}
          className="w-full bg-[#070707] border border-[#2a241f] px-4 py-3 text-xs text-neutral-100 rounded-lg focus:outline-none focus:border-orange-300/40 placeholder-neutral-600 font-sans leading-relaxed resize-none"
        />
      </div>

      {/* Receipt preview */}
      <motion.div
        layout
        className="p-4 rounded-xl border border-[#362f2c] bg-[#070707]/80 space-y-2.5 font-mono text-[10px] uppercase tracking-wider"
      >
        <div className="flex items-center gap-2 text-orange-200 pb-2 border-b border-[#2a241f]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Reservation preview</span>
        </div>
        <div className="flex justify-between text-neutral-500">
          <span>Salon</span>
          <span className="text-neutral-200 font-bold truncate max-w-[55%] text-right">{restaurant.name}</span>
        </div>
        <div className="flex justify-between text-neutral-500">
          <span>When</span>
          <span className="text-neutral-200">{selectedDate.full} at {summary.time}</span>
        </div>
        <div className="flex justify-between text-neutral-500">
          <span>Covers</span>
          <span className="text-orange-300 font-bold">{summary.party} pax</span>
        </div>
      </motion.div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-4 bg-gradient-to-r from-[#b76524] via-[#d08d36] to-[#f4cb79] hover:from-[#c77129] hover:via-[#dc9b47] hover:to-[#f8dd93] text-[#231a14] font-mono tracking-widest text-xs uppercase rounded-lg font-bold shadow-[0_0_20px_rgba(249,185,93,0.15)] hover:shadow-[0_0_28px_rgba(249,185,93,0.28)] flex justify-center items-center gap-2 disabled:opacity-60 transition-all active:scale-[0.99]"
      >
        <span>{submitting ? 'Securing your table...' : 'Confirm Reservation'}</span>
        <ChevronRight className="w-4 h-4 stroke-[2.5]" />
      </button>
    </form>
  );
}
