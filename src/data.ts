import { Restaurant, Booking, LiveActivity, Review, FloorAsset, MenuItem } from './types';

export const INITIAL_RESTAURANTS: Restaurant[] = [];

export const INITIAL_BOOKINGS: Booking[] = [];

export const INITIAL_FLOOR_ASSETS: FloorAsset[] = [];

export const INITIAL_LIVE_ACTIVITIES: LiveActivity[] = [];

export const THE_MONOLITH_REVIEWS: Review[] = [];

export const DEGUSTATION_MENU: MenuItem[] = [];

export interface CalendarDate {
  day: string;
  date: string;
  full: string;
  isPast: boolean;
  isToday?: boolean;
}

export function getCalendarDates(): CalendarDate[] {
  const dates: CalendarDate[] = [];
  const today = new Date();
  
  // 3 days in the past
  for (let i = -3; i < 0; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push({
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.toLocaleDateString('en-US', { day: '2-digit' }),
      full: d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
      isPast: true
    });
  }
  
  // Today
  dates.push({
    day: today.toLocaleDateString('en-US', { weekday: 'short' }),
    date: today.toLocaleDateString('en-US', { day: '2-digit' }),
    full: today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
    isPast: false,
    isToday: true
  });
  
  // 7 days in the future
  for (let i = 1; i <= 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push({
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.toLocaleDateString('en-US', { day: '2-digit' }),
      full: d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
      isPast: false
    });
  }
  
  return dates;
}

export const CALENDAR_DATES = getCalendarDates();
export const INITIAL_DATE_INDEX = CALENDAR_DATES.findIndex(d => d.isToday);

  
