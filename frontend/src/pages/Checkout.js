
import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import cartService from '../services/cartService';

const Checkout = () => {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [cardInfo, setCardInfo] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  });
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [cartLoading, setCartLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      setCartLoading(true);
      try {
        const response = await cartService.getCart();
        const items = response.data.CartItems.map(cartItem => ({
          name: cartItem.Product.name,
          quantity: cartItem.quantity,
          price: cartItem.Product.price
        }));
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setCart({ items, total });
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
      setCartLoading(false);
    };
    fetchCart();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCardInfo({ ...cardInfo, [name]: value });
  };

  const handlePayment = (e) => {
    e.preventDefault();
    console.log('Processing payment...');
    setPaymentSuccess(true);
  };

  const downloadTicket = async () => {
    try {
      const response = await axios.post('http://localhost:3001/api/checkout/generate-pdf', {
        items: cart.items,
        total: cart.total,
        last4: cardInfo.number.slice(-4)
      }, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = 'ROCKPA_Ticket.pdf';
      link.click();

      setTimeout(() => {
        navigate('/');
      }, 1000);

    } catch (error) {
      console.error('Error downloading ticket:', error);
    }
  };

  return (
    <Container className="mt-5">
      <Card style={{ maxWidth: '500px', margin: 'auto' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Checkout</h2>
          {cartLoading ? (
            <p className="text-center">Loading your cart...</p>
          ) : paymentSuccess ? (
            <div className="text-center">
              <Alert variant="success">Payment successful! Thank you for your order.</Alert>
              <Button variant="primary" onClick={downloadTicket}>
                Download Ticket
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center mb-4">
                <h3>Total to Pay: ${cart.total.toFixed(2)}</h3>
              </div>
              <Form onSubmit={handlePayment}>
                <Form.Group className="mb-3">
                  <Form.Label>Card Number</Form.Label>
                  <Form.Control type="text" name="number" placeholder="1234 5678 1234 5678" value={cardInfo.number} onChange={handleInputChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Card Name</Form.Label>
                  <Form.Control type="text" name="name" placeholder="John Doe" value={cardInfo.name} onChange={handleInputChange} required />
                </Form.Group>
                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>Expiry Date</Form.Label>
                      <Form.Control type="text" name="expiry" placeholder="MM/YY" value={cardInfo.expiry} onChange={handleInputChange} required />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label>CVC</Form.Label>
                      <Form.Control type="text" name="cvc" placeholder="123" value={cardInfo.cvc} onChange={handleInputChange} required />
                    </Form.Group>
                  </Col>
                </Row>
                <Button variant="primary" type="submit" className="w-100">
                  Pay Now
                </Button>
              </Form>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Checkout;
