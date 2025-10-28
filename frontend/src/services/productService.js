
import axios from 'axios';

const API_URL = 'http://localhost:3001/api/products/';

const getProductsByCategory = (category) => {
  return axios.get(API_URL + 'category/' + category);
};

const getAllProducts = () => {
  return axios.get(API_URL);
};

export default {
  getProductsByCategory,
  getAllProducts,
};
