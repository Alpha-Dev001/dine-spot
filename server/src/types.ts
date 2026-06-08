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
    menu?: {
        name: string;
        description: string;
        price: number;
        pairing?: string;
    }[];
}

export interface OwnerDashboardData {
    restaurants: Restaurant[];
    bookings: Booking[];
    activities: LiveActivity[];
}

export interface OwnerAccount {
    email: string;
    passwordHash: string;
    passwordSalt: string;
    establishmentName: string;
    isAuthenticated: boolean;
    dashboardData: OwnerDashboardData;
}

export interface CustomerAccount {
    email: string;
    passwordHash: string;
    passwordSalt: string;
    isAuthenticated: boolean;
}
