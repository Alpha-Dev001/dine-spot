import React, { useEffect, useMemo, useState } from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'motion/react';
import {
  BarChart3, Users, Clock, DollarSign, Search, Plus, Play, LogOut, CheckCircle2, AlertCircle, Sparkles, ChefHat, LayoutGrid, CalendarRange, FileSpreadsheet, UserPlus, Sliders, Settings, RefreshCw, X, ArrowUpRight
} from 'lucide-react';
import { Booking, LiveActivity } from '../types';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DashboardProps {
  establishmentName: string;
  bookings: Booking[];
  activities: LiveActivity[];
  onAddBooking: (booking: Booking) => void;
  onUpdateBookingStatus: (id: string, newStatus: 'seated' | 'confirmed' | 'arriving' | 'canceled') => void;
  onLogout: () => void;
}

export default function DashboardView({
  establishmentName, bookings, activities, onAddBooking, onUpdateBookingStatus, onLogout
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'reservations' | 'insights' | 'builder' | 'rules'>('overview');
  const [newBookingModalOpen, setNewBookingModalOpen] = useState(false);
  const [simulatedActivities, setSimulatedActivities] = useState<LiveActivity[]>(activities);

  useEffect(() => {
    setSimulatedActivities(activities);
  }, [activities]);

  // Form State for new booking
  const [guestName, setGuestName] = useState('');
  const [partySize, setPartySize] = useState(2);
  const [selectedTable, setSelectedTable] = useState('03');
  const [timeSlot, setTimeSlot] = useState('20:00');
  const [notes, setNotes] = useState('');

  // Global search query
  const [searchQuery, setSearchQuery] = useState('');

  // Highlight effect state for simulation
  const [flashSimulated, setFlashSimulated] = useState(false);

  // Handle local database of activities simulation
  const triggerSimulation = () => {
    setFlashSimulated(true);
    setTimeout(() => setFlashSimulated(false), 800);

    const simulationPool = [
      {
        id: 's_' + Date.now(),
        type: 'booking' as const,
        message: 'Direct API Web connection: Guest Leonardo DiCaprio requested VIP bar booking.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        latency: '3.1ms',
        category: 'success' as const
      },
      {
        id: 's_' + Date.now(),
        type: 'attendance' as const,
        message: 'FOH Smart terminal: Guest Sarah Connor marked as ARRIVED at secure check-in point.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        latency: '0.4ms',
        category: 'info' as const
      },
      {
        id: 's_' + Date.now(),
        type: 'system' as const,
        message: 'Alert: Induction cooktop stove #4 achieved operational target temp (+310.4°C).',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        latency: '15ms',
        category: 'success' as const
      }
    ];

    const randomEvent = simulationPool[Math.floor(Math.random() * simulationPool.length)];
    setSimulatedActivities(prev => [randomEvent, ...prev].slice(0, 10));
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName) return;

    const newBooking: Booking = {
      id: 'b_' + Date.now(),
      guestName,
      covers: partySize,
      tableNo: selectedTable,
      time: timeSlot,
      status: 'confirmed',
      specialNotes: notes,
      email: `${guestName.toLowerCase().replace(/\s+/g, '')}@tableau.com`
    };

    onAddBooking(newBooking);

    // Also inject custom activity message
    const newActivity: LiveActivity = {
      id: 'act_' + Date.now(),
      type: 'booking',
      message: `Manual check-in added: ${guestName} (Party of ${partySize}) scheduled for table ${selectedTable}.`,
      timestamp: 'Just now',
      latency: '0.5ms',
      category: 'success'
    };
    setSimulatedActivities(prev => [newActivity, ...prev]);

    // Reset Form
    setGuestName('');
    setPartySize(2);
    setSelectedTable('03');
    setTimeSlot('20:00');
    setNotes('');
    setNewBookingModalOpen(false);
  };

  // Filter logic on bookings list based on search bar
  const filteredBookings = bookings.filter(b =>
    b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.tableNo.includes(searchQuery) ||
    b.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const bookingAnalytics = useMemo(() => {
    const revenuePerCover = 145;
    const totalCovers = bookings.reduce((sum, booking) => sum + booking.covers, 0);
    const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.covers * revenuePerCover), 0);

    const hourlyBuckets = new Map<string, { revenue: number; volume: number }>();
    bookings.forEach((booking) => {
      const hour = booking.time.split(':')[0].padStart(2, '0');
      const bucket = `${hour}:00`;
      const current = hourlyBuckets.get(bucket) || { revenue: 0, volume: 0 };
      hourlyBuckets.set(bucket, {
        revenue: current.revenue + (booking.covers * revenuePerCover),
        volume: current.volume + 1
      });
    });

    const sortedLabels = Array.from(hourlyBuckets.keys()).sort((a, b) => Number(a.split(':')[0]) - Number(b.split(':')[0]));
    const revenueByHour = sortedLabels.map((label) => hourlyBuckets.get(label)?.revenue ?? 0);
    const volumeByHour = sortedLabels.map((label) => hourlyBuckets.get(label)?.volume ?? 0);

    const statusCounts = ['seated', 'confirmed', 'arriving', 'canceled'].map((status) =>
      bookings.filter((booking) => booking.status === status).length
    );

    const seatedCount = bookings.filter((booking) => booking.status === 'seated').length;
    const occupancyPercentage = bookings.length ? Math.round((seatedCount / bookings.length) * 100) : 0;
    const avgOrderValue = totalCovers ? Math.round(totalRevenue / totalCovers) : 0;
    const remainingPrioritySlots = Math.max(0, 12 - seatedCount);

    return {
      totalRevenue,
      avgOrderValue,
      totalCovers,
      occupancyPercentage,
      remainingPrioritySlots,
      hourlyLabels: sortedLabels,
      revenueByHour,
      volumeByHour,
      statusCounts,
      statusLabels: ['Seated', 'Confirmed', 'Arriving', 'Canceled']
    };
  }, [bookings]);

  const revenueChartData = {
    labels: bookingAnalytics.hourlyLabels,
    datasets: [
      {
        label: 'Revenue',
        data: bookingAnalytics.revenueByHour,
        borderColor: '#f9b95d',
        backgroundColor: 'rgba(249, 185, 93, 0.18)',
        fill: true,
        tension: 0.38,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#ffc56b',
        pointBorderColor: '#1f1a19',
        pointBorderWidth: 2,
      }
    ]
  };

  const revenueChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context: { parsed: { y: number } }) => `Revenue: $${context.parsed.y.toLocaleString('en-US')}`
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255,255,255,0.06)',
          drawBorder: false,
        },
        ticks: {
          color: '#a38d7d',
          font: {
            size: 9,
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(255,255,255,0.06)',
          drawBorder: false,
        },
        ticks: {
          color: '#a38d7d',
          font: {
            size: 9,
          },
          callback: (value: number | string) => `$${Number(value).toLocaleString('en-US')}`
        }
      }
    }
  };

  const bookingMixData = {
    labels: bookingAnalytics.statusLabels,
    datasets: [
      {
        data: bookingAnalytics.statusCounts,
        backgroundColor: ['#22c55e', '#fb923c', '#fb7185', '#9ca3af'],
        borderColor: ['#050505', '#050505', '#050505', '#050505'],
        borderWidth: 2,
        hoverOffset: 6,
      }
    ]
  };

  const bookingMixOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '68%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context: { label: string; parsed: number }) => `${context.label}: ${context.parsed} reservations`
        }
      }
    }
  };

  return (
    <div id="dashboard-root" className="min-h-screen p-3 bg-[radial-gradient(circle_at_top,#241d1a_0%,#070707_44%,#020202_100%)] text-[#fffaf4] font-sans">
      <div className="h-[calc(100vh-1.5rem)] overflow-hidden rounded-[30px] border border-white/5 bg-[#050505]/70 backdrop-blur-xl shadow-[0_30px_120px_-35px_rgba(0,0,0,0.95)] flex">

      {/* SIDEBAR NAVIGATION GRID */}
      <aside className="hidden lg:flex my-4 ml-4 h-[calc(100%-2rem)] flex-col justify-between w-72 rounded-[26px] border border-[#2b241f]/70 bg-[#070707]/70 backdrop-blur-xl p-6 shrink-0 z-20 overflow-hidden shadow-[0_25px_80px_-35px_rgba(0,0,0,0.95)]">
        <div className="space-y-8">
          <div className="flex items-center space-x-3">
            <img src="/favicon.svg" alt="Tableau" className="w-8 h-8" />
            <span className="font-serif text-lg font-light text-orange-300">T A B L E A U</span>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <span className="font-mono text-[9px] tracking-widest text-neutral-600 uppercase block pl-2.5">Management</span>

              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center space-x-3 text-xs font-mono uppercase tracking-widest px-3 py-3 rounded-md transition-all text-left ${activeTab === 'overview' ? 'bg-orange-300 text-[#251b14] font-bold' : 'text-[#a38d7d] hover:text-[#fffaf5] hover:bg-[#14110f]'}`}
              >
                <LayoutGrid className="w-4 h-4 shrink-0" />
                <span>Overview Grid</span>
              </button>

              <button
                onClick={() => setActiveTab('reservations')}
                className={`w-full flex items-center space-x-3 text-xs font-mono uppercase tracking-widest px-3 py-3 rounded-md transition-all text-left ${activeTab === 'reservations' ? 'bg-orange-300 text-[#251b14] font-bold' : 'text-[#a38d7d] hover:text-[#fffaf5] hover:bg-[#14110f]'}`}
              >
                <CalendarRange className="w-4 h-4 shrink-0" />
                <span>Reservations</span>
              </button>

              <button
                onClick={() => setActiveTab('insights')}
                className={`w-full flex items-center space-x-3 text-xs font-mono uppercase tracking-widest px-3 py-3 rounded-md transition-all text-left ${activeTab === 'insights' ? 'bg-orange-300 text-[#251b14] font-bold' : 'text-[#a38d7d] hover:text-[#fffaf5] hover:bg-[#14110f]'}`}
              >
                <FileSpreadsheet className="w-4 h-4 shrink-0" />
                <span>System Insights</span>
              </button>
            </div>

            <div className="space-y-1.5">
              <span className="font-mono text-[9px] tracking-widest text-neutral-600 uppercase block pl-2.5">Configuration</span>
              <button
                onClick={() => setActiveTab('builder')}
                className={`w-full flex items-center space-x-3 text-xs font-mono uppercase tracking-widest px-3 py-2 text-left transition-all rounded-md ${activeTab === 'builder' ? 'bg-orange-300 text-[#251b14] font-bold' : 'text-neutral-500 hover:text-neutral-300 hover:bg-[#14110f]'}`}
              >
                <Sliders className="w-3.5 h-3.5 shrink-0" />
                <span>Floor Builder</span>
              </button>
              <button
                onClick={() => setActiveTab('rules')}
                className={`w-full flex items-center space-x-3 text-xs font-mono uppercase tracking-widest px-3 py-2 text-left transition-all rounded-md ${activeTab === 'rules' ? 'bg-orange-300 text-[#251b14] font-bold' : 'text-neutral-500 hover:text-neutral-300 hover:bg-[#14110f]'}`}
              >
                <Settings className="w-3.5 h-3.5 shrink-0" />
                <span>System Rules</span>
              </button>
            </div>
          </div>
        </div>

        {/* Support details & Logout */}
        <div className="space-y-4">
          <div className="p-3 bg-neutral-900/40 rounded border border-neutral-900 text-[10px] font-mono leading-relaxed text-neutral-500">
            <span>Server Active Node</span>
            <span className="text-orange-200 block mt-1 font-bold">● CLOUD-HOSTED_PRO_EAST</span>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 py-3 bg-neutral-900 hover:bg-red-950/20 border border-neutral-900 hover:border-red-500/20 text-neutral-400 hover:text-red-400 text-xs font-mono tracking-widest uppercase rounded transition-all duration-300"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Terminate session</span>
          </button>
        </div>
      </aside>

      {/* PRIMARY CONTROLLER REGION */}
      <div className="m-4 lg:m-0 lg:my-4 lg:mr-4 flex-1 flex flex-col min-w-0 overflow-y-auto rounded-[26px] bg-[#030303]/25">

        {/* TOP COMMAND BAR HEADER */}
        <header className="mx-4 mt-4 px-4 sm:px-6 py-4 rounded-[22px] border border-[#2b241f]/60 bg-[#070707]/70 backdrop-blur-xl shadow-[0_20px_60px_-32px_rgba(0,0,0,0.95)] flex flex-col sm:flex-row gap-4 justify-between items-center sticky top-3 z-10">

          <div className="flex items-center space-x-3.5 w-full sm:w-auto">
            {/* Mobile/tablet Title fallback badge */}
            <img src="/favicon.svg" alt="Tableau" className="lg:hidden w-7 h-7" />
            <span className="lg:hidden font-serif text-md tracking-wider text-orange-300 mr-2">T A B L E A U</span>
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 bg-orange-400/10 border border-orange-300/20 text-orange-300 text-[10px] font-mono tracking-widest uppercase rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-300 animate-pulse" />
              <span>LIVE: DINNER SERVICE</span>
            </div>
            <span className="text-neutral-400 text-sm font-serif font-light hidden sm:inline">{establishmentName}</span>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
            {/* Global Search Interface */}
            <div className="relative flex-1 sm:w-64 max-w-xs">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Global Search Ctrl+K..."
                className="w-full bg-[#11100f] text-xs border border-[#3b2d27] hover:border-[#5a3b29] focus:border-orange-300/40 font-mono pl-8 pr-3 py-2 rounded focus:outline-none placeholder-[#785f4a] transition-colors"
              />
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-neutral-650" />
            </div>

            {/* Simulated Live trigger button */}
            <button
              onClick={triggerSimulation}
              title="Simulate active incoming API booking"
              className={`p-2 bg-[#11100f] hover:bg-[#1a1715] border border-[#3a2d27] text-[#bda59d] hover:text-orange-300 rounded transition-all ${flashSimulated ? 'bg-orange-400/10 border-orange-300/60 text-orange-200 scale-95' : ''}`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Launch new manual booking modal button */}
            <button
              id="new-booking-btn"
              onClick={() => setNewBookingModalOpen(true)}
              className="px-4 py-2 bg-linear-to-r from-[#b76524] via-[#d08d36] to-[#f4cb79] hover:from-[#c77129] hover:via-[#dc9b47] hover:to-[#f8dd93] text-[#231a14] font-mono tracking-widest text-[10px] uppercase font-bold rounded flex items-center space-x-1.5 shadow-[0_0_12px_rgba(251,146,60,0.24)] transform active:scale-95 duration-200"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Booking</span>
            </button>
          </div>
        </header>

        {/* MOBILE NAVIGATION TABS (Visible only < lg) */}
        <div className="lg:hidden mx-4 mt-4 overflow-x-auto scrollbar-none rounded-xl border border-[#2b241f]/60 bg-[#070707]/70 backdrop-blur-xl shrink-0">
          <div className="flex px-2 py-2 gap-2 min-w-max">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest px-3 py-2 rounded-md transition-all ${activeTab === 'overview' ? 'bg-orange-300 text-[#251b14] font-bold' : 'text-[#a38d7d] hover:text-[#fffaf5] hover:bg-[#14110f]'}`}
            >
              <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveTab('reservations')}
              className={`flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest px-3 py-2 rounded-md transition-all ${activeTab === 'reservations' ? 'bg-orange-300 text-[#251b14] font-bold' : 'text-[#a38d7d] hover:text-[#fffaf5] hover:bg-[#14110f]'}`}
            >
              <CalendarRange className="w-3.5 h-3.5 shrink-0" />
              <span>Reservations</span>
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest px-3 py-2 rounded-md transition-all ${activeTab === 'insights' ? 'bg-orange-300 text-[#251b14] font-bold' : 'text-[#a38d7d] hover:text-[#fffaf5] hover:bg-[#14110f]'}`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 shrink-0" />
              <span>Insights</span>
            </button>
            <button
              onClick={() => setActiveTab('builder')}
              className={`flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest px-3 py-2 rounded-md transition-all ${activeTab === 'builder' ? 'bg-orange-300 text-[#251b14] font-bold' : 'text-[#a38d7d] hover:text-[#fffaf5] hover:bg-[#14110f]'}`}
            >
              <Sliders className="w-3.5 h-3.5 shrink-0" />
              <span>Builder</span>
            </button>
            <button
              onClick={() => setActiveTab('rules')}
              className={`flex items-center space-x-2 text-[10px] font-mono uppercase tracking-widest px-3 py-2 rounded-md transition-all ${activeTab === 'rules' ? 'bg-orange-300 text-[#251b14] font-bold' : 'text-[#a38d7d] hover:text-[#fffaf5] hover:bg-[#14110f]'}`}
            >
              <Settings className="w-3.5 h-3.5 shrink-0" />
              <span>Rules</span>
            </button>
          </div>
        </div>

        {/* DYNAMIC VIEW SHEETS */}
        <main className="p-4 sm:p-6 space-y-6 sm:space-y-8 max-w-7xl w-full mx-auto">

          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="tab-overview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8"
              >

                {/* 4 OPERATIONAL KPI WIDGETS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {[
                    { title: "Calculated Revenue", value: `$${bookingAnalytics.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: <DollarSign className="w-4 h-4 text-emerald-400" />, sub: `${bookingAnalytics.totalCovers} covers fueled from live bookings` },
                    { title: "Reservations Count", value: String(bookings.length), icon: <CalendarRange className="w-4 h-4 text-orange-300" />, sub: "Real-time reservation ledger" },
                    { title: "Occupancy Index", value: `${bookingAnalytics.occupancyPercentage}%`, icon: <Clock className="w-4 h-4 text-rose-400" />, sub: `${bookingAnalytics.remainingPrioritySlots} priority slots remain` },
                    { title: "Avg Order Value", value: `$${bookingAnalytics.avgOrderValue.toFixed(0)}`, icon: <Users className="w-4 h-4 text-[#f4cb79]" />, sub: "Value derived from booking mix" }
                  ].map((kpi, i) => (
                    <div key={i} className="p-5 bg-[#0f0d0c]/85 border border-[#302923]/70 rounded-xl hover:border-orange-300/20 transition-colors shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-mono tracking-widest text-[#bfa08b] uppercase">{kpi.title}</span>
                        {kpi.icon}
                      </div>
                      <div className="font-serif text-xl sm:text-2xl text-[#fffaf5] font-light mt-1 tracking-tight">{kpi.value}</div>
                      <div className="text-[9px] font-mono text-[#8f796d] mt-2">{kpi.sub}</div>
                    </div>
                  ))}
                </div>

                {/* VISUAL ANALYTICS PANEL: NATIVE INTERACTIVE CHARTS */}
                <div className="grid lg:grid-cols-12 gap-6">

                  {/* Revenue Outlook Trend Chart */}
                  <div className="lg:col-span-8 p-6 bg-[#0f0d0c]/85 border border-[#302923]/70 rounded-xl space-y-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-mono text-[9px] tracking-widest text-orange-300 uppercase">Service telemetry</span>
                        <h3 className="font-serif text-md tracking-wide font-light text-[#fffaf5] mt-0.5">Revenue Outlook Timeline (USD)</h3>
                      </div>
                      <span className="text-[10px] bg-[#070707] border border-[#3a2f29] text-[#bfa08b] px-2 py-1 rounded font-mono">Live hourly check</span>
                    </div>

                    <div className="h-60 w-full">
                      <Line data={revenueChartData} options={revenueChartOptions} />
                    </div>
                  </div>

                  {/* Booking Channels Source Mix */}
                  <div className="lg:col-span-4 p-6 bg-[#0f0d0c]/85 border border-[#302923]/70 rounded-xl flex flex-col justify-between shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
                    <div>
                      <span className="font-mono text-[9px] tracking-widest text-orange-300 uppercase">Telemetry mix</span>
                      <h3 className="font-serif text-md tracking-wide font-light text-[#fffaf5] mt-0.5">Reservation Status Mix</h3>
                    </div>

                    <div className="flex justify-center items-center py-4 h-48 relative">
                      <div className="w-36 h-36">
                        <Doughnut data={bookingMixData} options={bookingMixOptions} />
                      </div>

                      <div className="absolute inset-x-0 text-center flex flex-col items-center pointer-events-none">
                        <span className="text-xl font-serif text-[#fffaf5]">{bookings.length}</span>
                        <span className="text-[7px] font-mono uppercase tracking-widest text-[#a38d7d]">reservations</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 font-mono text-[9px] text-[#d9c2b2] mt-2 uppercase">
                      {bookingAnalytics.statusLabels.map((label, index) => (
                        <div key={label} className="p-2 border border-[#362f2c] rounded bg-[#070707]/80 flex items-center gap-2">
                          <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: ['#22c55e', '#fb923c', '#fb7185', '#9ca3af'][index] }} />
                          <span>{label} ({bookingAnalytics.statusCounts[index]})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* ROW 3: TODAY'S TABLE LOG AND LIVE ACTIVITIES STREAM */}
                <div className="grid lg:grid-cols-12 gap-6">

                  {/* Today's Table Log Table */}
                  <div className="lg:col-span-8 p-6 bg-[#0f0d0c]/85 border border-[#302923]/70 rounded-xl space-y-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
                    <div className="flex justify-between items-center border-b border-[#362f2c] pb-4">
                      <div>
                        <span className="font-mono text-[9px] tracking-widest text-orange-300 uppercase">FOH Desk controls</span>
                        <h3 className="font-serif text-lg tracking-wide font-light text-[#fffaf5] mt-0.5">Today's Table Log</h3>
                      </div>
                      <span className="text-[9px] font-mono text-[#d8c2b6] bg-[#070707] px-2 py-1 rounded border border-[#3a2f29]">{filteredBookings.length} Active Slots</span>
                    </div>

                    <div className="overflow-x-auto min-h-75">
                      <table className="w-full text-left font-sans">
                        <thead>
                          <tr className="border-b border-neutral-900 font-mono text-[9px] tracking-widest text-neutral-500 uppercase">
                            <th className="py-2.5">Guest</th>
                            <th className="py-2.5">Table No</th>
                            <th className="py-2.5">Time</th>
                            <th className="py-2.5">Covers</th>
                            <th className="py-2.5">Status Check</th>
                            <th className="py-2.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-900/50 text-xs font-light">
                          {filteredBookings.map((b) => (
                            <tr key={b.id} className="hover:bg-neutral-900/10 transition-colors">
                              <td className="py-3.5">
                                <div className="font-medium text-neutral-200">{b.guestName}</div>
                                {b.specialNotes && (
                                  <div className="text-[9px] font-mono text-orange-200/80 mt-1 line-clamp-1 italic max-w-xs">{b.specialNotes}</div>
                                )}
                              </td>
                              <td className="py-3.5 italic font-serif text-orange-200">Grid {b.tableNo}</td>
                              <td className="py-3.5 font-mono">{b.time}</td>
                              <td className="py-3.5 font-mono">{b.covers} Pax</td>
                              <td className="py-3.5 font-mono">
                                <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${b.status === 'seated' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : b.status === 'confirmed' ? 'bg-orange-400/10 text-orange-200 border border-orange-300/20' : b.status === 'arriving' ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20' : 'bg-[#171311] text-[#9f8f82]'}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${b.status === 'seated' ? 'bg-emerald-400' : b.status === 'confirmed' ? 'bg-orange-300' : b.status === 'arriving' ? 'bg-rose-400' : 'bg-[#a38d7d]'}`} />
                                  <span>{b.status}</span>
                                </span>
                              </td>
                              <td className="py-3.5 text-right font-mono text-[10px]">
                                <select
                                  value={b.status}
                                  onChange={(e) => onUpdateBookingStatus(b.id, e.target.value as any)}
                                  className="bg-neutral-950 border border-neutral-850 hover:border-neutral-700 text-[10px] py-1 px-2 focus:outline-none rounded text-neutral-300 tracking-wide"
                                >
                                  <option value="arriving">Arriving</option>
                                  <option value="confirmed">Confirmed</option>
                                  <option value="seated">Seated</option>
                                  <option value="canceled">Canceled</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                          {filteredBookings.length === 0 && (
                            <tr>
                              <td colSpan={6} className="text-center py-12 text-neutral-600 font-mono text-xs">
                                No matching reservations detected on live grid indexes.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Live Activity Feed */}
                  <div className="lg:col-span-4 p-6 bg-[#0f0d0c]/85 border border-[#302923]/70 rounded-xl flex flex-col justify-between shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center border-b border-[#362f2c] pb-4">
                        <div>
                          <span className="font-mono text-[9px] tracking-widest text-orange-300 uppercase">Server Ticker</span>
                          <h3 className="font-serif text-lg tracking-wide font-light text-[#fffaf5] mt-0.5">Live Activity Feed</h3>
                        </div>
                        <span className="w-2.5 h-2.5 rounded-full bg-orange-300 animate-ping" />
                      </div>

                      <div className="space-y-3.5 overflow-y-auto max-h-85 pr-1 scrollbar-thin">
                        {simulatedActivities.map((act) => (
                          <div key={act.id} className="p-3 bg-[#070707]/90 rounded border border-[#2a241f] hover:border-orange-200/20 transition-colors space-y-2">
                            <div className="flex justify-between text-[8px] font-mono tracking-widest uppercase">
                              <span className={`${act.type === 'booking' ? 'text-orange-200' : act.type === 'attendance' ? 'text-rose-300' : act.type === 'review' ? 'text-emerald-300' : 'text-[#9b8a80]'}`}>{act.type} event</span>
                              <span className="text-[#857267]">{act.timestamp}</span>
                            </div>
                            <p className="text-[11px] font-light leading-relaxed text-neutral-350">{act.message}</p>
                            {act.latency && (
                              <div className="flex justify-between items-center pt-1 text-[8px] font-mono label text-neutral-600 uppercase">
                                <span>GRID_TELEMETRY_LATENCY</span>
                                <span className="text-neutral-500">{act.latency}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

              </motion.div>
            )}

            {activeTab === 'reservations' && (
              <motion.div
                key="tab-reservations"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 bg-neutral-900/30 border border-neutral-900 rounded-xl space-y-6"
              >
                <div className="flex justify-between items-center pb-4 border-b border-[#302923]">
                  <div className="space-y-1">
                    <span className="font-mono text-[9px] tracking-widest text-orange-300 uppercase">Direct Booking Register</span>
                    <h2 className="font-serif text-2xl font-light tracking-tight text-[#fffaf5]">Synchronized Bookings Grid</h2>
                  </div>
                  <button
                    onClick={() => setNewBookingModalOpen(true)}
                    className="px-4 py-2 bg-linear-to-r from-[#b76524] via-[#d08d36] to-[#f4cb79] hover:from-[#c77129] hover:via-[#dc9b47] hover:to-[#f8dd93] text-[#231a14] font-mono tracking-widest text-[10px] uppercase font-bold rounded flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Custom reservation</span>
                  </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bookings.map((b) => (
                    <div key={b.id} className="p-5 bg-[#0f0d0c]/85 rounded border border-[#302923]/70 hover:border-orange-300/20 transition-all space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-serif text-lg font-light text-neutral-200">{b.guestName}</div>
                          <div className="text-[10px] font-mono text-neutral-500 uppercase mt-0.5">{b.email || 'guest@tableau.com'}</div>
                        </div>
                        <span className={`px-2.5 py-1 text-[8px] font-mono font-bold uppercase rounded border tracking-wider ${b.status === 'seated' ? 'border-emerald-500/30 text-emerald-300 bg-emerald-500/5' : 'border-orange-300/30 text-orange-200 bg-orange-400/5'}`}>
                          {b.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 font-mono text-[10px] text-neutral-400 text-center uppercase">
                        <div className="p-2 bg-neutral-900/50 rounded">
                          <div className="text-neutral-500 text-[8px]">Table</div>
                          <div className="text-orange-200 font-bold mt-1">Grid {b.tableNo}</div>
                        </div>
                        <div className="p-2 bg-neutral-900/50 rounded">
                          <div className="text-neutral-500 text-[8px]">Time</div>
                          <div className="text-neutral-200 font-bold mt-1">{b.time}</div>
                        </div>
                        <div className="p-2 bg-neutral-900/50 rounded">
                          <div className="text-neutral-500 text-[8px]">Covers</div>
                          <div className="text-neutral-200 font-bold mt-1">{b.covers} Pax</div>
                        </div>
                      </div>

                      {b.specialNotes && (
                        <div className="p-3 bg-neutral-900/30 rounded border border-neutral-900 font-mono text-[9px] text-neutral-500">
                          <div className="uppercase tracking-widest mb-1 font-bold text-neutral-455">Guest Alert Notes</div>
                          <p className="font-light italic line-clamp-2">"{b.specialNotes}"</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'insights' && (
              <motion.div
                key="tab-insights"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 bg-neutral-900/40 border border-neutral-900 rounded-lg space-y-6"
              >
                <div className="pb-4 border-b border-[#362f2c]">
                  <span className="font-mono text-[9px] tracking-widest text-orange-300 uppercase">Statistical calibration</span>
                  <h2 className="font-serif text-2xl font-light tracking-tight text-[#fffaf5] mt-1">Hospitality Performance Analytics</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="p-6 bg-[#0f0d0c]/80 rounded border border-[#302923]/70 space-y-4">
                    <h3 className="font-serif text-lg font-light text-[#fffaf5] flex justify-between items-center">
                      <span>Course pacing duration</span>
                      <ArrowUpRight className="w-4 h-4 text-orange-300" />
                    </h3>
                    <p className="text-xs text-[#bfa08b] font-light leading-relaxed">
                      Average kitchen delivery sequence duration clocks at <span className="font-mono font-bold text-orange-200">14.2 minutes</span> per individual course. Table occupancy remains optimized.
                    </p>
                    <div className="space-y-2 font-mono text-[10px] uppercase text-neutral-400">
                      <div className="flex justify-between">
                        <span>Amuse-Bouche</span>
                        <span>4.1 mins</span>
                      </div>
                      <div className="w-full bg-neutral-9D h-1 rounded-full overflow-hidden">
                        <div className="bg-orange-300 h-full w-[35%]" />
                      </div>
                      <div className="flex justify-between">
                        <span>Tasting Entree</span>
                        <span>12.8 mins</span>
                      </div>
                      <div className="w-full bg-neutral-9D h-1 rounded-full overflow-hidden">
                        <div className="bg-orange-300 h-full w-[80%]" />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-neutral-950 rounded border border-neutral-900 space-y-4">
                    <h3 className="font-serif text-lg font-light text-neutral-200">Wine Cellar Temperature telemetry</h3>
                    <p className="text-xs text-neutral-400 font-light leading-relaxed">
                      All sensory corridors are aligned. Cellar storage metrics are stabilized at target requirements.
                    </p>
                    <div className="grid grid-cols-2 gap-4 font-mono text-center text-xs">
                      <div className="p-3 bg-neutral-900 rounded">
                        <div className="text-neutral-500 text-[8px] uppercase tracking-wider">Aisle 1 (Bordeaux Red)</div>
                        <div className="font-serif text-lg font-light text-neutral-200 mt-1">14.2°C</div>
                      </div>
                      <div className="p-3 bg-neutral-900 rounded">
                        <div className="text-neutral-500 text-[8px] uppercase tracking-wider">Aisle 4 (Champagne White)</div>
                        <div className="font-serif text-lg font-light text-neutral-100 mt-1">8.5°C</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'builder' && (
              <motion.div
                key="tab-builder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 bg-neutral-900/40 border border-neutral-900 rounded-lg space-y-6"
              >
                <div className="flex justify-between items-start border-b border-[#362f2c] pb-4">
                  <div className="space-y-1">
                    <span className="font-mono text-[9px] tracking-widest text-orange-300 uppercase">Layout Authoring</span>
                    <h2 className="font-serif text-2xl font-light tracking-tight text-[#fffaf5] mt-1">Floor Builder Workspace</h2>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-orange-300/10 border border-orange-300/20 text-orange-200 text-[9px] font-mono uppercase tracking-widest">Live edits enabled</span>
                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
                  {[
                    { label: 'Grid canvas', value: '12 x 8', accent: 'text-orange-200' },
                    { label: 'Preset layouts', value: '4 active', accent: 'text-[#fffaf5]' },
                    { label: 'Anchor zones', value: '6 mapped', accent: 'text-emerald-300' },
                    { label: 'Table density', value: '92%', accent: 'text-[#f4cb79]' }
                  ].map((item) => (
                    <div key={item.label} className="p-4 bg-[#0f0d0c]/85 rounded border border-[#302923]/70">
                      <div className="text-[8px] font-mono uppercase tracking-widest text-neutral-500">{item.label}</div>
                      <div className={`font-serif text-xl mt-2 ${item.accent}`}>{item.value}</div>
                    </div>
                  ))}
                </div>

                <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-6">
                  <div className="p-6 bg-[#0f0d0c]/85 rounded border border-[#302923]/70">
                    <div className="flex justify-between items-center pb-4 border-b border-[#302923]">
                      <div>
                        <span className="font-mono text-[9px] tracking-widest text-orange-300 uppercase">Live plan canvas</span>
                        <h3 className="font-serif text-lg font-light text-[#fffaf5] mt-1">Dining room grid</h3>
                      </div>
                      <span className="text-[9px] font-mono text-[#bfa08b] bg-[#070707] px-2 py-1 rounded border border-[#3a2f29]">Interactive preview</span>
                    </div>

                    <div className="mt-4 rounded-lg border border-[#2a241f] bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] p-3 min-h-64">
                      <div className="grid grid-cols-12 gap-2">
                        {Array.from({ length: 24 }).map((_, index) => (
                          <div key={index} className="aspect-square rounded bg-[#151210]/80 border border-[#2f2722]" />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-5 bg-[#0f0d0c]/85 rounded border border-[#302923]/70">
                      <div className="flex items-center gap-2 text-orange-200 text-[10px] font-mono uppercase tracking-widest"><CheckCircle2 className="w-4 h-4" /> Builder checklist</div>
                      <ul className="mt-4 space-y-2 text-xs text-neutral-300">
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> Reservation nodes linked to table clusters</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> Vip seating zones locked to primary service path</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> Live sensor overlays synced with headcount data</li>
                      </ul>
                    </div>

                    <div className="p-5 bg-[#0f0d0c]/85 rounded border border-[#302923]/70">
                      <div className="flex items-center gap-2 text-[#f4cb79] text-[10px] font-mono uppercase tracking-widest"><AlertCircle className="w-4 h-4" /> Active maintenance</div>
                      <p className="mt-3 text-xs text-neutral-300 leading-relaxed">Approach lane optimization is currently flagged for review. Table boundaries are stable, but bar corridor spacing needs one adjustment before service-wide sync.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'rules' && (
              <motion.div
                key="tab-rules"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-8 bg-neutral-900/40 border border-neutral-900 rounded-lg space-y-6"
              >
                <div className="flex justify-between items-start border-b border-[#362f2c] pb-4">
                  <div className="space-y-1">
                    <span className="font-mono text-[9px] tracking-widest text-orange-300 uppercase">System Control</span>
                    <h2 className="font-serif text-2xl font-light tracking-tight text-[#fffaf5] mt-1">System Rules & Automation</h2>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/20 text-emerald-200 text-[9px] font-mono uppercase tracking-widest">Rule engine online</span>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 bg-[#0f0d0c]/85 rounded border border-[#302923]/70 space-y-4">
                    <div className="flex items-center gap-2 text-orange-200 text-[10px] font-mono uppercase tracking-widest"><Sparkles className="w-4 h-4" /> Automation rules</div>
                    <div className="space-y-3">
                      {[
                        ['VIP hold priority', 'High priority holdings are preserved before walk-ins.'],
                        ['Late arrival buffer', 'Tables release automatically after a 15-minute grace window.'],
                        ['Service pacing', 'Kitchen prep windows are elevated when demand spikes.']
                      ].map(([title, desc]) => (
                        <div key={title} className="p-3 bg-[#070707]/90 rounded border border-[#2a241f]">
                          <div className="font-mono text-[10px] uppercase tracking-widest text-orange-200">{title}</div>
                          <p className="text-xs text-neutral-300 mt-1">{desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 bg-[#0f0d0c]/85 rounded border border-[#302923]/70 space-y-4">
                    <div className="flex items-center gap-2 text-[#f4cb79] text-[10px] font-mono uppercase tracking-widest"><CheckCircle2 className="w-4 h-4" /> Operating status</div>
                    <div className="grid grid-cols-2 gap-3 text-center">
                      <div className="p-3 bg-[#070707]/90 rounded border border-[#2a241f]">
                        <div className="font-serif text-xl text-[#fffaf5]">98.4%</div>
                        <div className="text-[8px] font-mono uppercase tracking-widest text-neutral-500 mt-1">Rule compliance</div>
                      </div>
                      <div className="p-3 bg-[#070707]/90 rounded border border-[#2a241f]">
                        <div className="font-serif text-xl text-[#fffaf5]">24/7</div>
                        <div className="text-[8px] font-mono uppercase tracking-widest text-neutral-500 mt-1">Monitoring</div>
                      </div>
                    </div>

                    <div className="p-4 bg-[#070707]/90 rounded border border-[#2a241f]">
                      <div className="flex items-center justify-between text-xs text-neutral-300">
                        <span>Primary sync status</span>
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-200 rounded-full text-[8px] font-mono uppercase">Synced</span>
                      </div>
                      <p className="mt-2 text-[10px] text-neutral-500 font-mono">Cloud host heartbeat active. Booking stream, occupancy telemetry, and rule engine updates are synchronized.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </main>
      </div>

      {/* NEW RESERVATION SLIDING OVERLAY PANEL (MODAL SHEET) */}
      <AnimatePresence>
        {newBookingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal glass backdrop background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setNewBookingModalOpen(false)}
              className="absolute inset-0 bg-neutral-950/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-[#0f0d0c] border border-[#352d27] rounded-xl max-w-lg w-full overflow-hidden relative z-10 p-6 md:p-8 space-y-6 shadow-[0_20px_80px_rgba(0,0,0,0.55)]"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="font-mono text-[10px] tracking-widest text-orange-300 uppercase">Grid Manual entry</span>
                  <h3 className="font-serif text-2xl font-light text-[#fffaf5]">Add Live Reservation</h3>
                </div>
                <button
                  onClick={() => setNewBookingModalOpen(false)}
                  className="p-1.5 hover:bg-neutral-800 rounded border border-neutral-850 text-neutral-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-mono tracking-widest text-neutral-500 uppercase">Guest Fulll Name</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="e.g. Liam Neeson"
                    className="w-full bg-[#070707] border border-[#3a2f29] focus:border-orange-300/40 text-xs px-3.5 py-3 text-[#fffaf5] rounded focus:outline-none focus:placeholder-transparent placeholder-[#79614f] transition-colors"
                    required
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-mono tracking-widest text-neutral-500 uppercase">Party Size (Pax)</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={partySize}
                      onChange={(e) => setPartySize(Number(e.target.value))}
                      className="w-full bg-[#070707] border border-[#3a2f29] focus:border-orange-300/40 text-xs px-3.5 py-3 text-[#fffaf5] rounded font-mono focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-mono tracking-widest text-neutral-500 uppercase">Grid Table Designated</label>
                    <input
                      type="text"
                      value={selectedTable}
                      onChange={(e) => setSelectedTable(e.target.value)}
                      placeholder="e.g. 05"
                      className="w-full bg-[#070707] border border-[#3a2f29] focus:border-orange-300/40 text-xs px-3.5 py-3 text-[#fffaf5] rounded font-mono focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-mono tracking-widest text-neutral-500 uppercase">Allocated Time</label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full bg-[#070707] border border-[#3a2f29] focus:border-orange-300/40 text-xs px-2.5 py-3 text-[#fffaf5] rounded font-mono focus:outline-none"
                    >
                      <option value="18:00">18:00</option>
                      <option value="19:30">19:30</option>
                      <option value="20:00">20:00</option>
                      <option value="20:45">20:45</option>
                      <option value="21:15">21:15</option>
                      <option value="22:30">22:30</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[9px] font-mono tracking-widest text-neutral-500 uppercase">Bespoke Culinary / Allergies Alert</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Requesting vegetarian main course option. Celebrating anniversary."
                    rows={2}
                    className="w-full bg-[#070707] border border-[#3a2f29] focus:border-orange-300/40 text-xs px-3.5 py-3 text-[#fffaf5] rounded focus:outline-none placeholder-[#79614f] transition-colors font-sans leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-linear-to-r from-[#b76524] via-[#d08d36] to-[#f4cb79] text-[#241912] font-mono tracking-widest text-xs uppercase rounded hover:shadow-[0_0_15px_rgba(251,146,60,0.24)] font-bold transition-all duration-300 pointer-events-auto"
                >
                  Confirm Table Allocation
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}

