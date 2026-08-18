-- ============================================================
-- TravelGo Seed Data — Demo records for development/testing
-- Run AFTER schema.sql
-- ============================================================

USE travelgo;

-- ============================================================
-- USERS
-- Passwords below are bcrypt hashes of 'password123'
-- In production NEVER insert plain-text passwords
-- ============================================================
INSERT INTO users (name, email, phone, password, role) VALUES
('Admin User',      'admin@travelgo.in',   '9000000001', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN'),
('Rahul Sharma',    'rahul@example.com',   '9812345678', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'CUSTOMER'),
('Priya Patel',     'priya@example.com',   '9823456789', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'CUSTOMER'),
('Amit Singh',      'amit@example.com',    '9834567890', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'CUSTOMER'),
('Sneha Kapoor',    'sneha@example.com',   '9845678901', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'CUSTOMER'),
('Vikram Yadav',    'vikram@example.com',  '9856789012', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'CUSTOMER');

-- ============================================================
-- VEHICLES
-- ============================================================
INSERT INTO vehicles (name, vehicle_type, registration_number, seating_capacity, price_per_km, driver_charge, ac, pushback_seats, music_system, luggage_capacity, description, image_url, status) VALUES
('9 Seater Traveller',        'Traveller', 'DL01AB1234', 9,  18.00, 2000.00, TRUE,  FALSE, TRUE,  'Medium',      'Ideal for small family trips and friend groups. Comfortable seating with good legroom.',                'https://placehold.co/600x400/dbeafe/1e40af?text=9+Seater+Traveller',        'AVAILABLE'),
('12 Seater Traveller',       'Traveller', 'DL02CD5678', 12, 22.00, 2200.00, TRUE,  TRUE,  TRUE,  'Large',       'Premium traveller with pushback seats, perfect for long journeys to hill stations.',                  'https://placehold.co/600x400/dbeafe/1e40af?text=12+Seater+Traveller',       'AVAILABLE'),
('16 Seater Traveller',       'Traveller', 'DL03EF9012', 16, 26.00, 2500.00, TRUE,  TRUE,  TRUE,  'Large',       'Spacious traveller ideal for medium groups, corporate outings and school picnics.',                   'https://placehold.co/600x400/dbeafe/1e40af?text=16+Seater+Traveller',       'AVAILABLE'),
('20 Seater Traveller',       'Traveller', 'DL04GH3456', 20, 30.00, 2800.00, TRUE,  TRUE,  TRUE,  'Extra Large', 'Perfect for large family gatherings, pilgrimages and group tours.',                                  'https://placehold.co/600x400/dbeafe/1e40af?text=20+Seater+Traveller',       'AVAILABLE'),
('26 Seater Mini Bus',        'Bus',       'DL05IJ7890', 26, 35.00, 3200.00, TRUE,  TRUE,  TRUE,  'Extra Large', 'Large group travel made comfortable. Ideal for corporate events and college trips.',                 'https://placehold.co/600x400/dbeafe/1e40af?text=26+Seater+Mini+Bus',        'AVAILABLE'),
('Toyota Innova Crysta',      'SUV',       'DL06KL1234', 7,  16.00, 1800.00, TRUE,  FALSE, TRUE,  'Medium',      'Premium 7-seater SUV. Perfect for family trips and business travel. Very comfortable ride.',          'https://placehold.co/600x400/dcfce7/166534?text=Innova+Crysta',             'AVAILABLE'),
('Toyota Innova (Standard)',  'SUV',       'DL07MN5678', 7,  13.00, 1600.00, TRUE,  FALSE, TRUE,  'Medium',      'Reliable 7-seater SUV for city and intercity travel. Great mileage and comfortable seating.',         'https://placehold.co/600x400/dcfce7/166534?text=Innova+Standard',           'AVAILABLE'),
('Sedan (Swift Dzire)',       'Sedan',     'DL08OP9012', 4,  12.00, 1500.00, TRUE,  FALSE, TRUE,  'Small',       'Compact and fuel-efficient sedan. Best for 1-4 passengers for city or short-distance trips.',         'https://placehold.co/600x400/fef9c3/854d0e?text=Swift+Dzire',               'AVAILABLE'),
('SUV (Ertiga)',              'SUV',       'DL09QR3456', 7,  14.00, 1700.00, TRUE,  FALSE, TRUE,  'Medium',      'Spacious 7-seater MPV. Great for families who need extra space without the size of a traveller.',     'https://placehold.co/600x400/dcfce7/166534?text=Ertiga+SUV',                'AVAILABLE'),
('Tempo Traveller (Luxury)',  'Tempo',     'DL10ST7890', 12, 25.00, 2400.00, TRUE,  TRUE,  TRUE,  'Large',       'Luxury tempo traveller with reclining seats, LED lights and charging ports. Premium experience.',     'https://placehold.co/600x400/fce7f3/9d174d?text=Luxury+Tempo',              'AVAILABLE'),
('14 Seater Traveller',       'Traveller', 'DL11UV1234', 14, 24.00, 2300.00, TRUE,  TRUE,  TRUE,  'Large',       'Mid-size traveller with pushback seats. Good balance of capacity and comfort.',                       'https://placehold.co/600x400/dbeafe/1e40af?text=14+Seater+Traveller',       'AVAILABLE'),
('Force Urbania (13 Seater)', 'Traveller', 'DL12WX5678', 13, 23.00, 2250.00, TRUE,  TRUE,  TRUE,  'Large',       'Modern Force Urbania with lounge-style seating. Premium choice for small group luxury travel.',        'https://placehold.co/600x400/ede9fe/5b21b6?text=Force+Urbania',             'AVAILABLE');

-- ============================================================
-- DRIVERS
-- ============================================================
INSERT INTO drivers (name, phone, license_number, experience_years, rating, status) VALUES
('Ramesh Kumar',   '9711111111', 'DL-0119850001111', 12, 4.8, 'AVAILABLE'),
('Suresh Sharma',  '9722222222', 'DL-0119880002222', 9,  4.7, 'AVAILABLE'),
('Mahesh Singh',   '9733333333', 'UP-8520190003333', 7,  4.9, 'AVAILABLE'),
('Dinesh Yadav',   '9744444444', 'HR-1020000004444', 15, 4.6, 'AVAILABLE'),
('Rajesh Verma',   '9755555555', 'DL-0120050005555', 6,  4.8, 'AVAILABLE'),
('Kamlesh Gupta',  '9766666666', 'RJ-1420100006666', 11, 4.7, 'ON_TRIP'),
('Santosh Tiwari', '9777777777', 'UP-6520150007777', 8,  4.5, 'AVAILABLE'),
('Harish Patel',   '9788888888', 'GJ-0120120008888', 5,  4.9, 'AVAILABLE');

-- ============================================================
-- DESTINATIONS
-- ============================================================
INSERT INTO destinations (name, state, description, image_url, status) VALUES
('Manali',     'Himachal Pradesh', 'Gateway to the Himalayas — known for snow-capped mountains, Rohtang Pass and adventure sports.',  'https://placehold.co/600x400/dbeafe/1e40af?text=Manali',     'ACTIVE'),
('Shimla',     'Himachal Pradesh', 'The Queen of Hills — colonial architecture, Mall Road and scenic mountain views.',                 'https://placehold.co/600x400/dcfce7/166534?text=Shimla',     'ACTIVE'),
('Rishikesh',  'Uttarakhand',      'The Yoga Capital of the World — Ganga aarti, river rafting and spiritual retreats.',               'https://placehold.co/600x400/fef9c3/854d0e?text=Rishikesh',  'ACTIVE'),
('Mussoorie',  'Uttarakhand',      'The Queen of the Hills in Uttarakhand — waterfalls, viewpoints and colonial charm.',               'https://placehold.co/600x400/e0f2fe/0369a1?text=Mussoorie',  'ACTIVE'),
('Jaipur',     'Rajasthan',        'The Pink City — magnificent forts, palaces and vibrant Rajasthani culture.',                       'https://placehold.co/600x400/fce7f3/9d174d?text=Jaipur',     'ACTIVE'),
('Agra',       'Uttar Pradesh',    'Home of the Taj Mahal — a UNESCO World Heritage Site and symbol of eternal love.',                 'https://placehold.co/600x400/ede9fe/5b21b6?text=Agra',       'ACTIVE'),
('Kashmir',    'J&K',              'Heaven on Earth — Dal Lake, Mughal gardens, snow peaks and shikara rides.',                        'https://placehold.co/600x400/cffafe/0e7490?text=Kashmir',    'ACTIVE'),
('Nainital',   'Uttarakhand',      'The Lake City — Naini Lake, boating, Mall Road and panoramic Himalayan views.',                    'https://placehold.co/600x400/d1fae5/065f46?text=Nainital',   'ACTIVE'),
('Varanasi',   'Uttar Pradesh',    'The Spiritual Capital of India — Ganga ghats, morning aarti and ancient temples.',                 'https://placehold.co/600x400/ffedd5/9a3412?text=Varanasi',   'ACTIVE'),
('Haridwar',   'Uttarakhand',      'Holy city on the banks of the Ganga — Har Ki Pauri ghat and evening Ganga aarti.',                 'https://placehold.co/600x400/fef9c3/854d0e?text=Haridwar',   'ACTIVE');

-- ============================================================
-- TOUR PACKAGES
-- ============================================================
INSERT INTO tour_packages (destination_id, name, duration_days, duration_nights, starting_price, description, image_url, status) VALUES
(1, 'Manali Adventure Tour',       5, 4, 12000.00, 'Experience snow-capped mountains, Rohtang Pass, Solang Valley and local Manali culture on this 5-day adventure.',               'https://placehold.co/600x400/dbeafe/1e40af?text=Manali+Tour',    'ACTIVE'),
(2, 'Shimla Heritage Tour',        4, 3,  9500.00, 'Explore the colonial charm of Shimla. Visit Mall Road, Christ Church, Jakhu Temple and enjoy panoramic mountain views.',       'https://placehold.co/600x400/dcfce7/166534?text=Shimla+Tour',    'ACTIVE'),
(3, 'Rishikesh Spiritual Tour',    3, 2,  6500.00, 'Discover the yoga capital of the world. Enjoy Ganga aarti, river rafting, bungee jumping and spiritual experiences.',          'https://placehold.co/600x400/fef9c3/854d0e?text=Rishikesh+Tour', 'ACTIVE'),
(5, 'Jaipur Royal Tour',           3, 2,  7500.00, 'Walk through the Pink City. Visit Amber Fort, Hawa Mahal, City Palace and experience authentic Rajasthani cuisine.',           'https://placehold.co/600x400/fce7f3/9d174d?text=Jaipur+Tour',   'ACTIVE'),
(6, 'Agra Heritage Tour',          2, 1,  5000.00, 'Visit the iconic Taj Mahal, Agra Fort and Fatehpur Sikri. A journey through Mughal history and architecture.',                 'https://placehold.co/600x400/ede9fe/5b21b6?text=Agra+Tour',     'ACTIVE'),
(7, 'Kashmir Valley Tour',         6, 5, 18000.00, 'Experience heaven on earth — Dal Lake shikara rides, Mughal gardens, Gulmarg snow and Pahalgam scenic beauty.',               'https://placehold.co/600x400/cffafe/0e7490?text=Kashmir+Tour',  'ACTIVE'),
(4, 'Mussoorie Getaway',           3, 2,  8000.00, 'Quick escape to the Queen of the Hills. Visit Kempty Falls, Gun Hill, Camel Back Road and enjoy cool mountain air.',           'https://placehold.co/600x400/e0f2fe/0369a1?text=Mussoorie+Tour','ACTIVE'),
(8, 'Nainital Lake Tour',          3, 2,  7000.00, 'Explore the beautiful Naini Lake, Snow View Point, Naina Devi Temple and enjoy boating and cable car rides.',                 'https://placehold.co/600x400/d1fae5/065f46?text=Nainital+Tour', 'ACTIVE');

-- ============================================================
-- PACKAGE HIGHLIGHTS
-- ============================================================
INSERT INTO package_highlights (package_id, highlight, sort_order) VALUES
(1, 'Rohtang Pass Visit',        1),
(1, 'Solang Valley',             2),
(1, 'Hadimba Temple',            3),
(1, 'Old Manali',                4),
(2, 'Mall Road Shimla',          1),
(2, 'Christ Church',             2),
(2, 'Jakhu Temple',              3),
(3, 'Ganga Aarti',               1),
(3, 'River Rafting',             2),
(3, 'Laxman Jhula',              3),
(3, 'Bungee Jumping',            4),
(4, 'Amber Fort',                1),
(4, 'Hawa Mahal',                2),
(4, 'City Palace',               3),
(4, 'Jantar Mantar',             4),
(5, 'Taj Mahal Sunrise',         1),
(5, 'Agra Fort',                 2),
(5, 'Fatehpur Sikri',            3),
(6, 'Dal Lake Shikara',          1),
(6, 'Gulmarg Snow',              2),
(6, 'Mughal Gardens',            3),
(6, 'Pahalgam Valley',           4);

-- ============================================================
-- PACKAGE ITINERARIES
-- ============================================================
INSERT INTO package_itinerary (package_id, day_number, title, description) VALUES
-- Manali 5-day
(1, 1, 'Delhi → Manali',         'Depart from Delhi by overnight traveller. Scenic drive through Kullu valley.'),
(1, 2, 'Manali Arrival',         'Check in and local sightseeing — Hadimba Temple, Old Manali, Manu Temple.'),
(1, 3, 'Solang Valley',          'Full day excursion to Solang Valley — snow activities and paragliding.'),
(1, 4, 'Rohtang Pass',           'Early morning visit to Rohtang Pass (subject to permit availability).'),
(1, 5, 'Manali → Delhi',         'Breakfast and departure. Overnight journey back to Delhi.'),
-- Shimla 4-day
(2, 1, 'Delhi → Shimla',         'Depart from Delhi. Arrive Shimla. Evening stroll on Mall Road.'),
(2, 2, 'Shimla Sightseeing',     'Visit Jakhu Temple, Christ Church, The Ridge and Scandal Point.'),
(2, 3, 'Kufri Day Trip',         'Excursion to Kufri — snow activities, yak riding and scenic views.'),
(2, 4, 'Shimla → Delhi',         'Morning sightseeing, lunch and departure back to Delhi.');

-- ============================================================
-- SAMPLE BOOKINGS
-- ============================================================
INSERT INTO bookings (booking_reference, user_id, vehicle_id, driver_id, from_location, to_location, travel_date, return_date, passengers, trip_type, distance_km, base_fare, driver_charge, toll_charge, parking_charge, night_charge, discount, total_amount, payment_status, booking_status) VALUES
('TG-2026-000001', 2, 2, 1, 'Delhi', 'Manali',    '2026-09-15', '2026-09-20', 10, 'ROUND_TRIP', 540.00, 11880.00, 2200.00, 1800.00, 500.00, 1000.00, 0.00, 17380.00, 'PAID',    'COMPLETED'),
('TG-2026-000002', 3, 6, 2, 'Jaipur', 'Agra',     '2026-09-20', '2026-09-21',  5, 'ROUND_TRIP', 240.00,  3840.00, 1800.00,  800.00, 200.00,    0.00, 0.00,  6640.00, 'PAID',    'COMPLETED'),
('TG-2026-000003', 4, 3, 3, 'Delhi', 'Shimla',    '2026-10-05', '2026-10-08', 14, 'ROUND_TRIP', 360.00,  9360.00, 2500.00, 1200.00, 400.00,  600.00, 0.00, 14060.00, 'PAID',    'CONFIRMED'),
('TG-2026-000004', 5, 7, 4, 'Delhi', 'Rishikesh', '2026-10-10', NULL,          6, 'ONE_WAY',    250.00,  3250.00, 1600.00,  600.00, 100.00,    0.00, 0.00,  5550.00, 'PENDING', 'PENDING'),
('TG-2026-000005', 2, 1, 5, 'Noida', 'Agra',      '2026-10-15', NULL,          8, 'ONE_WAY',    200.00,  3600.00, 2000.00,  500.00, 100.00,    0.00, 0.00,  6200.00, 'PENDING', 'PENDING');

-- ============================================================
-- SAMPLE REVIEWS (only for completed bookings)
-- ============================================================
INSERT INTO reviews (user_id, booking_id, vehicle_id, rating, comment, status) VALUES
(2, 1, 2, 5, 'Excellent service! The 12 seater traveller was spotless and the driver Ramesh was very professional. Our Manali trip was absolutely amazing. Highly recommend TravelGo!', 'APPROVED'),
(3, 2, 6, 5, 'Booked an Innova Crysta for a family trip from Jaipur to Agra. Very smooth booking process. Vehicle was well-maintained and driver knew all the routes.', 'APPROVED');
