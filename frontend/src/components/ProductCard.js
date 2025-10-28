
import React, { useState } from 'react';
import { Card, Button, Alert } from 'react-bootstrap';
import cartService from '../services/cartService';

const ProductCard = ({ product }) => {
  const [message, setMessage] = useState('');

  const handleAddToCart = () => {
    cartService.addToCart(product.id, 1)
      .then(() => {
        setMessage('Item added to cart!');
        setTimeout(() => setMessage(''), 2000);
      })
      .catch(() => {
        setMessage('Failed to add item. Please log in.');
        setTimeout(() => setMessage(''), 2000);
      });
  };

  return (
    <Card style={{ width: '18rem', margin: '1rem' }}>
      <Card.Img variant="top" src={`http://localhost:3001/${product.image}`} />
      <Card.Body>
        <Card.Title>{product.name}</Card.Title>
        <Card.Text>{product.description}</Card.Text>
        <Card.Text>${product.price}</Card.Text>
        {message && <Alert variant="success">{message}</Alert>}
        <Button variant="primary" onClick={handleAddToCart}>Add to Cart</Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
