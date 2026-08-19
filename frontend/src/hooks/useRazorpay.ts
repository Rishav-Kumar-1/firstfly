// useRazorpay.ts
// Custom hook that loads the Razorpay script and exposes an openPayment function
//
// HOW RAZORPAY WORKS IN THE BROWSER:
// 1. We load the Razorpay JS script (like a library)
// 2. We create a "handler" object with your order details
// 3. handler.open() shows the Razorpay payment popup
// 4. User pays → Razorpay calls our onSuccess callback with payment IDs
// 5. We send those IDs to our backend for verification

import { useState, useCallback } from 'react';
import { paymentAPI } from '../services/api';

// Declare the global Razorpay class that the script injects into window
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key:          string;
  amount:       number;
  currency:     string;
  name:         string;
  description:  string;
  order_id:     string;
  prefill: {
    name:  string;
    email: string;
  };
  theme: { color: string };
  handler: (response: RazorpayResponse) => void;
  modal: { ondismiss: () => void };
}

interface RazorpayInstance {
  open: () => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id:   string;
  razorpay_signature:  string;
}

interface PaymentResult {
  success: boolean;
  payment_id?: string;
  booking?: object;
  error?: string;
}

// ── Load Razorpay script ──────────────────────────────────
// Razorpay script is loaded on-demand (only when user clicks Pay)
// so it doesn't slow down the initial page load
function loadRazorpayScript(): Promise<boolean> {
  return new Promise(resolve => {
    // Don't load twice
    if (window.Razorpay) { resolve(true); return; }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ── Main hook ─────────────────────────────────────────────
export function useRazorpay() {
  const [processing, setProcessing] = useState(false);

  const openPayment = useCallback(async ({
    bookingId,
    userName,
    userEmail,
    onSuccess,
    onFailure,
  }: {
    bookingId:  number;
    userName:   string;
    userEmail:  string;
    onSuccess:  (result: PaymentResult) => void;
    onFailure:  (error: string) => void;
  }) => {
    setProcessing(true);

    try {
      // 1. Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        onFailure('Failed to load payment gateway. Please check your internet connection.');
        return;
      }

      // 2. Create a Razorpay order on our backend
      const orderRes = await paymentAPI.createOrder({ booking_id: bookingId });
      const { order_id, amount, currency, key_id, booking_reference, amount_display } = orderRes.data.data;

      // 3. Configure the Razorpay popup
      const options: RazorpayOptions = {
        key:         key_id,
        amount:      amount,      // in paise
        currency:    currency,
        name:        'TravelGo',
        description: `Booking ${booking_reference} — ₹${amount_display}`,
        order_id:    order_id,
        prefill: {
          name:  userName,
          email: userEmail,
        },
        theme: { color: '#2563eb' },

        // 4. This runs after successful payment
        handler: async (response: RazorpayResponse) => {
          try {
            // 5. Verify on backend — CRITICAL security step
            const verifyRes = await paymentAPI.verifyPayment({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              booking_id:          bookingId,
            });

            onSuccess({
              success:    true,
              payment_id: response.razorpay_payment_id,
              booking:    verifyRes.data.data?.booking,
            });
          } catch (err: unknown) {
            const e = err as { response?: { data?: { message?: string } } };
            onFailure(e.response?.data?.message || 'Payment verification failed.');
          } finally {
            setProcessing(false);
          }
        },

        modal: {
          ondismiss: () => {
            setProcessing(false);
            onFailure('Payment cancelled by user.');
          },
        },
      };

      // 6. Open the popup
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setProcessing(false);
      onFailure(e.response?.data?.message || 'Failed to initiate payment.');
    }
  }, []);

  return { openPayment, processing };
}
