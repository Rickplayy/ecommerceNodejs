
import axios from 'axios';

const API_URL = 'http://18.218.103.28:3001/api/admin/';

const getAuthHeaders = (contentType = 'application/json') => {
  const token = localStorage.getItem('token');
  return { 
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': contentType
    } 
  };
};

const addProduct = (formData) => {
  return axios.post(API_URL + 'products', formData, getAuthHeaders('multipart/form-data'));
};

const deleteProduct = (productId) => {
  return axios.delete(API_URL + 'products/' + productId, getAuthHeaders());
};

export default {
  addProduct,
  deleteProduct,
};
