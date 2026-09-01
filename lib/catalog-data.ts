export interface Product {
  id: string;
  sku: string;
  name: string;
  tagline: string;
  category: 'audio' | 'video' | 'peripherals' | 'power' | 'services';
  description: string;
  mrp: number;
  sellingPrice: number;
  costPrice: number;
  floorPrice: number;
  stock: number;
  rating: number;
  reviewsCount: number;
  image: string;
  features: string[];
  specs: Record<string, string>;
  upsellAffinities: {
    targetSku: string;
    reason: string;
    bundleDiscountPercent: number;
  }[];
  agentReadableTags: string[];
}

export const MERCHANT_CATALOG: Product[] = [
  {
    id: 'prod_anc_headphone_01',
    sku: 'AURA-ANC-900',
    name: 'Aura Pro Wireless ANC Headphones',
    tagline: 'Studio-grade 40mm beryllium drivers with hybrid 45dB noise cancellation',
    category: 'audio',
    description: 'Flagship active noise-cancelling headphones crafted for developers, creators, and audiophiles. Features multi-point Bluetooth 5.4, spatial audio head tracking, and ultra-low latency gaming mode.',
    mrp: 14999,
    sellingPrice: 11999,
    costPrice: 6200,
    floorPrice: 8500,
    stock: 28,
    rating: 4.9,
    reviewsCount: 312,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
    features: ['45dB Hybrid Active Noise Cancellation', '60hr Battery Life with Fast Charge', 'Multi-device Seamless Handshake', 'Beryllium Driver Architecture'],
    specs: {
      'Driver Size': '40mm Beryllium',
      'Battery Life': '60 Hours (ANC Off), 42 Hours (ANC On)',
      'Connectivity': 'Bluetooth 5.4, 3.5mm AUX, USB-C Lossless',
      'Weight': '248g'
    },
    upsellAffinities: [
      { targetSku: 'AURA-PWR-100', reason: 'High-speed GaN fast charger to power 10 hours in 10 mins', bundleDiscountPercent: 15 },
      { targetSku: 'AURA-CARE-2Y', reason: '2-Year Accidental Damage Protection & Priority Replacement', bundleDiscountPercent: 20 }
    ],
    agentReadableTags: ['headphones', 'anc', 'wireless', 'audio', 'bluetooth-5.4', 'noise-cancelling', 'office-gear']
  },
  {
    id: 'prod_cam_4k_02',
    sku: 'AURA-CAM-4K',
    name: 'Aura Flow 4K Smart Studio Webcam',
    tagline: 'Sony STARVIS 2 sensor with AI auto-framing and dual beamforming mics',
    category: 'video',
    description: 'Broadcast-tier 4K 60FPS webcam designed for remote executives, live streamers, and AI developers. Features hardware HDR, TOF rapid autofocus, and dedicated physical privacy shutter.',
    mrp: 12499,
    sellingPrice: 8999,
    costPrice: 4800,
    floorPrice: 6500,
    stock: 19,
    rating: 4.8,
    reviewsCount: 184,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
    features: ['Sony STARVIS 2 4K HDR Sensor', 'AI-powered Auto Framing & Face Tracking', 'Built-in Hardware Privacy Shutter', 'Dual Beamforming Microphones with Noise Suppression'],
    specs: {
      'Resolution': '4K @ 60fps / 1080p @ 120fps',
      'Field of View': '65° / 78° / 90° adjustable',
      'Mount Type': 'Universal Monitor Clip + 1/4" Tripod Thread',
      'Interface': 'USB-C 3.2 Gen 2'
    },
    upsellAffinities: [
      { targetSku: 'AURA-MIC-PULSE', reason: 'Studio condenser microphone for broadcast-quality podcast audio', bundleDiscountPercent: 18 },
      { targetSku: 'AURA-LIGHT-RGB', reason: 'Smart CRI 95+ bias lighting for flawless camera illumination', bundleDiscountPercent: 15 }
    ],
    agentReadableTags: ['webcam', '4k', 'streaming', 'video-calls', 'remote-work', 'sony-starvis']
  },
  {
    id: 'prod_mech_kb_03',
    sku: 'AURA-KB-MECH',
    name: 'Aura Arc Ergonomic Mechanical Keyboard',
    tagline: 'Gasket-mounted hot-swappable custom board with CNC anodized aluminum frame',
    category: 'peripherals',
    description: 'Precision-tuned mechanical keyboard with south-facing RGB, lubed pre-travel linear switches, sound dampening PORON foam, and tri-mode connectivity (2.4GHz / BT 5.3 / Type-C).',
    mrp: 9999,
    sellingPrice: 7499,
    costPrice: 3900,
    floorPrice: 5400,
    stock: 35,
    rating: 4.9,
    reviewsCount: 420,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
    features: ['Gasket Mount System with 5-layer Sound Dampening', 'Hot-Swappable 5-Pin Switch Sockets', 'CNC Anodized Aluminum Top Plate', 'Tri-Mode Wireless + 4000mAh Battery'],
    specs: {
      'Layout': '75% Compact (84 Keys)',
      'Switches': 'Factory Lubed Silent Tactile / Linear',
      'Keycaps': 'Double-shot PBT Cherry Profile',
      'Battery': '4000mAh (Up to 200 hours)'
    },
    upsellAffinities: [
      { targetSku: 'AURA-PWR-100', reason: 'All-in-one desktop GaN hub for seamless cable management', bundleDiscountPercent: 12 },
      { targetSku: 'AURA-CARE-2Y', reason: '2-Year Switch & PCB Replacement Warranty', bundleDiscountPercent: 25 }
    ],
    agentReadableTags: ['keyboard', 'mechanical', 'gasket-mount', 'hot-swap', 'wireless', 'ergonomic', 'coding']
  },
  {
    id: 'prod_mic_pulse_04',
    sku: 'AURA-MIC-PULSE',
    name: 'Aura Stream Pulse Dynamic XLR/USB Mic',
    tagline: 'Dual-output broadcast dynamic microphone with built-in DSP preamp',
    category: 'audio',
    description: 'Professional grade cardioid dynamic microphone with real-time hardware compression, gain staging, zero-latency headphone monitoring, and integrated shock mount.',
    mrp: 8499,
    sellingPrice: 5999,
    costPrice: 3100,
    floorPrice: 4200,
    stock: 22,
    rating: 4.7,
    reviewsCount: 142,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
    features: ['Dual USB-C and XLR Output Architecture', 'Built-in Hardware DSP Equalizer & Limiter', 'Internal Shock Isolation & Pop Filter', 'Zero-Latency 3.5mm Direct Audio Monitoring'],
    specs: {
      'Polar Pattern': 'Cardioid Dynamic',
      'Bit Depth / Sample Rate': '24-bit / 96kHz',
      'Frequency Response': '20Hz - 20,000Hz',
      'Max SPL': '132dB'
    },
    upsellAffinities: [
      { targetSku: 'AURA-CAM-4K', reason: 'Complete your 4K Streaming & Executive Studio setup', bundleDiscountPercent: 20 },
      { targetSku: 'AURA-LIGHT-RGB', reason: 'Ambient studio lighting kit with synced voice reactive mode', bundleDiscountPercent: 15 }
    ],
    agentReadableTags: ['microphone', 'podcast', 'streaming', 'xlr', 'usb-mic', 'voice-over', 'studio']
  },
  {
    id: 'prod_light_rgb_05',
    sku: 'AURA-LIGHT-RGB',
    name: 'Aura Lumina Smart Bias Lighting Kit',
    tagline: 'High-CRI 98+ monitor light bar and synchronized ambient wall backlights',
    category: 'peripherals',
    description: 'Intelligent desk lighting system reducing eye fatigue by 82%. Features auto-dimming ambient light sensor, wireless control dial, and smart home agent protocol integration.',
    mrp: 4999,
    sellingPrice: 3499,
    costPrice: 1700,
    floorPrice: 2400,
    stock: 45,
    rating: 4.8,
    reviewsCount: 215,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
    features: ['CRI 98+ Natural Color Rendering Index', 'Asymmetrical Optical Glare-Free Light Path', 'Smart Auto-Dimming Ambient Sensor Dial', 'Matter & AP2 Agentic Automation Protocol Support'],
    specs: {
      'Color Temperature': '2700K - 6500K Stepless',
      'Illuminance': '1000 Lux @ 45cm center',
      'Power Source': '5V 2A USB Type-C',
      'Dial Battery': 'AAA x 2 (1-year life)'
    },
    upsellAffinities: [
      { targetSku: 'AURA-PWR-100', reason: 'Clean power station to drive light bar and charge peripherals', bundleDiscountPercent: 15 }
    ],
    agentReadableTags: ['lighting', 'lightbar', 'desk-setup', 'ergonomics', 'eye-care', 'smart-home']
  },
  {
    id: 'prod_pwr_gan_06',
    sku: 'AURA-PWR-100',
    name: 'Aura PowerHub 100W GaN Desktop Station',
    tagline: 'Ultra-compact Gallium Nitride 4-port charger with real-time OLED power meter',
    category: 'power',
    description: 'Next-gen GaN III fast charger delivering 100W total output across 3x USB-C PD 3.0 ports and 1x USB-A QC 4.0. Features smart dynamic power allocation and real-time wattage display.',
    mrp: 4499,
    sellingPrice: 2999,
    costPrice: 1400,
    floorPrice: 2100,
    stock: 50,
    rating: 4.9,
    reviewsCount: 380,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80',
    features: ['100W High Efficiency GaN III Architecture', 'OLED Digital Power Display Screen', 'Intelligent Dynamic Power Distribution', 'Advanced 8-Point Thermal Protection'],
    specs: {
      'Total Output': '100W Max',
      'Ports': '3x USB-C (PD 3.0 / PPS), 1x USB-A (QC 4+)',
      'Dimensions': '65 x 65 x 30 mm',
      'Weight': '210g'
    },
    upsellAffinities: [
      { targetSku: 'AURA-CARE-2Y', reason: 'Instant device replacement guarantee', bundleDiscountPercent: 30 }
    ],
    agentReadableTags: ['charger', 'gan', '100w', 'power-bank', 'usb-c', 'fast-charging']
  },
  {
    id: 'prod_care_serv_07',
    sku: 'AURA-CARE-2Y',
    name: 'Aura Care+ 2-Year Extended Protection & Cloud Suite',
    tagline: 'Zero-depreciation accidental damage coverage + VIP concierge warranty',
    category: 'services',
    description: 'Comprehensive warranty add-on covering drops, spills, power surges, and switch/sensor wear. Includes complimentary loaner unit during repair and 100GB secure cloud device backups.',
    mrp: 2999,
    sellingPrice: 1499,
    costPrice: 200,
    floorPrice: 500,
    stock: 999,
    rating: 4.9,
    reviewsCount: 512,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
    features: ['100% Zero-Depreciation Repair / Replacement', 'Doorstep Express Courier Pickup & Drop', '24/7 AI VIP Concierge & Setup Assistance', 'High Margin Digital Service Add-on'],
    specs: {
      'Coverage Duration': '24 Months from purchase',
      'Claim Limit': 'Up to 2 full replacements',
      'Activation': 'Instant via Razorpay Order ID'
    },
    upsellAffinities: [],
    agentReadableTags: ['warranty', 'protection', 'insurance', 'service', 'care-plus', 'high-margin']
  }
];

export function getProductBySku(sku: string): Product | undefined {
  return MERCHANT_CATALOG.find(p => p.sku.toLowerCase() === sku.toLowerCase());
}

export function getProductById(id: string): Product | undefined {
  return MERCHANT_CATALOG.find(p => p.id === id);
}

export function searchCatalog(query: string, category?: string): Product[] {
  const q = query.toLowerCase().trim();
  return MERCHANT_CATALOG.filter(product => {
    const matchCategory = !category || category === 'all' || product.category === category;
    const matchText = !q || 
      product.name.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q) ||
      product.sku.toLowerCase().includes(q) ||
      product.agentReadableTags.some(tag => tag.includes(q));
    return matchCategory && matchText;
  });
}
