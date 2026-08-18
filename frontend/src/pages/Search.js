import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import productService from '../services/productService';
import ProductCard from '../components/ProductCard';
import { Container, Row, Col, Spinner } from 'react-bootstrap';

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
    <Container className="py-4">
      <h1 className="mb-4 fw-bold">Search Results for "{query}"</h1>
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Searching products...</p>
        </div>
      ) : (
        <Row className="g-4">
          {products.length > 0 ? (
            products.map((product) => (
              <Col key={product.id || product._id} xs={12} sm={6} md={4} lg={3} className="d-flex align-items-stretch">
                <ProductCard product={product} />
              </Col>
            ))
          ) : (
            <Col xs={12}>
              <p className="text-muted text-center py-5">No products found matching your search.</p>
            </Col>
          )}
        </Row>
      )}
    </Container>
  );
};

export default Search;
