import axios from 'axios';

const api = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL || '/api', 
  timeout: 10000 
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('sv_user') || 'null');
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sv_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;

// Product API
export const productAPI = {
  getAll:       (params) => api.get('/products', { params }), // params can include priceDrop: true
  getById:      (id)     => api.get(`/products/${id}`),
  getFeatured:  ()       => api.get('/products/featured'),
  getFlashSale: ()       => api.get('/products/flash-sale'),
  addReview:    (id, d)  => api.post(`/products/${id}/reviews`, d),
  search:       (q)      => api.get('/products', { params: { search: q, limit: 6 } }),
};

// Category API
export const categoryAPI = {
  getAll: () => api.get('/categories'),
};

// Order API
export const orderAPI = {
  create:   (d)  => api.post('/orders', d),
  getMyOrders: () => api.get('/orders/myorders'),
  getById:  (id) => api.get(`/orders/${id}`),
};

// User API
export const userAPI = {
  getProfile:      ()        => api.get('/users/profile'),
  updateProfile:   (d)       => api.put('/users/profile', d),
  toggleWishlist:  (pid)     => api.post(`/users/wishlist/${pid}`),
  updateCart:      (d)       => api.post('/users/cart', d),
};
