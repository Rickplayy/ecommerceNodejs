import axios from 'axios';

const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:3001/api') + '/products/';
const BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:3001/api').replace('/api', '');

const getProductsByCategory = (category) => {
  return axios.get(API_URL + 'category/' + category);
};

const getAllProducts = () => {
  return axios.get(API_URL);
};

const searchProducts = (keyword) => {
  return axios.get(`${API_URL}search?q=${encodeURIComponent(keyword)}`);
};

const productService = {
  getProductsByCategory,
  getAllProducts,
  searchProducts,
  BASE_URL,
};

export default productService;
