import axios from 'axios';

// URL sirf .env se — VITE_API_URL (local) ya Vercel Environment Variables (production)
const envApiUrl = import.meta.env.VITE_API_URL?.trim().replace(/\/$/, '');
export const API_BASE_URL = envApiUrl || '/api';

if (import.meta.env.DEV) {
  console.info('[VLM Academy] API:', API_BASE_URL);
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vlm_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.baseURL && err.config?.url
      ? `${err.config.baseURL}${err.config.url}`
      : err.config?.url;
    const status = err.response?.status;
    const message = err.response?.data?.message || err.message;

    console.error('[VLM API Error]', {
      url,
      status: status ?? 'no response',
      message,
      data: err.response?.data,
    });

    if (err.response?.status === 401) {
      localStorage.removeItem('vlm_token');
      localStorage.removeItem('vlm_user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;

export const authAPI = {
  checkStatus: (params) => api.get('/auth/app-status', { params }),
  sendOtp: (data) => api.post('/auth/send-otp', data),
  verifyOtp: (data) => api.post('/auth/verify-otp', data),
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  switchRole: (role) => api.post('/auth/switch-role', { role }),
  logout: () => api.post('/auth/logout'),
};

export const teacherAPI = {
  getProfile: () => api.get('/teacher/profile'),
  updateOnboarding: (data) => api.put('/teacher/onboarding', data),
  uploadFile: (formData) => api.post('/teacher/onboarding/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  submitApplication: () => api.post('/teacher/submit'),
  getApplicationStatus: () => api.get('/teacher/application-status'),
  updateAvailability: (data) => api.put('/teacher/availability', data),
  getDashboard: () => api.get('/teacher/dashboard'),
  updateProfile: (data) => api.put('/teacher/profile', data),
  getInterviewSlots: () => api.get('/teacher/interview/slots'),
  scheduleInterview: (data) => api.post('/teacher/interview/schedule', data),
  getRequests: () => api.get('/teacher/requests'),
  respondRequest: (data) => api.post('/teacher/requests/respond', data),
  getWallet: () => api.get('/teacher/wallet'),
  withdraw: (data) => api.post('/teacher/withdraw', data),
  getWithdrawals: () => api.get('/teacher/withdrawals'),
  getEarnings: (params) => api.get('/teacher/earnings', { params }),
  getReviews: () => api.get('/teacher/reviews'),
  replyReview: (id, data) => api.post(`/teacher/reviews/${id}/reply`, data),
  createLiveClass: (data) => api.post('/teacher/live-classes', data),
  getLiveClasses: () => api.get('/teacher/live-classes'),
  getAnalytics: () => api.get('/teacher/analytics'),
};

export const studentAPI = {
  getProfile: () => api.get('/student/profile'),
  updateProfile: (data) => api.put('/student/profile', data),
  getDashboard: () => api.get('/student/dashboard'),
  getPlans: (cls) => api.get('/student/plans', { params: { class: cls } }),
  activateTrial: (data) => api.post('/student/trial', data),
  submitDoubt: (data) => api.post('/student/doubt', data),
  getDailyMcq: () => api.get('/student/mcq/daily'),
  submitMcq: (data) => api.post('/student/mcq/submit', data),
  toggleFavorite: (data) => api.post('/student/favorite-teacher', data),
  getSessions: (params) => api.get('/student/sessions', { params }),
  getMessages: (id) => api.get(`/student/sessions/${id}/messages`),
  sendMessage: (data) => api.post('/student/sessions/messages', data),
  resolveSession: (data) => api.post('/student/sessions/resolve', data),
  getNotifications: () => api.get('/student/notifications'),
  markRead: (id) => api.put(`/student/notifications/${id}/read`),
  createTicket: (data) => api.post('/student/tickets', data),
  getTickets: () => api.get('/student/tickets'),
  getTicket: (id) => api.get(`/student/tickets/${id}`),
  replyTicket: (id, data) => api.post(`/student/tickets/${id}/reply`, data),
  getLiveClasses: () => api.get('/student/live-classes'),
  getVideos: (params) => api.get('/student/videos', { params }),
  getMyVideos: () => api.get('/student/videos/mine'),
  uploadVideo: (formData) => api.post('/student/videos', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getReferral: () => api.get('/student/referral'),
};

export const parentAPI = {
  getProfile: () => api.get('/parent/profile'),
  updateProfile: (data) => api.put('/parent/profile', data),
  linkChild: (data) => api.post('/parent/link-child', data),
  getDashboard: () => api.get('/parent/dashboard'),
  updateControls: (data) => api.put('/parent/controls', data),
  getSessions: (params) => api.get('/parent/sessions', { params }),
  getNotifications: () => api.get('/parent/notifications'),
  markRead: (id) => api.put(`/parent/notifications/${id}/read`),
  createTicket: (data) => api.post('/parent/tickets', data),
  getTickets: () => api.get('/parent/tickets'),
  getTicket: (id) => api.get(`/parent/tickets/${id}`),
  replyTicket: (id, data) => api.post(`/parent/tickets/${id}/reply`, data),
};

export const sessionAPI = {
  get: (id) => api.get(`/sessions/${id}`),
  getMessages: (id) => api.get(`/sessions/${id}/messages`),
  sendMessage: (data) => api.post('/sessions/messages', data),
  complete: (data) => api.post('/sessions/complete', data),
};
