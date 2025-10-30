import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Accounts
export const accountsAPI = {
  getAll: () => api.get('/accounts'),
  connectInstagram: () => api.get('/accounts/connect/instagram'),
  connectWhatsApp: (data: { phoneNumber: string; accessToken: string; accountId: string }) =>
    api.post('/accounts/connect/whatsapp', data),
  delete: (id: string) => api.delete(`/accounts/${id}`),
};

// Bot Configuration
export const botAPI = {
  getConfig: (accountId: string) => api.get(`/bot/${accountId}/config`),
  updateConfig: (accountId: string, data: any) => api.put(`/bot/${accountId}/config`, data),
  getKnowledgeBase: (accountId: string) => api.get(`/bot/${accountId}/knowledge-base`),
  addKnowledge: (accountId: string, data: { title: string; content: string; type?: string }) =>
    api.post(`/bot/${accountId}/knowledge-base`, data),
  uploadDocument: (accountId: string, file: File) => {
    const formData = new FormData();
    formData.append('document', file);
    return api.post(`/bot/${accountId}/knowledge-base/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteKnowledge: (knowledgeId: string) => api.delete(`/bot/knowledge-base/${knowledgeId}`),
};

// Conversations
export const conversationsAPI = {
  getByAccount: (accountId: string, status?: string) =>
    api.get(`/conversations/accounts/${accountId}/conversations`, { params: { status } }),
  getMessages: (conversationId: string) => api.get(`/conversations/${conversationId}/messages`),
  sendManualReply: (conversationId: string, content: string) =>
    api.post(`/conversations/${conversationId}/manual-reply`, { content }),
  takeover: (conversationId: string) => api.put(`/conversations/${conversationId}/takeover`),
  markAsConverted: (conversationId: string, data: { revenue?: number; notes?: string }) =>
    api.post(`/conversations/${conversationId}/mark-converted`, data),
};

// Analytics
export const analyticsAPI = {
  get: (accountId: string, params?: { startDate?: string; endDate?: string }) =>
    api.get(`/analytics/${accountId}`, { params }),
};

export default api;

