
import axios from 'axios';

const API_URL = 'http://Rockpa-env.eba-nuzetjmv.us-east-2.elasticbeanstalk.com/api/cart/';
const BASE_URL = 'http://Rockpa-env.eba-nuzetjmv.us-east-2.elasticbeanstalk.com/';

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
