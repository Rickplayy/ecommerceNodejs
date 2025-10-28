
import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handlePayment = (e) => {
    e.preventDefault();
    // In a real app, you would process the payment here.
    setSuccess('Payment successful! Thank you for your order.');
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  return (
    <Container className="mt-5">
      <Card style={{ maxWidth: '500px', margin: 'auto' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Checkout</h2>
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handlePayment}>
            <Form.Group className="mb-3">
              <Form.Label>Card Number</Form.Label>
              <Form.Control type="text" placeholder="1234 5678 1234 5678" required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Card Name</Form.Label>
              <Form.Control type="text" placeholder="John Doe" required />
            </Form.Group>
            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Expiry Date</Form.Label>
                  <Form.Control type="text" placeholder="MM/YY" required />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>CVC</Form.Label>
                  <Form.Control type="text" placeholder="123" required />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" type="submit" className="w-100">
              Pay Now
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Checkout;
