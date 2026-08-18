// pricingService.js
// All fare calculations happen here — never trust frontend price values

/**
 * Calculate the complete fare breakdown for a booking
 *
 * @param {object} params
 * @param {number} params.distance_km       - Trip distance in km
 * @param {number} params.price_per_km      - Vehicle's price per km (from DB)
 * @param {number} params.driver_charge     - Vehicle's daily driver charge (from DB)
 * @param {string} params.trip_type         - ONE_WAY | ROUND_TRIP | LOCAL | MULTI_DAY
 * @param {string} params.travel_date       - YYYY-MM-DD
 * @param {string} params.return_date       - YYYY-MM-DD (optional)
 * @returns {object} Complete price breakdown
 */
const calculateFare = ({
  distance_km,
  price_per_km,
  driver_charge,
  trip_type,
  travel_date,
  return_date,
}) => {
  const distKm = parseFloat(distance_km) || 0;
  const priceKm = parseFloat(price_per_km) || 0;
  const driverDaily = parseFloat(driver_charge) || 0;

  // ── Base Fare ─────────────────────────────
  // For round trips, multiply by 2 (going + return distance)
  const effectiveDistance = trip_type === 'ROUND_TRIP' ? distKm * 2 : distKm;
  const base_fare = effectiveDistance * priceKm;

  // ── Number of Days ────────────────────────
  let days = 1;
  if (return_date && travel_date) {
    const start = new Date(travel_date);
    const end = new Date(return_date);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    days = Math.max(1, diff + 1); // at least 1 day
  }

  // ── Driver Charge ─────────────────────────
  // Charged per day
  const total_driver_charge = driverDaily * days;

  // ── Toll Charges ──────────────────────────
  // Estimated at ₹3 per km (both ways for round trip)
  const TOLL_RATE_PER_KM = 3;
  const toll_charge = Math.round(effectiveDistance * TOLL_RATE_PER_KM);

  // ── Parking Charges ───────────────────────
  // ₹300 per day for multi-day trips
  const PARKING_PER_DAY = 300;
  const parking_charge = days > 1 ? PARKING_PER_DAY * (days - 1) : 0;

  // ── Night Charges ─────────────────────────
  // ₹500 per night for overnight stays (days - 1 nights)
  const NIGHT_CHARGE_PER_NIGHT = 500;
  const nights = Math.max(0, days - 1);
  const night_charge = nights * NIGHT_CHARGE_PER_NIGHT;

  // ── Discount ─────────────────────────────
  // Simple discount logic — can be extended with promo codes later
  let discount = 0;
  if (trip_type === 'ROUND_TRIP' && base_fare > 10000) {
    discount = Math.round(base_fare * 0.05); // 5% discount on large round trips
  }

  // ── Total ─────────────────────────────────
  const total_amount = Math.round(
    base_fare + total_driver_charge + toll_charge + parking_charge + night_charge - discount
  );

  return {
    distance_km: effectiveDistance,
    days,
    nights,
    base_fare: Math.round(base_fare),
    driver_charge: Math.round(total_driver_charge),
    toll_charge,
    parking_charge,
    night_charge,
    discount,
    total_amount,
    // Breakdown detail for UI display
    breakdown: [
      { label: 'Base Fare',      value: Math.round(base_fare),        detail: `${effectiveDistance} km × ₹${priceKm}/km` },
      { label: 'Driver Charge',  value: Math.round(total_driver_charge), detail: `₹${driverDaily}/day × ${days} day(s)` },
      { label: 'Toll Charges',   value: toll_charge,                  detail: 'Estimated toll charges' },
      { label: 'Parking',        value: parking_charge,               detail: `₹${PARKING_PER_DAY}/day × ${days - 1} day(s)` },
      { label: 'Night Charges',  value: night_charge,                 detail: `₹${NIGHT_CHARGE_PER_NIGHT}/night × ${nights} night(s)` },
      { label: 'Discount',       value: -discount,                    detail: discount > 0 ? 'Round trip discount (5%)' : 'No discount applied' },
    ],
  };
};

/**
 * Generate a unique booking reference like TG-2026-000042
 * @param {number} id - The auto-incremented booking ID from DB
 */
const generateBookingReference = (id) => {
  const year = new Date().getFullYear();
  const paddedId = String(id).padStart(6, '0');
  return `TG-${year}-${paddedId}`;
};

module.exports = { calculateFare, generateBookingReference };
