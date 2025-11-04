
import axios from 'axios';

const API_URL = 'http://18.218.103.28:3001/api/cart/';
const BASE_URL = 'http://18.218.103.28:3001/';

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

const deleteItem = (productId) => {
  return axios.delete(API_URL + productId, getAuthHeaders());
};

export default {
  getCart,
  addToCart,
  deleteItem,
  BASE_URL,
};
