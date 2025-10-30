
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import productService from '../services/productService';
import ProductCard from '../components/ProductCard';
import { Container, Row, Col } from 'react-bootstrap';

const Search = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.searchProducts(query);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchProducts();
    }
  }, [query]);

  return (
    <Container>
      <h1>Search Results for "{query}"</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Row>
          {products.length > 0 ? (
            products.map((product) => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <ProductCard product={product} />
              </Col>
            ))
          ) : (
            <p>No products found matching your search.</p>
          )}
        </Row>
      )}
    </Container>
  );
};

export default Search;
