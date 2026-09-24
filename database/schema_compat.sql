CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  phone         VARCHAR(15)  NOT NULL,
  password      VARCHAR(255) NOT NULL,
  role          ENUM('CUSTOMER','ADMIN') NOT NULL DEFAULT 'CUSTOMER',
  is_active     TINYINT(1) NOT NULL DEFAULT 1,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME,
  INDEX idx_email (email),
  INDEX idx_role  (role)
);

CREATE TABLE IF NOT EXISTS vehicles (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name                VARCHAR(100) NOT NULL,
  vehicle_type        ENUM('Sedan','SUV','Traveller','Bus','Tempo') NOT NULL,
  registration_number VARCHAR(20)  NOT NULL UNIQUE,
  seating_capacity    TINYINT UNSIGNED NOT NULL,
  price_per_km        DECIMAL(8,2) NOT NULL,
  driver_charge       DECIMAL(8,2) NOT NULL DEFAULT 0,
  ac                  TINYINT(1) NOT NULL DEFAULT 1,
  pushback_seats      TINYINT(1) NOT NULL DEFAULT 0,
  music_system        TINYINT(1) NOT NULL DEFAULT 0,
  luggage_capacity    VARCHAR(50),
  description         TEXT,
  image_url           VARCHAR(500),
  status              ENUM('AVAILABLE','UNAVAILABLE','MAINTENANCE') NOT NULL DEFAULT 'AVAILABLE',
  created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME,
  INDEX idx_status          (status),
  INDEX idx_vehicle_type    (vehicle_type),
  INDEX idx_seating_capacity(seating_capacity)
);

CREATE TABLE IF NOT EXISTS drivers (
  id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name             VARCHAR(100) NOT NULL,
  phone            VARCHAR(15)  NOT NULL UNIQUE,
  license_number   VARCHAR(30)  NOT NULL UNIQUE,
  experience_years TINYINT UNSIGNED NOT NULL DEFAULT 0,
  rating           DECIMAL(3,2) NOT NULL DEFAULT 5.00,
  status           ENUM('AVAILABLE','UNAVAILABLE','ON_TRIP') NOT NULL DEFAULT 'AVAILABLE',
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME,
  INDEX idx_driver_status (status)
);

CREATE TABLE IF NOT EXISTS destinations (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  state       VARCHAR(100) NOT NULL,
  description TEXT,
  image_url   VARCHAR(500),
  status      ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  INDEX idx_dest_status (status)
);

CREATE TABLE IF NOT EXISTS tour_packages (
  id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  destination_id  INT UNSIGNED NOT NULL,
  name            VARCHAR(150) NOT NULL,
  duration_days   TINYINT UNSIGNED NOT NULL,
  duration_nights TINYINT UNSIGNED NOT NULL,
  starting_price  DECIMAL(10,2) NOT NULL,
  description     TEXT,
  image_url       VARCHAR(500),
  status          ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME,
  FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE RESTRICT,
  INDEX idx_pkg_status (status),
  INDEX idx_pkg_dest   (destination_id)
);

CREATE TABLE IF NOT EXISTS package_highlights (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  package_id  INT UNSIGNED NOT NULL,
  highlight   VARCHAR(200) NOT NULL,
  sort_order  TINYINT UNSIGNED NOT NULL DEFAULT 0,
  FOREIGN KEY (package_id) REFERENCES tour_packages(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS package_itinerary (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  package_id  INT UNSIGNED NOT NULL,
  day_number  TINYINT UNSIGNED NOT NULL,
  title       VARCHAR(150) NOT NULL,
  description TEXT,
  FOREIGN KEY (package_id) REFERENCES tour_packages(id) ON DELETE CASCADE,
  INDEX idx_itin_pkg (package_id)
);

CREATE TABLE IF NOT EXISTS bookings (
  id                 INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  booking_reference  VARCHAR(20) NOT NULL UNIQUE,
  user_id            INT UNSIGNED NOT NULL,
  vehicle_id         INT UNSIGNED NOT NULL,
  driver_id          INT UNSIGNED,
  from_location      VARCHAR(200) NOT NULL,
  to_location        VARCHAR(200) NOT NULL,
  travel_date        DATE NOT NULL,
  return_date        DATE,
  passengers         TINYINT UNSIGNED NOT NULL,
  trip_type          ENUM('ONE_WAY','ROUND_TRIP','LOCAL','MULTI_DAY') NOT NULL,
  distance_km        DECIMAL(8,2) NOT NULL DEFAULT 0,
  base_fare          DECIMAL(10,2) NOT NULL DEFAULT 0,
  driver_charge      DECIMAL(10,2) NOT NULL DEFAULT 0,
  toll_charge        DECIMAL(10,2) NOT NULL DEFAULT 0,
  parking_charge     DECIMAL(10,2) NOT NULL DEFAULT 0,
  night_charge       DECIMAL(10,2) NOT NULL DEFAULT 0,
  discount           DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_amount       DECIMAL(10,2) NOT NULL DEFAULT 0,
  payment_status     ENUM('PENDING','PAID','FAILED','REFUNDED') NOT NULL DEFAULT 'PENDING',
  booking_status     ENUM('PENDING','CONFIRMED','ASSIGNED','ONGOING','COMPLETED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  notes              TEXT,
  created_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME,
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE RESTRICT,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE RESTRICT,
  FOREIGN KEY (driver_id)  REFERENCES drivers(id)  ON DELETE SET NULL,
  INDEX idx_booking_ref     (booking_reference),
  INDEX idx_booking_user    (user_id),
  INDEX idx_booking_status  (booking_status),
  INDEX idx_booking_date    (travel_date)
);

CREATE TABLE IF NOT EXISTS reviews (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED NOT NULL,
  booking_id  INT UNSIGNED NOT NULL UNIQUE,
  vehicle_id  INT UNSIGNED NOT NULL,
  rating      TINYINT UNSIGNED NOT NULL,
  comment     TEXT,
  status      ENUM('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)    REFERENCES users(id)     ON DELETE CASCADE,
  FOREIGN KEY (booking_id) REFERENCES bookings(id)  ON DELETE CASCADE,
  FOREIGN KEY (vehicle_id) REFERENCES vehicles(id)  ON DELETE CASCADE,
  INDEX idx_review_vehicle (vehicle_id),
  INDEX idx_review_status  (status)
);

CREATE TABLE IF NOT EXISTS enquiries (
  id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL,
  phone      VARCHAR(15),
  subject    VARCHAR(200),
  message    TEXT NOT NULL,
  status     ENUM('NEW','READ','REPLIED','CLOSED') NOT NULL DEFAULT 'NEW',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_enquiry_status (status)
);

CREATE TABLE IF NOT EXISTS notifications (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     INT UNSIGNED NOT NULL,
  booking_id  INT UNSIGNED,
  title       VARCHAR(150) NOT NULL,
  message     TEXT NOT NULL,
  type        ENUM('BOOKING','PAYMENT','SYSTEM','PROMO') NOT NULL DEFAULT 'BOOKING',
  is_read     TINYINT(1) NOT NULL DEFAULT 0,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id)    REFERENCES users(id)    ON DELETE CASCADE,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
  INDEX idx_notif_user (user_id),
  INDEX idx_notif_read (is_read)
);
