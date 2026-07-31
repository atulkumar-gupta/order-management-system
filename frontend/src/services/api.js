import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      const message = error.response.data?.error || 'Server error occurred';
      console.error('API Error:', message);
      return Promise.reject(new Error(message));
    } else if (error.request) {
      console.error('No response from server:', error.request);
      return Promise.reject(new Error('Server is not responding. Please try again later.'));
    } else {
      console.error('Error:', error.message);
      return Promise.reject(error);
    }
  }
);

export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

// export const getOrders = async (params = {}) => {
//   const { status = 'ALL', page = 1, limit = 20, search = '' } = params;
//   const queryParams = new URLSearchParams({
//     status,
//     page,
//     limit,
//     ...(search && { search })
//   });
  
//   const response = await api.get(`/orders?${queryParams}`);
//   return response.data;
// };
export const getOrders = async (params = {}) => {
  const { status = 'ALL', page = 1, limit = 20, search = '' } = params;

  const queryParams = new URLSearchParams({
    status,
    page,
    limit,
    ...(search && { search })
  });

  console.log("Request:", `/orders?${queryParams}`);

  const response = await api.get(`/orders?${queryParams}`);

  console.log("Response:", response.data);

  return response.data;
};

export const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await api.put(`/orders/${id}/status`, { status });
  return response.data;
};

export const deleteOrder = async (id) => {
  const response = await api.delete(`/orders/${id}`);
  return response.data;
};

export const triggerScheduler = async () => {
  const response = await api.post('/scheduler/run', {}, {
    headers: {
      'x-scheduler-secret': import.meta.env.VITE_SCHEDULER_SECRET || 'your-super-secret-scheduler-key-2026'
    }
  });
  return response.data;
};

export const getSchedulerLogs = async (params = {}) => {
  const { page = 1, limit = 20 } = params;
  const response = await api.get(`/scheduler/logs?page=${page}&limit=${limit}`, {
    headers: {
      'x-scheduler-secret': import.meta.env.VITE_SCHEDULER_SECRET || 'your-super-secret-scheduler-key-2026'
    }
  });
  return response.data;
};

export const getSchedulerStats = async () => {
  const response = await api.get('/scheduler/stats', {
    headers: {
      'x-scheduler-secret': import.meta.env.VITE_SCHEDULER_SECRET || 'your-super-secret-scheduler-key-2026'
    }
  });
  return response.data;
};

export default api;