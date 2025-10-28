
import React, { useState, useEffect } from 'react';
import productService from '../services/productService';
import ProductCard from '../components/ProductCard';
import { Container, Row, Col } from 'react-bootstrap';

const Women = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    productService.getProductsByCategory('women').then((response) => {
      setProducts(response.data);
    });
  }, []);

  return (
    <Container>
      <h1 className="my-4">Women's Clothing</h1>
      <Row>
        {products.map((product) => (
          <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Women;

