
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/products/';

const getProductsByCategory = (category) => {
  return axios.get(API_URL + 'category/' + category);
};

const getAllProducts = () => {
  return axios.get(API_URL);
};

const searchProducts = (keyword) => {
  return axios.get(`${API_URL}search?q=${keyword}`);
};

export default {
  getProductsByCategory,
  getAllProducts,
  searchProducts,
};
