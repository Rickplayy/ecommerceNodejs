import React, { useState, useEffect } from 'react';
import productService from '../services/productService';
import ProductCard from '../components/ProductCard';
import { Container, Row, Col } from 'react-bootstrap';

const Accessories = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    productService.getProductsByCategory('accessories').then((response) => {
      setProducts(response.data);
    });
  }, []);

  return (
    <Container className="py-4">
      <h1 className="mb-4 fw-bold">Accessories</h1>
      <Row className="g-4">
        {products.map((product) => (
          <Col key={product.id || product._id} xs={12} sm={6} md={4} lg={3} className="d-flex align-items-stretch">
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Accessories;
