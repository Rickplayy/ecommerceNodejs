import axios from 'axios';

const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:3001/api') + '/cart/';
const BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:3001/api').replace('/api', '/');

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return { headers: { Authorization: `Bearer ${token}` } };
};

const getCart = () => {
  return axios.get(API_URL, getAuthHeaders());
};

const addToCart = (productId, quantity) => {
  return axios.post(API_URL + 'add', { productId, quantity }, getAuthHeaders());
};

const updateQuantity = (productId, quantity) => {
  return axios.put(API_URL + productId, { quantity }, getAuthHeaders());
};

const deleteItem = (productId) => {
  return axios.delete(API_URL + productId, getAuthHeaders());
};

const clearCart = () => {
  return axios.delete(API_URL + 'clear/all', getAuthHeaders());
};

const cartService = {
  getCart,
  addToCart,
  updateQuantity,
  deleteItem,
  clearCart,
  BASE_URL,
};

export default cartService;
