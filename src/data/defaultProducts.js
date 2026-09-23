export const categories = [
  { id: 'all', name: 'All Products', icon: 'Sparkles', count: 12 },
  { id: 'Smartphones', name: 'Smartphones', icon: 'Smartphone', count: 3 },
  { id: 'Laptops', name: 'Laptops & PC', icon: 'Laptop', count: 3 },
  { id: 'Audio', name: 'Audio & Sound', icon: 'Headphones', count: 3 },
  { id: 'Wearables', name: 'Smart Watches', icon: 'Watch', count: 2 },
  { id: 'Gaming', name: 'Gaming Gear', icon: 'Gamepad2', count: 2 },
  { id: 'Accessories', name: 'Accessories', icon: 'Layers', count: 2 }
];

export const defaultProducts = [
  {
    id: 'prod-1',
    name: 'Apple MacBook Pro 16" (M3 Max, 64GB, 1TB SSD)',
    brand: 'Apple',
    category: 'Laptops',
    price: 3499,
    salePrice: 3199,
    rating: 4.9,
    reviewsCount: 238,
    stock: 14,
    sku: 'TB-MBP16-M3M',
    badge: 'Flagship Tech',
    isFeatured: true,
    isFlashDeal: true,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1000&q=80'
    ],
    shortDesc: 'The ultimate pro laptop. Turbocharged by the revolutionary M3 Max chip with 16-core CPU and 40-core GPU.',
    description: 'The 16-inch MacBook Pro blasts forward with M3 Max, an extraordinarily advanced chip that brings massive performance and capability for the most extreme workflows. With industry-leading battery life — up to 22 hours — and a breathtaking Liquid Retina XDR display, it is a pro laptop without equal.',
    specs: {
      'Processor': 'Apple M3 Max (16-core CPU, 40-core GPU)',
      'Memory': '64GB Unified Memory',
      'Storage': '1TB Superfast PCIe NVMe SSD',
      'Display': '16.2" Liquid Retina XDR (3456 x 2234), 120Hz ProMotion',
      'Battery Life': 'Up to 22 hours playback',
      'Weight': '2.16 kg (4.8 lbs)',
      'Ports': '3x Thunderbolt 4, HDMI, SDXC, MagSafe 3'
    }
  },
  {
    id: 'prod-2',
    name: 'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 512GB)',
    brand: 'Samsung',
    category: 'Smartphones',
    price: 1419,
    salePrice: 1299,
    rating: 4.8,
    reviewsCount: 315,
    stock: 22,
    sku: 'TB-SGS24U-512',
    badge: 'Best Seller',
    isFeatured: true,
    isFlashDeal: false,
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1000&q=80'
    ],
    shortDesc: 'Meet Galaxy S24 Ultra with Galaxy AI, Titanium exterior, 200MP camera and built-in S Pen.',
    description: 'Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, you can unleash whole new levels of creativity, productivity and possibility — starting with the most important device in your life: your smartphone. Encased in durable titanium armor.',
    specs: {
      'Processor': 'Snapdragon 8 Gen 3 for Galaxy (4nm)',
      'RAM': '12GB LPDDR5X',
      'Storage': '512GB UFS 4.0',
      'Camera': '200MP Quad Tele System with 100x Space Zoom',
      'Battery': '5000 mAh with 45W Fast Charging',
      'Display': '6.8" Dynamic AMOLED 2X, 1-120Hz, 2600 nits'
    }
  },
  {
    id: 'prod-3',
    name: 'Sony WH-1000XM5 Wireless Noise-Canceling Headphones',
    brand: 'Sony',
    category: 'Audio',
    price: 399,
    salePrice: 329,
    rating: 4.9,
    reviewsCount: 520,
    stock: 35,
    sku: 'TB-SNY-WH1000XM5',
    badge: 'Editor Choice',
    isFeatured: true,
    isFlashDeal: true,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80'
    ],
    shortDesc: 'Industry-leading noise canceling with two processors and 8 microphones for unparalleled quiet sound.',
    description: 'The WH-1000XM5 headphones rewrite the rules for distraction-free listening. Two processors control 8 microphones for unprecedented noise cancellation and exceptional call quality. With a newly developed driver, DSEE - Extreme and Hi-Res audio support, sound has never been purer.',
    specs: {
      'Noise Canceling': 'Dual Processor V1 + HD QN1 Chipset',
      'Battery Life': 'Up to 30 Hours (3 min charge = 3 hours playback)',
      'Connectivity': 'Bluetooth 5.2, LDAC, Multi-point connection',
      'Weight': '250g ultra-comfortable soft fit leather',
      'Microphones': '4 beamforming mics with AI noise reduction'
    }
  },
  {
    id: 'prod-4',
    name: 'Apple Watch Ultra 2 (Titanium Case with Ocean Band)',
    brand: 'Apple',
    category: 'Wearables',
    price: 799,
    salePrice: 749,
    rating: 4.9,
    reviewsCount: 184,
    stock: 9,
    sku: 'TB-AWU2-49TI',
    badge: 'Popular',
    isFeatured: true,
    isFlashDeal: false,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=80'
    ],
    shortDesc: 'Rugged and capable, built for endurance athletes, outdoor adventurers, and water sports enthusiasts.',
    description: 'The most rugged and capable Apple Watch pushes the limits again. Featuring the all-new S9 SiP, a magical new way to use your watch without touching the screen, and the brightest Apple display ever at 3000 nits.',
    specs: {
      'Case': '49mm Aerospace-grade Titanium',
      'Display': 'Always-On Retina display, 3000 nits brightness',
      'Battery': 'Up to 36 hours regular, 72 hours Low Power Mode',
      'Water Resistance': '100m water resistant, 40m recreational dive',
      'Sensors': 'Precision dual-frequency GPS, ECG, Blood Oxygen, Depth Gauge'
    }
  },
  {
    id: 'prod-5',
    name: 'Sony PlayStation 5 Pro Console (2TB SSD Custom Edition)',
    brand: 'Sony',
    category: 'Gaming',
    price: 699,
    salePrice: 669,
    rating: 4.9,
    reviewsCount: 410,
    stock: 7,
    sku: 'TB-PS5-PRO-2TB',
    badge: 'Limited Stock',
    isFeatured: true,
    isFlashDeal: true,
    images: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80'
    ],
    shortDesc: 'Experience games with breathtaking fidelity, advanced ray tracing, and PlayStation Spectral Super Resolution.',
    description: 'With the PlayStation 5 Pro console, the worlds greatest game creators can enhance their games with incredible features like advanced ray tracing, super sharp image clarity on 4K TVs, and ultra-high framerate gameplay up to 120 FPS.',
    specs: {
      'Storage': '2TB Ultra-High Speed Custom NVMe SSD',
      'Graphics': 'Advanced RDNA GPU with PSSR AI Upscaling',
      'Output': '4K 120Hz support, 8K output, HDR',
      'Audio': 'Tempest 3D AudioTech',
      'Controller': 'DualSense Wireless Controller with Haptic Feedback'
    }
  },
  {
    id: 'prod-6',
    name: 'ASUS ROG Zephyrus G16 OLED (RTX 4080, Core Ultra 9)',
    brand: 'ASUS',
    category: 'Laptops',
    price: 2699,
    salePrice: 2499,
    rating: 4.8,
    reviewsCount: 129,
    stock: 11,
    sku: 'TB-ASUS-G16-4080',
    badge: 'Gaming Elite',
    isFeatured: false,
    isFlashDeal: false,
    images: [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80'
    ],
    shortDesc: 'Ultra-thin gaming powerhouse featuring 2.5K 240Hz ROG Nebula OLED display and CNC aluminum chassis.',
    description: 'Precision gaming meets luxury craftsmanship. The 2024 Zephyrus G16 is precision-machined from single-block aluminum, sporting the mesmerizing Slash Lighting array on the lid, paired with Intel Core Ultra 9 and NVIDIA GeForce RTX 4080 for mind-blowing performance.',
    specs: {
      'CPU': 'Intel Core Ultra 9 185H (16 Cores, 22 Threads, NPU AI)',
      'GPU': 'NVIDIA GeForce RTX 4080 12GB GDDR6',
      'RAM': '32GB LPDDR5X 7467MHz',
      'Screen': '16" 2.5K (2560x1600) OLED 240Hz 0.2ms G-Sync',
      'Chassis': 'CNC Unibody Aluminum, 1.85 kg weight'
    }
  },
  {
    id: 'prod-7',
    name: 'Apple iPhone 16 Pro (Titanium Black, 256GB)',
    brand: 'Apple',
    category: 'Smartphones',
    price: 1099,
    salePrice: 999,
    rating: 4.9,
    reviewsCount: 680,
    stock: 28,
    sku: 'TB-IP16P-256',
    badge: 'Hot Deal',
    isFeatured: true,
    isFlashDeal: true,
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=1000&q=80'
    ],
    shortDesc: 'Forged in titanium with the industry-defining A18 Pro chip, 4K 120 fps Dolby Vision and Camera Control.',
    description: 'iPhone 16 Pro features a strong and light titanium design with larger 6.3-inch Super Retina XDR display. Powered by the A18 Pro chip, it brings unprecedented efficiency and intelligence, plus Camera Control for effortless photo/video access.',
    specs: {
      'Chipset': 'Apple A18 Pro with 6-core GPU and Hardware Ray Tracing',
      'Camera': '48MP Fusion + 48MP Ultra Wide + 12MP 5x Telephoto',
      'Video': '4K 120 fps Dolby Vision, Studio-quality mics',
      'Display': '6.3" ProMotion 120Hz Always-On Super Retina XDR',
      'Battery': 'Up to 27 hours video playback'
    }
  },
  {
    id: 'prod-8',
    name: 'Bose QuietComfort Ultra Wireless Noise-Canceling Earbuds',
    brand: 'Bose',
    category: 'Audio',
    price: 299,
    salePrice: 249,
    rating: 4.7,
    reviewsCount: 290,
    stock: 40,
    sku: 'TB-BOSE-QCU-EAR',
    badge: 'Spatial Audio',
    isFeatured: false,
    isFlashDeal: false,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=1000&q=80'
    ],
    shortDesc: 'Groundbreaking spatial audio for more immersive listening that makes music feel more real than ever.',
    description: 'Listen to what you want, how you want. Bose QuietComfort Ultra Earbuds offer world-class noise cancellation, personalized sound calibration with CustomTune technology, and revolutionary Bose Immersive Audio.',
    specs: {
      'Audio': 'Bose Immersive Spatial Audio + CustomTune',
      'Battery': 'Up to 24 hours with wireless charging case',
      'Water Resistance': 'IPX4 sweat and weather resistant',
      'Controls': 'Touch controls with volume swipe'
    }
  },
  {
    id: 'prod-9',
    name: 'DJI Mini 4 Pro Drone (Fly More Combo Plus with RC 2)',
    brand: 'DJI',
    category: 'Accessories',
    price: 1159,
    salePrice: 1049,
    rating: 4.9,
    reviewsCount: 167,
    stock: 8,
    sku: 'TB-DJI-M4P-FMC',
    badge: 'Pro Creator',
    isFeatured: true,
    isFlashDeal: false,
    images: [
      'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1000&q=80'
    ],
    shortDesc: 'Under 249g ultra-light foldable drone with 4K/60fps HDR True Vertical Shooting and Omnidirectional Sensing.',
    description: 'DJI Mini 4 Pro is our most advanced mini drone to date. It integrates powerful imaging capabilities, omnidirectional obstacle sensing, ActiveTrack 360 with the new Trace Mode, and 20km FHD video transmission.',
    specs: {
      'Weight': '< 249 grams (no FAA registration required in many regions)',
      'Camera': '1/1.3-inch CMOS, 4K/60fps HDR, 4K/100fps Slow Motion',
      'Flight Time': 'Up to 45 minutes per Intelligent Flight Battery Plus',
      'Transmission': 'DJI O4 20km 1080p/60fps live feed',
      'Safety': 'Omnidirectional Vision Obstacle Avoidance'
    }
  },
  {
    id: 'prod-10',
    name: 'Keychron Q1 Pro Wireless Custom Mechanical Keyboard',
    brand: 'Keychron',
    category: 'Accessories',
    price: 219,
    salePrice: 199,
    rating: 4.8,
    reviewsCount: 145,
    stock: 19,
    sku: 'TB-KEY-Q1P-RGB',
    badge: 'Best Build',
    isFeatured: false,
    isFlashDeal: false,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1000&q=80'
    ],
    shortDesc: 'Full CNC aluminum body, 75% layout, QMK/VIA programmable, Bluetooth 5.1 & hot-swappable.',
    description: 'The Keychron Q1 Pro is a groundbreaking full metal wireless custom mechanical keyboard. With our double-gasket design, PBT keycaps, screw-in stabs, and QMK/VIA key remapping support, typing is pure bliss.',
    specs: {
      'Body': 'Full CNC Machined 6063 Aluminum',
      'Switches': 'Keychron K Pro Red (Lubed Hot-Swappable)',
      'Connectivity': 'Bluetooth 5.1 + Type-C Wired',
      'Battery': '4000mAh (Up to 300 hours typing without RGB)',
      'Compatibility': 'macOS / Windows / Linux'
    }
  },
  {
    id: 'prod-11',
    name: 'Google Pixel 9 Pro XL (Obsidian, 256GB)',
    brand: 'Google',
    category: 'Smartphones',
    price: 1199,
    salePrice: 1099,
    rating: 4.8,
    reviewsCount: 204,
    stock: 16,
    sku: 'TB-GOOG-P9PXL',
    badge: 'AI Master',
    isFeatured: false,
    isFlashDeal: true,
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=1000&q=80'
    ],
    shortDesc: 'Engineered by Google with Gemini Nano AI, pro-level triple camera system, and 7 years of OS updates.',
    description: 'Pixel 9 Pro XL is Google’s most powerful phone ever. Powered by the Tensor G4 chip, it unlocks the best of Google AI, unmatched computational photography, and an ultra-smooth 6.8-inch Super Actua display.',
    specs: {
      'Chipset': 'Google Tensor G4 with Titan M2 security coprocessor',
      'RAM': '16GB LPDDR5X for Gemini AI processing',
      'Camera': '50MP Wide + 48MP Quad PD Ultrawide + 48MP 5x Telephoto',
      'Display': '6.8" Super Actua LTPO OLED (1-120Hz, 3000 nits)',
      'Updates': '7 full years of Android OS and Security Drops'
    }
  },
  {
    id: 'prod-12',
    name: 'Nintendo Switch OLED Model (Neon Red & Blue Edition)',
    brand: 'Nintendo',
    category: 'Gaming',
    price: 349,
    salePrice: 319,
    rating: 4.8,
    reviewsCount: 630,
    stock: 25,
    sku: 'TB-NSW-OLED-RGB',
    badge: 'Family Favorite',
    isFeatured: false,
    isFlashDeal: false,
    images: [
      'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1612287233207-6b3a2b1660d5?auto=format&fit=crop&w=1000&q=80'
    ],
    shortDesc: 'Vibrant 7-inch OLED screen, wide adjustable kickstand, wired LAN dock, and 64GB internal storage.',
    description: 'Play anytime, anywhere with the vibrant 7-inch OLED screen of the Nintendo Switch - OLED Model system. Feast your eyes on vivid colors and crisp contrast when you play on the go.',
    specs: {
      'Screen': '7.0 inch vibrant OLED multi-touch screen',
      'Storage': '64 GB internal (microSD expandable)',
      'Modes': 'TV Mode, Tabletop Mode, Handheld Mode',
      'Battery': 'Up to 9 hours of gaming on a single charge'
    }
  }
];
