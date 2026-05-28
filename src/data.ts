import { Restaurant, Booking, LiveActivity, Review, FloorAsset, MenuItem } from './types';

export const INITIAL_RESTAURANTS: Restaurant[] = [
  {
    id: 'the-monolith',
    name: 'The Monolith',
    cuisine: 'Modernist Contemporary',
    rating: 5.0,
    reviewsCount: 2401,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&q=80&w=600',
    ],
    description: 'An architectural tribute to deep-earth minerals, fire, and raw culinary elegance. Suspended 40 stories above the skyline, The Monolith serves structured dishes focused on custom smoke, volcanic stone aging, and ancient preservation techniques paired with hyper-modern texturization.',
    philosophies: [
      'Raw elemental extraction is our master guide: every single ingredient is treated as a solitary sculptural element.',
      'To eat with us is to enter a silence, a rhythmic sequence of courses mirroring tectonic shift and seasonal alignment.',
      'We curate the interface between primitive fire and precision gastronomy.'
    ],
    amenities: [
      'Valet Parking',
      'Outdoor Terrace',
      'Chef\'s Table',
      'Private Cellar',
      'Guest Connectivity',
      'Full Access'
    ],
    address: '427 Mineral Ridge Center, Floor 40',
    coordinates: { lat: 37.7749, lng: -122.4194 },
    popularTimeSlots: ['18:00', '19:30', '20:45', '21:30'],
    michelinStar: 3
  },
  {
    id: 'aurelia',
    name: 'Aurelia',
    cuisine: 'Mediterranean Gastronomy',
    rating: 4.9,
    reviewsCount: 1845,
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600',
      'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'Luminous sun-kissed textures, wild citrus oils, and biodynamic marine catches. Aurelia is a celebration of the coastal landscape, using cold-pressed olive millings and rare herbs harvested exclusively from southern cliffs.',
    philosophies: [
      'Salt, acid, sun, and sand defined as high science.',
      'Dishes change with the morning winds, sourced directly from certified maritime vessels.',
      'Simplicity executed with absolute structural integrity.'
    ],
    amenities: ['Outdoor Terrace', 'Private Cellar', 'Ocean View', 'Sommelier Table'],
    address: '802 Gold Coast Terminal, Suite B',
    coordinates: { lat: 37.7858, lng: -122.4008 },
    popularTimeSlots: ['17:45', '19:00', '20:30', '21:45'],
    michelinStar: 2
  },
  {
    id: 'noir-bar',
    name: 'Noir Bar',
    cuisine: 'Neo-Tokyo Omakase & Mixology',
    rating: 4.8,
    reviewsCount: 962,
    image: 'https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1560624052-449f5ddf0c31?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'A dark, high-intensity laboratory of light and shadows. Settle into deep leather and enjoy premium dry-aged sashimi paired with bespoke molecular liquid creations and rare Japanese single malts.',
    philosophies: [
      'Midnight aesthetics are designed to heighten neural flavor reception.',
      'Perfect geometric ice paired with the highest levels of sensory mixology.',
      'An intimate, hushed sanctuary for quiet epicureans.'
    ],
    amenities: ['Private Cellar', 'Guest Connectivity', 'Lounge Seating', 'Live Vinyl Playbacks'],
    address: '90 Shadow Lane, Lower level',
    coordinates: { lat: 37.7699, lng: -122.4468 },
    popularTimeSlots: ['20:00', '21:30', '22:45', '00:00'],
    michelinStar: 1
  },
  {
    id: 'lesprit',
    name: 'L\'Esprit',
    cuisine: 'Avant-Garde French Haute',
    rating: 4.9,
    reviewsCount: 1530,
    image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'Decadence reimagined through standard contemporary math. L\'Esprit elevates classical sauce reductions to physical art, setting an ultra-refined canvas with crystal pillars and crisp silk linens.',
    philosophies: [
      'Respect heritage, revolutionize structure.',
      'Butter, truffles, and yeast decoded into a molecular symphony.',
      'The theater of fine wine poured with surgical temperature discipline.'
    ],
    amenities: ['Valet Parking', 'Chef\'s Table', 'Sommelier Table', 'Piano Recitals'],
    address: '14 Boulevard de Marquee',
    coordinates: { lat: 37.7942, lng: -122.3992 },
    popularTimeSlots: ['18:30', '19:45', '21:00', '21:45'],
    michelinStar: 3
  },
  {
    id: 'vintage-74',
    name: 'Vintage 74',
    cuisine: 'Heritage Steakhouse & Cellar',
    rating: 4.7,
    reviewsCount: 840,
    image: 'https://images.unsplash.com/photo-1560624052-449f5ddf0c31?auto=format&fit=crop&q=80&w=800',
    gallery: [
      'https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&q=80&w=600'
    ],
    description: 'A heavy-timbered salon smelling of cedarwood fire, custom dry-aged bone-ins, and century-old reserve ports. Vintage 74 delivers classical steakhouse comfort under the supervision of master butchers.',
    philosophies: [
      'Wood-fired iron stoves heat elements to perfectly sear protein bonds.',
      'Double-aged cuts with a pristine 45-day cycle of dry chamber humidity control.',
      'Unwavering traditional service that values space and pacing.'
    ],
    amenities: ['Valet Parking', 'Private Cellar', 'Chef\'s Table', 'Cigar Room Access'],
    address: '74 Timberland Ave, Crossing North',
    coordinates: { lat: 37.8012, lng: -122.4124 },
    popularTimeSlots: ['17:30', '18:45', '20:15', '21:30'],
    michelinStar: 1
  }
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: '1',
    guestName: 'Julianne Moore',
    email: 'jmoore@oscars.org',
    phone: '+1 (555) 304-2015',
    tableNo: '04',
    time: '19:30',
    covers: 2,
    status: 'seated',
    specialNotes: 'Prefers deep booth away from walkways. Celebrating anniversary.',
    restaurantId: 'the-monolith'
  },
  {
    id: '2',
    guestName: 'Ethan Vance',
    email: 'ethan@vancemedia.co',
    phone: '+1 (555) 911-3040',
    tableNo: '12',
    time: '19:30',
    covers: 4,
    status: 'seated',
    specialNotes: 'No garlic in reduction if possible. Ordering signature tasting course.',
    restaurantId: 'the-monolith'
  },
  {
    id: '3',
    guestName: 'Sarah Connor',
    email: 'sconnor@cyberdyne.net',
    phone: '+1 (555) 800-1984',
    tableNo: '09',
    time: '20:45',
    covers: 2,
    status: 'confirmed',
    specialNotes: 'Requested window seat overlooking skyline.',
    restaurantId: 'the-monolith'
  },
  {
    id: '4',
    guestName: 'Chef Michael Bras',
    email: 'mbras@gastronomy.com',
    phone: '+33 4 123 4567',
    tableNo: '01',
    time: '21:00',
    covers: 1,
    status: 'arriving',
    specialNotes: 'VIP Guest. Notify Head Chef immediately upon arrival. Serve reserve cellars.',
    restaurantId: 'the-monolith'
  },
  {
    id: '5',
    guestName: 'Sophia Loren',
    email: 'sophia@cinematic.it',
    phone: '+39 06 123456',
    tableNo: '07',
    time: '18:00',
    covers: 3,
    status: 'confirmed',
    specialNotes: 'Likes fine olives & mineral water served instantly on arrival.',
    restaurantId: 'the-monolith'
  }
];

export const INITIAL_LIVE_ACTIVITIES: LiveActivity[] = [
  {
    id: '1',
    type: 'booking',
    message: 'Online booking confirmed for Guest Julianne Moore (Party of 2) at Table 04.',
    timestamp: '19:12',
    latency: '1.2ms',
    category: 'success'
  },
  {
    id: '2',
    type: 'attendance',
    message: 'Guest Ethan Vance (Party of 4) marked as SEATED at Table 12 via Front of House.',
    timestamp: '19:34',
    latency: '0.8ms',
    category: 'info'
  },
  {
    id: '3',
    type: 'system',
    message: 'Grid telemetry aligned: Smart Kitchen system received update for Course 1, Table 04.',
    timestamp: '19:39',
    latency: '42ms',
    category: 'success'
  },
  {
    id: '4',
    type: 'review',
    message: 'New 5.0 ★ culinary review published anonymously by verified inspector card.',
    timestamp: '19:42',
    latency: '120ms',
    category: 'success'
  },
  {
    id: '5',
    type: 'system',
    message: 'Alert: Climate controller in Wine Cellar corridor fluctuates mildly (+0.4°C). Re-calibrating...',
    timestamp: '19:45',
    latency: '1.4s',
    category: 'warning'
  }
];

export const THE_MONOLITH_REVIEWS: Review[] = [
  {
    id: 'r1',
    guestName: 'Inspector No. 42 (Michelin Guide)',
    rating: 5.0,
    date: 'April 14, 2026',
    text: 'A profound, structural victory for modernist cooking. The sourdough crust smoked with local juniper bark, served with butter fat extracted from ancient Swiss heifers, achieves a standard of excellence that is rarely encountered. The service remains exceptionally paced, hushed, and completely respectful of spatial isolation.',
    usefulCount: 148,
    hasVerifiedBooking: true
  },
  {
    id: 'r2',
    guestName: 'Dr. Evelyn Sterling',
    rating: 5.0,
    date: 'May 3, 2026',
    text: 'We came specifically for the volcanic stone-aged duck chest. The density of sensory feedback is absolute. Cooking is precise to the molecular degree. Sitting at the skyline bar, the design feel matches pure Stanley Kubrick: clean, monoliths everywhere, warm custom spot lighting, perfect acoustics.',
    usefulCount: 74,
    hasVerifiedBooking: true,
    images: [
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=200',
      'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=200'
    ]
  },
  {
    id: 'r3',
    guestName: 'Richard Westwood',
    rating: 4.8,
    date: 'May 12, 2026',
    text: 'A true high-altitude culinary fortress. Excellent wine cellar representation. The sommelier took us down a rabbit hole of dry-climate volcanic roots. Small deduction only for slight delay at the street valet ramp, but once in the private elevator, it was pure bliss.',
    usefulCount: 31,
    hasVerifiedBooking: true
  }
];

export const DEGUSTATION_MENU: MenuItem[] = [
  {
    name: 'I. VOLCANIC TECTONICS',
    description: 'Black sea urchin emulsified with basalt-filtered rain, puffed rye charcoal, and ice-smoked sorrel leaf.',
    price: 34,
    pairing: 'Champagne Salon - Blanc de Blancs Le Mesnil 2012'
  },
  {
    name: 'II. THE GLACIAL CRUST',
    description: 'Crushed wild arctic cod tail layered beneath slow-dripped ocean salt jelly, mountain dill essence.',
    price: 42,
    pairing: 'Domaine Vacheron - Sancerre Grand Côte 2020'
  },
  {
    name: 'III. FOREST DESTRUCTIVENESS',
    description: 'Foraged chanterelle roots, high-temperature caramelized birch syrup, dry-cured elk marrow foam.',
    price: 54,
    pairing: 'E. Guigal - Côte-Rôtie La Mouline 2015'
  },
  {
    name: 'IV. MONOLITHIC MASS',
    description: 'Volcanic slate charcoal seared Miyazaki A5 Wagyu, ash-baked black truffle, fermented lichen broth reduction.',
    price: 98,
    pairing: 'Château Latour - Pauillac Grand Vin 2005'
  },
  {
    name: 'V. MINERAL CRYSTALLIZATION',
    description: 'Dehydrated sugar crystal lace with dynamic wild honey dust, local pine needle ice.',
    price: 28,
    pairing: 'Château d\'Yquem - Sauternes 2018'
  }
];

export const INITIAL_FLOOR_ASSETS: FloorAsset[] = [
  { id: 't1', type: 'table', x: 2, y: 1, capacity: 4, number: '01', status: 'available' },
  { id: 't2', type: 'table', x: 6, y: 1, capacity: 4, number: '02', status: 'reserved' },
  { id: 't3', type: 'table', x: 10, y: 1, capacity: 2, number: '03', status: 'available' },
  { id: 't4', type: 'booth', x: 2, y: 4, capacity: 6, number: '04', status: 'occupied' },
  { id: 't5', type: 'table', x: 6, y: 4, capacity: 2, number: '05', status: 'available' },
  { id: 't6', type: 'booth', x: 10, y: 4, capacity: 6, number: '06', status: 'available' },
  { id: 't7', type: 'bar', x: 1, y: 7, capacity: 1, number: 'B1', status: 'available' },
  { id: 't8', type: 'bar', x: 3, y: 7, capacity: 1, number: 'B2', status: 'occupied' },
  { id: 't9', type: 'bar', x: 5, y: 7, capacity: 1, number: 'B3', status: 'available' },
  { id: 't10', type: 'bar', x: 7, y: 7, capacity: 1, number: 'B4', status: 'available' },
  { id: 't11', type: 'table', x: 10, y: 7, capacity: 4, number: '07', status: 'reserved' }
];
