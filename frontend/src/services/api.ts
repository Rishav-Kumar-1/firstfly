// api.ts
// Central API service — all backend calls go through here.
// Uses axios, which is like fetch() but with more features and cleaner syntax.

import axios from 'axios';

// Create an axios "instance" with default settings
// Every request made through this instance will use these defaults
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // All requests will start with this URL
  timeout: 10000,                        // Cancel request if it takes > 10 seconds
  headers: {
    'Content-Type': 'application/json',  // Tell the backend we're sending JSON
  },
});

// ─────────────────────────────────────────────
// REQUEST INTERCEPTOR
// Runs before every request is sent
// We use it to automatically attach the JWT token to every request
// ─────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    // Get the stored user from localStorage
    const storedUser = localStorage.getItem('travelgo_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.token) {
        // Add the token to the Authorization header
        // The backend will read this to know who is making the request
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─────────────────────────────────────────────
// RESPONSE INTERCEPTOR
// Runs after every response is received
// We use it to handle global errors (like expired tokens)
// ─────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response, // If success, just return the response
  (error) => {
    if (error.response?.status === 401) {
      // 401 = Unauthorized — token expired or invalid
      // Clear the user from localStorage and redirect to login
      localStorage.removeItem('travelgo_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─────────────────────────────────────────────
// VEHICLE APIs
// ─────────────────────────────────────────────
export const vehicleAPI = {
  getAll: (params?: object) => api.get('/vehicles', { params }),
  getById: (id: number) => api.get(`/vehicles/${id}`),
  create: (data: object) => api.post('/vehicles', data),
  update: (id: number, data: object) => api.put(`/vehicles/${id}`, data),
  delete: (id: number) => api.delete(`/vehicles/${id}`),
};

// ─────────────────────────────────────────────
// AUTH APIs
// ─────────────────────────────────────────────
export const authAPI = {
  register: (data: object) => api.post('/auth/register', data),
  login: (data: object) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: object) => api.put('/auth/profile', data),
  changePassword: (data: object) => api.put('/auth/change-password', data),
};

// ─────────────────────────────────────────────
// BOOKING APIs
// ─────────────────────────────────────────────
export const bookingAPI = {
  create: (data: object) => api.post('/bookings', data),
  getById: (id: number) => api.get(`/bookings/${id}`),
  getMyBookings: () => api.get('/bookings/my'),
  cancel: (id: number) => api.put(`/bookings/${id}/cancel`),
  calculatePrice: (data: object) => api.post('/bookings/calculate-price', data),
};

// ─────────────────────────────────────────────
// PACKAGE APIs
// ─────────────────────────────────────────────
export const packageAPI = {
  getAll: () => api.get('/packages'),
  getById: (id: number) => api.get(`/packages/${id}`),
};

// ─────────────────────────────────────────────
// DESTINATION APIs
// ─────────────────────────────────────────────
export const destinationAPI = {
  getAll: () => api.get('/destinations'),
  getById: (id: number) => api.get(`/destinations/${id}`),
};

// ─────────────────────────────────────────────
// REVIEW APIs
// ─────────────────────────────────────────────
export const reviewAPI = {
  getByVehicle: (vehicleId: number) => api.get(`/reviews/vehicle/${vehicleId}`),
  create: (data: object) => api.post('/reviews', data),
};

// ─────────────────────────────────────────────
// ENQUIRY APIs
// ─────────────────────────────────────────────
export const enquiryAPI = {
  submit: (data: object) => api.post('/enquiries', data),
  getAll: () => api.get('/enquiries'),
};

// Admin APIs
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getAllBookings: (params?: object) => api.get('/admin/bookings', { params }),
  updateBookingStatus: (id: number, status: string) =>
    api.put(`/admin/bookings/${id}/status`, { status }),
  getAllCustomers: () => api.get('/admin/customers'),
  getAllEnquiries: () => api.get('/enquiries'),
};

// ─────────────────────────────────────────────
// PAYMENT APIs (Razorpay)
// ─────────────────────────────────────────────
export const paymentAPI = {
  createOrder:   (data: object) => api.post('/payments/create-order', data),
  verifyPayment: (data: object) => api.post('/payments/verify', data),
  getStatus:     (bookingId: number) => api.get(`/payments/booking/${bookingId}`),
};

export default api;
