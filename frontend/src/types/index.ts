// types/index.ts
// This file defines the "shape" of all data objects used across the app.
// TypeScript uses these to catch mistakes — if you try to access a property
// that doesn't exist, TypeScript will warn you immediately.

// ─────────────────────────────────────────────
// USER
// ─────────────────────────────────────────────
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'CUSTOMER' | 'ADMIN';
  created_at: string;
}

// ─────────────────────────────────────────────
// VEHICLE
// ─────────────────────────────────────────────
export interface Vehicle {
  id: number;
  name: string;
  vehicle_type: string;
  registration_number: string;
  seating_capacity: number;
  price_per_km: number;
  driver_charge: number;
  ac: boolean;
  pushback_seats: boolean;
  music_system: boolean;
  luggage_capacity: string;
  description: string;
  image_url: string;
  status: 'AVAILABLE' | 'UNAVAILABLE' | 'MAINTENANCE';
  created_at: string;
}

// ─────────────────────────────────────────────
// DRIVER
// ─────────────────────────────────────────────
export interface Driver {
  id: number;
  name: string;
  phone: string;
  license_number: string;
  experience_years: number;
  rating: number;
  status: 'AVAILABLE' | 'UNAVAILABLE' | 'ON_TRIP';
}

// ─────────────────────────────────────────────
// DESTINATION
// ─────────────────────────────────────────────
export interface Destination {
  id: number;
  name: string;
  state: string;
  description: string;
  image_url: string;
  status: 'ACTIVE' | 'INACTIVE';
}

// ─────────────────────────────────────────────
// TOUR PACKAGE
// ─────────────────────────────────────────────
export interface TourPackage {
  id: number;
  destination_id: number;
  destination_name?: string;
  name: string;
  duration_days: number;
  duration_nights: number;
  starting_price: number;
  description: string;
  image_url: string;
  status: 'ACTIVE' | 'INACTIVE';
  highlights?: string[];
}

export interface PackageItinerary {
  id: number;
  package_id: number;
  day_number: number;
  title: string;
  description: string;
}

// ─────────────────────────────────────────────
// BOOKING
// ─────────────────────────────────────────────
export type TripType = 'ONE_WAY' | 'ROUND_TRIP' | 'LOCAL' | 'MULTI_DAY';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'ASSIGNED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface Booking {
  id: number;
  booking_reference: string;
  user_id: number;
  vehicle_id: number;
  driver_id?: number;
  from_location: string;
  to_location: string;
  travel_date: string;
  return_date?: string;
  passengers: number;
  trip_type: TripType;
  distance_km: number;
  base_fare: number;
  driver_charge: number;
  toll_charge: number;
  parking_charge: number;
  night_charge: number;
  discount: number;
  total_amount: number;
  payment_status: PaymentStatus;
  booking_status: BookingStatus;
  created_at: string;
  // Joined fields
  vehicle_name?: string;
  driver_name?: string;
  customer_name?: string;
}

// ─────────────────────────────────────────────
// REVIEW
// ─────────────────────────────────────────────
export interface Review {
  id: number;
  user_id: number;
  booking_id: number;
  vehicle_id: number;
  rating: number;
  comment: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at: string;
  user_name?: string;
}

// ─────────────────────────────────────────────
// SEARCH FORM
// ─────────────────────────────────────────────
export interface SearchFormData {
  from: string;
  to: string;
  travel_date: string;
  return_date: string;
  passengers: number;
  trip_type: TripType;
}

// ─────────────────────────────────────────────
// API RESPONSE WRAPPER
// ─────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

// ─────────────────────────────────────────────
// AUTH
// ─────────────────────────────────────────────
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
  token: string;
}
