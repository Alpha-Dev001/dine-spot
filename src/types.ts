export type ViewState = 'landing' | 'signin' | 'onboarding' | 'dashboard' | 'discover' | 'detail';

export interface Booking {
  id: string;
  guestName: string;
  email?: string;
  phone?: string;
  tableNo: string;
  time: string;
  covers: number;
  status: 'seated' | 'confirmed' | 'arriving' | 'canceled';
  specialNotes?: string;
  restaurantId?: string;
}

export interface LiveActivity {
  id: string;
  type: 'booking' | 'attendance' | 'review' | 'system';
  message: string;
  timestamp: string;
  latency?: string;
  category?: 'success' | 'warning' | 'info';
}

export interface MenuItem {
  name: string;
  description: string;
  price: number;
  pairing?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  reviewsCount: number;
  image: string;
  gallery: string[];
  description: string;
  philosophies: string[];
  amenities: string[];
  address: string;
  coordinates: { lat: number; lng: number };
  popularTimeSlots: string[];
  michelinStar?: number;
  menu?: MenuItem[];
}

export interface Review {
  id: string;
  guestName: string;
  rating: number;
  date: string;
  text: string;
  usefulCount: number;
  hasVerifiedBooking: boolean;
  images?: string[];
}

export interface FloorAsset {
  id: string;
  type: 'table' | 'booth' | 'bar';
  x: number; // grid units
  y: number; // grid units
  capacity: number;
  number: string;
  status: 'available' | 'occupied' | 'reserved';
}

export interface CustomerAccount {
  email: string;
  isAuthenticated: boolean;
  createdAt?: string;
  updatedAt?: string;
}
