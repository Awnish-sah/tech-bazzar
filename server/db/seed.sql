-- =============================================================================
-- TechBazzar E-Commerce Seed Data
-- Compatible with PostgreSQL 12+ and pgAdmin 4
-- =============================================================================

-- 1. Insert Categories
INSERT INTO categories (id, name, icon, count) VALUES
('all', 'All Products', 'Sparkles', 12),
('Smartphones', 'Smartphones', 'Smartphone', 3),
('Laptops', 'Laptops & PC', 'Laptop', 2),
('Audio', 'Audio & Sound', 'Headphones', 2),
('Wearables', 'Smart Watches', 'Watch', 1),
('Gaming', 'Gaming Gear', 'Gamepad2', 2),
('Accessories', 'Accessories', 'Layers', 2)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    icon = EXCLUDED.icon,
    count = EXCLUDED.count;

-- 2. Insert Products
INSERT INTO products (
    id, name, brand, category, price, sale_price, rating, reviews_count,
    stock, sku, badge, is_featured, is_flash_deal, images, short_desc, description, specs
) VALUES
(
    'prod-1',
    'Apple MacBook Pro 16" (M3 Max, 64GB, 1TB SSD)',
    'Apple',
    'Laptops',
    3499.00,
    3199.00,
    4.9,
    238,
    14,
    'TB-MBP16-M3M',
    'Flagship Tech',
    TRUE,
    TRUE,
    '[
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1000&q=80"
    ]'::jsonb,
    'The ultimate pro laptop. Turbocharged by the revolutionary M3 Max chip with 16-core CPU and 40-core GPU.',
    'The 16-inch MacBook Pro blasts forward with M3 Max, an extraordinarily advanced chip that brings massive performance and capability for the most extreme workflows. With industry-leading battery life — up to 22 hours — and a breathtaking Liquid Retina XDR display, it is a pro laptop without equal.',
    '{
        "Processor": "Apple M3 Max (16-core CPU, 40-core GPU)",
        "Memory": "64GB Unified Memory",
        "Storage": "1TB Superfast PCIe NVMe SSD",
        "Display": "16.2\" Liquid Retina XDR (3456 x 2234), 120Hz ProMotion",
        "Battery Life": "Up to 22 hours playback",
        "Weight": "2.16 kg (4.8 lbs)",
        "Ports": "3x Thunderbolt 4, HDMI, SDXC, MagSafe 3"
    }'::jsonb
),
(
    'prod-2',
    'Samsung Galaxy S24 Ultra 5G (Titanium Gray, 512GB)',
    'Samsung',
    'Smartphones',
    1419.00,
    1299.00,
    4.8,
    315,
    22,
    'TB-SGS24U-512',
    'Best Seller',
    TRUE,
    FALSE,
    '[
        "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1000&q=80"
    ]'::jsonb,
    'Meet Galaxy S24 Ultra with Galaxy AI, Titanium exterior, 200MP camera and built-in S Pen.',
    'Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, you can unleash whole new levels of creativity, productivity and possibility — starting with the most important device in your life: your smartphone. Encased in durable titanium armor.',
    '{
        "Processor": "Snapdragon 8 Gen 3 for Galaxy (4nm)",
        "RAM": "12GB LPDDR5X",
        "Storage": "512GB UFS 4.0",
        "Camera": "200MP Quad Tele System with 100x Space Zoom",
        "Battery": "5000 mAh with 45W Fast Charging",
        "Display": "6.8\" Dynamic AMOLED 2X, 1-120Hz, 2600 nits"
    }'::jsonb
),
(
    'prod-3',
    'Sony WH-1000XM5 Wireless Noise-Canceling Headphones',
    'Sony',
    'Audio',
    399.00,
    329.00,
    4.9,
    520,
    35,
    'TB-SNY-WH1000XM5',
    'Editor Choice',
    TRUE,
    TRUE,
    '[
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80"
    ]'::jsonb,
    'Industry-leading noise canceling with two processors and 8 microphones for unparalleled quiet sound.',
    'The WH-1000XM5 headphones rewrite the rules for distraction-free listening. Two processors control 8 microphones for unprecedented noise cancellation and exceptional call quality. With a newly developed driver, DSEE - Extreme and Hi-Res audio support, sound has never been purer.',
    '{
        "Noise Canceling": "Dual Processor V1 + HD QN1 Chipset",
        "Battery Life": "Up to 30 Hours (3 min charge = 3 hours playback)",
        "Connectivity": "Bluetooth 5.2, LDAC, Multi-point connection",
        "Weight": "250g ultra-comfortable soft fit leather",
        "Microphones": "4 beamforming mics with AI noise reduction"
    }'::jsonb
),
(
    'prod-4',
    'Apple Watch Ultra 2 (Titanium Case with Ocean Band)',
    'Apple',
    'Wearables',
    799.00,
    749.00,
    4.9,
    184,
    9,
    'TB-AWU2-49TI',
    'Popular',
    TRUE,
    FALSE,
    '[
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=80"
    ]'::jsonb,
    'Rugged and capable, built for endurance athletes, outdoor adventurers, and water sports enthusiasts.',
    'The most rugged and capable Apple Watch pushes the limits again. Featuring the all-new S9 SiP, a magical new way to use your watch without touching the screen, and the brightest Apple display ever at 3000 nits.',
    '{
        "Case": "49mm Aerospace-grade Titanium",
        "Display": "Always-On Retina display, 3000 nits brightness",
        "Battery": "Up to 36 hours regular, 72 hours Low Power Mode",
        "Water Resistance": "100m water resistant, 40m recreational dive",
        "Sensors": "Precision dual-frequency GPS, ECG, Blood Oxygen, Depth Gauge"
    }'::jsonb
),
(
    'prod-5',
    'Sony PlayStation 5 Pro Console (2TB SSD Custom Edition)',
    'Sony',
    'Gaming',
    699.00,
    669.00,
    4.9,
    410,
    7,
    'TB-PS5-PRO-2TB',
    'Limited Stock',
    TRUE,
    TRUE,
    '[
        "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80"
    ]'::jsonb,
    'Experience games with breathtaking fidelity, advanced ray tracing, and PlayStation Spectral Super Resolution.',
    'With the PlayStation 5 Pro console, the worlds greatest game creators can enhance their games with incredible features like advanced ray tracing, super sharp image clarity on 4K TVs, and ultra-high framerate gameplay up to 120 FPS.',
    '{
        "Storage": "2TB Ultra-High Speed Custom NVMe SSD",
        "Graphics": "Advanced RDNA GPU with PSSR AI Upscaling",
        "Output": "4K 120Hz support, 8K output, HDR",
        "Audio": "Tempest 3D AudioTech",
        "Controller": "DualSense Wireless Controller with Haptic Feedback"
    }'::jsonb
),
(
    'prod-6',
    'ASUS ROG Zephyrus G16 OLED (RTX 4080, Core Ultra 9)',
    'ASUS',
    'Laptops',
    2699.00,
    2499.00,
    4.8,
    129,
    11,
    'TB-ASUS-G16-4080',
    'Gaming Elite',
    FALSE,
    FALSE,
    '[
        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80"
    ]'::jsonb,
    'Ultra-thin gaming powerhouse featuring 2.5K 240Hz ROG Nebula OLED display and CNC aluminum chassis.',
    'Precision gaming meets luxury craftsmanship. The 2024 Zephyrus G16 is precision-machined from single-block aluminum, sporting the mesmerizing Slash Lighting array on the lid, paired with Intel Core Ultra 9 and NVIDIA GeForce RTX 4080 for mind-blowing performance.',
    '{
        "CPU": "Intel Core Ultra 9 185H (16 Cores, 22 Threads, NPU AI)",
        "GPU": "NVIDIA GeForce RTX 4080 12GB GDDR6",
        "RAM": "32GB LPDDR5X 7467MHz",
        "Screen": "16\" 2.5K (2560x1600) OLED 240Hz 0.2ms G-Sync",
        "Chassis": "CNC Unibody Aluminum, 1.85 kg weight"
    }'::jsonb
),
(
    'prod-7',
    'Apple iPhone 16 Pro (Titanium Black, 256GB)',
    'Apple',
    'Smartphones',
    1099.00,
    999.00,
    4.9,
    680,
    28,
    'TB-IP16P-256',
    'Hot Deal',
    TRUE,
    TRUE,
    '[
        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=1000&q=80"
    ]'::jsonb,
    'Forged in titanium with the industry-defining A18 Pro chip, 4K 120 fps Dolby Vision and Camera Control.',
    'iPhone 16 Pro features a strong and light titanium design with larger 6.3-inch Super Retina XDR display. Powered by the A18 Pro chip, it brings unprecedented efficiency and intelligence, plus Camera Control for effortless photo/video access.',
    '{
        "Chipset": "Apple A18 Pro with 6-core GPU and Hardware Ray Tracing",
        "Camera": "48MP Fusion + 48MP Ultra Wide + 12MP 5x Telephoto",
        "Video": "4K 120 fps Dolby Vision, Studio-quality mics",
        "Display": "6.3\" ProMotion 120Hz Always-On Super Retina XDR",
        "Battery": "Up to 27 hours video playback"
    }'::jsonb
),
(
    'prod-8',
    'Bose QuietComfort Ultra Wireless Noise-Canceling Earbuds',
    'Bose',
    'Audio',
    299.00,
    249.00,
    4.7,
    290,
    40,
    'TB-BOSE-QCU-EAR',
    'Spatial Audio',
    FALSE,
    FALSE,
    '[
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=1000&q=80"
    ]'::jsonb,
    'Groundbreaking spatial audio for more immersive listening that makes music feel more real than ever.',
    'Listen to what you want, how you want. Bose QuietComfort Ultra Earbuds offer world-class noise cancellation, personalized sound calibration with CustomTune technology, and revolutionary Bose Immersive Audio.',
    '{
        "Audio": "Bose Immersive Spatial Audio + CustomTune",
        "Battery": "Up to 24 hours with wireless charging case",
        "Water Resistance": "IPX4 sweat and weather resistant",
        "Controls": "Touch controls with volume swipe"
    }'::jsonb
),
(
    'prod-9',
    'DJI Mini 4 Pro Drone (Fly More Combo Plus with RC 2)',
    'DJI',
    'Accessories',
    1159.00,
    1049.00,
    4.9,
    167,
    8,
    'TB-DJI-M4P-FMC',
    'Pro Creator',
    TRUE,
    FALSE,
    '[
        "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1000&q=80"
    ]'::jsonb,
    'Under 249g ultra-light foldable drone with 4K/60fps HDR True Vertical Shooting and Omnidirectional Sensing.',
    'DJI Mini 4 Pro is our most advanced mini drone to date. It integrates powerful imaging capabilities, omnidirectional obstacle sensing, ActiveTrack 360 with the new Trace Mode, and 20km FHD video transmission.',
    '{
        "Weight": "< 249 grams (no FAA registration required in many regions)",
        "Camera": "1/1.3-inch CMOS, 4K/60fps HDR, 4K/100fps Slow Motion",
        "Flight Time": "Up to 45 minutes per Intelligent Flight Battery Plus",
        "Transmission": "DJI O4 20km 1080p/60fps live feed",
        "Safety": "Omnidirectional Vision Obstacle Avoidance"
    }'::jsonb
),
(
    'prod-10',
    'Keychron Q1 Pro Wireless Custom Mechanical Keyboard',
    'Keychron',
    'Accessories',
    219.00,
    199.00,
    4.8,
    145,
    19,
    'TB-KEY-Q1P-RGB',
    'Best Build',
    FALSE,
    FALSE,
    '[
        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1000&q=80"
    ]'::jsonb,
    'Full CNC aluminum body, 75% layout, QMK/VIA programmable, Bluetooth 5.1 & hot-swappable.',
    'The Keychron Q1 Pro is a groundbreaking full metal wireless custom mechanical keyboard. With our double-gasket design, PBT keycaps, screw-in stabs, and QMK/VIA key remapping support, typing is pure bliss.',
    '{
        "Body": "Full CNC Machined 6063 Aluminum",
        "Switches": "Keychron K Pro Red (Lubed Hot-Swappable)",
        "Connectivity": "Bluetooth 5.1 + Type-C Wired",
        "Battery": "4000mAh (Up to 300 hours typing without RGB)",
        "Compatibility": "macOS / Windows / Linux"
    }'::jsonb
),
(
    'prod-11',
    'Google Pixel 9 Pro XL (Obsidian, 256GB)',
    'Google',
    'Smartphones',
    1199.00,
    1099.00,
    4.8,
    204,
    16,
    'TB-GOOG-P9PXL',
    'AI Master',
    FALSE,
    TRUE,
    '[
        "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=1000&q=80"
    ]'::jsonb,
    'Engineered by Google with Gemini Nano AI, pro-level triple camera system, and 7 years of OS updates.',
    'Pixel 9 Pro XL is Google’s most powerful phone ever. Powered by the Tensor G4 chip, it unlocks the best of Google AI, unmatched computational photography, and an ultra-smooth 6.8-inch Super Actua display.',
    '{
        "Chipset": "Google Tensor G4 with Titan M2 security coprocessor",
        "RAM": "16GB LPDDR5X for Gemini AI processing",
        "Camera": "50MP Wide + 48MP Quad PD Ultrawide + 48MP 5x Telephoto",
        "Display": "6.8\" Super Actua LTPO OLED (1-120Hz, 3000 nits)",
        "Updates": "7 full years of Android OS and Security Drops"
    }'::jsonb
),
(
    'prod-12',
    'Nintendo Switch OLED Model (Neon Red & Blue Edition)',
    'Nintendo',
    'Gaming',
    349.00,
    319.00,
    4.8,
    630,
    25,
    'TB-NSW-OLED-RGB',
    'Family Favorite',
    FALSE,
    FALSE,
    '[
        "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1612287233207-6b3a2b1660d5?auto=format&fit=crop&w=1000&q=80"
    ]'::jsonb,
    'Vibrant 7-inch OLED screen, wide adjustable kickstand, wired LAN dock, and 64GB internal storage.',
    'Play anytime, anywhere with the vibrant 7-inch OLED screen of the Nintendo Switch - OLED Model system. Feast your eyes on vivid colors and crisp contrast when you play on the go.',
    '{
        "Screen": "7.0 inch vibrant OLED multi-touch screen",
        "Storage": "64 GB internal (microSD expandable)",
        "Modes": "TV Mode, Tabletop Mode, Handheld Mode",
        "Battery": "Up to 9 hours of gaming on a single charge"
    }'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    brand = EXCLUDED.brand,
    category = EXCLUDED.category,
    price = EXCLUDED.price,
    sale_price = EXCLUDED.sale_price,
    stock = EXCLUDED.stock,
    is_featured = EXCLUDED.is_featured,
    is_flash_deal = EXCLUDED.is_flash_deal,
    images = EXCLUDED.images,
    short_desc = EXCLUDED.short_desc,
    description = EXCLUDED.description,
    specs = EXCLUDED.specs;

-- 3. Insert Customers
INSERT INTO customers (id, name, email, phone, address, city) VALUES
(1, 'Alex Rivera', 'alex.rivera@example.com', '+1 (555) 234-5678', '742 Evergreen Terrace', 'Springfield'),
(2, 'Sophia Chen', 'sophia.chen@example.com', '+1 (555) 987-6543', '120 Market Street, Suite 400', 'San Francisco')
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Demo Orders
INSERT INTO orders (
    id, customer_id, customer_name, customer_email, customer_phone,
    customer_address, customer_city, total, payment_method, status
) VALUES
(
    'TB-847291-3012',
    1,
    'Alex Rivera',
    'alex.rivera@example.com',
    '+1 (555) 234-5678',
    '742 Evergreen Terrace',
    'Springfield, OR',
    3528.00,
    'Credit Card',
    'Delivered'
),
(
    'TB-921473-8941',
    2,
    'Sophia Chen',
    'sophia.chen@example.com',
    '+1 (555) 987-6543',
    '120 Market Street, Suite 400',
    'San Francisco, CA',
    999.00,
    'UPI / Wallet',
    'Processing'
)
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Order Items
INSERT INTO order_items (order_id, product_id, name, price, quantity, image) VALUES
('TB-847291-3012', 'prod-1', 'Apple MacBook Pro 16" (M3 Max, 64GB, 1TB SSD)', 3199.00, 1, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80'),
('TB-847291-3012', 'prod-3', 'Sony WH-1000XM5 Wireless Noise-Canceling Headphones', 329.00, 1, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80'),
('TB-921473-8941', 'prod-7', 'Apple iPhone 16 Pro (Titanium Black, 256GB)', 999.00, 1, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=600&q=80')
ON CONFLICT DO NOTHING;

-- 6. Insert Default Admin User (admin@techbazzar.com / admin123)
INSERT INTO admin_users (email, password_hash, role) VALUES
('admin@techbazzar.com', 'admin123', 'admin')
ON CONFLICT (email) DO NOTHING;

