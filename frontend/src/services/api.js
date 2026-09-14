import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://bus-tracker-backend.vercel.app',
  headers: { 'Content-Type': 'application/json' },
});

// Add token to all requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============ USER FUNCTIONS ============
export const getUserBookings = async (userEmail = null) => {
  try {
    const { data } = await API.get('/bookings/my-bookings');
    return data.bookings || [];
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
};

export const getStats = async () => {
  try {
    const { data } = await API.get('/bookings/my-bookings');
    const bookings = data.bookings || [];
    const totalSpent = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    return {
      totalTrips: bookings.length,
      totalSpent: totalSpent,
      upcomingTrips: bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length,
      rewardPoints: Math.floor(totalSpent / 100) * 10
    };
  } catch (error) {
    return { totalTrips: 0, totalSpent: 0, upcomingTrips: 0, rewardPoints: 0 };
  }
};

export const updateBookingStatus = async (bookingId, status) => {
  try {
    const { data } = await API.put(`/admin/bookings/${bookingId}/status`, { status });
    return data;
  } catch (error) {
    throw error;
  }
};

export const cancelBooking = async (bookingId) => {
  try {
    const { data } = await API.put(`/bookings/${bookingId}/cancel`);
    return data;
  } catch (error) {
    throw error;
  }
};

// ============ ADMIN FUNCTIONS ============
export const getAdminStats = async () => {
  const { data } = await API.get('/admin/stats');
  return data.stats;
};

export const getAllBookings = async () => {
  const { data } = await API.get('/admin/bookings');
  return data.bookings || [];
};

export const getAllUsers = async () => {
  const { data } = await API.get('/admin/users');
  return data.users || [];
};

export const deleteBooking = async (bookingId) => {
  const { data } = await API.delete(`/admin/bookings/${bookingId}`);
  return data;
};

export const getAdminMessages = async () => {
  const { data } = await API.get('/admin/messages');
  return data.messages || [];
};

// ============ TOUR FUNCTIONS ============
export const getTours = async () => {
  const { data } = await API.get('/tours');
  return data.tours || [];
};

export default API;