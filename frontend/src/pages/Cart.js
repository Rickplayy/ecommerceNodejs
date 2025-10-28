
import React, { useState, useEffect } from 'react';
import cartService from '../services/cartService';
import { Container, ListGroup, Button, Row, Col, Image } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Cart = () => {
  const [cart, setCart] = useState({ CartItems: [] });

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = () => {
    cartService.getCart().then((response) => {
      setCart(response.data);
    }).catch(error => {
      console.error("Error fetching cart:", error);
      setCart({ CartItems: [] });
    });
  };

  const handleRemoveItem = async (productId) => {
    try {
      await cartService.deleteItem(productId);
      fetchCart(); // Refresh cart after deletion
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const getTotalPrice = () => {
    return cart.CartItems.reduce((total, item) => total + item.Product.price * item.quantity, 0);
  };

  return (
    <Container className="mt-5">
      <h2>Shopping Cart</h2>
      {cart.CartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ListGroup>
            {cart.CartItems.map((item) => (
              <ListGroup.Item key={item.Product.id}>
                <Row className="align-items-center">
                  <Col md={2}>
                    <Image src={cartService.BASE_URL + item.Product.image} alt={item.Product.name} fluid rounded />
                  </Col>
                  <Col md={4}>{item.Product.name}</Col>
                  <Col md={2}>{item.Product && item.Product.price ? `$${item.Product.price}` : 'N/A'}</Col>
                  <Col md={2}>Quantity: {item.quantity}</Col>
                  <Col md={2}>
                    <Button variant="danger" onClick={() => handleRemoveItem(item.Product.id)}>Remove</Button>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
          <div className="mt-3">
            <h4>Total: ${getTotalPrice().toFixed(2)}</h4>
            <LinkContainer to="/checkout">
              <Button variant="primary">Checkout</Button>
            </LinkContainer>
          </div>
        </>
      )}
    </Container>
  );
};

export default Cart;
