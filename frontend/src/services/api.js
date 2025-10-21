import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Delivery Guides API
export const deliveryGuidesAPI = {
  getAll: () => api.get('/delivery-guides'),
  getById: (id) => api.get(`/delivery-guides/${id}`),
  create: (data) => api.post('/delivery-guides', data),
  update: (id, data) => api.put(`/delivery-guides/${id}`, data),
  delete: (id) => api.delete(`/delivery-guides/${id}`),
  uploadReceipt: (id, file) => {
    const formData = new FormData();
    formData.append('receipt', file);
    return api.post(`/delivery-guides/${id}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Orders API
export const ordersAPI = {
  getAll: () => api.get('/orders'),
};

export default api;
