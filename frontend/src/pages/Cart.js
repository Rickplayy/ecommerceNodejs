import React, { useState, useEffect } from 'react';
import cartService from '../services/cartService';
import { Container, ListGroup, Button, Row, Col, Image, Card } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';

const Cart = () => {
  const [cart, setCart] = useState({ CartItems: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = () => {
    setLoading(true);
    cartService.getCart().then((response) => {
      setCart(response.data);
    }).catch(error => {
      console.error("Error fetching cart:", error);
      setCart({ CartItems: [] });
    }).finally(() => {
      setLoading(false);
    });
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    try {
      await cartService.updateQuantity(productId, newQuantity);
      fetchCart();
    } catch (error) {
      console.error("Error updating item quantity:", error);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await cartService.deleteItem(productId);
      fetchCart();
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const getTotalPrice = () => {
    if (!cart.CartItems) return 0;
    return cart.CartItems.reduce((total, item) => total + (item.Product?.price || 0) * item.quantity, 0);
  };

  return (
    <Container className="py-5">
      <h2 className="mb-4 fw-bold">Carrito de Compras</h2>
      {loading ? (
        <p className="text-muted">Cargando tu carrito...</p>
      ) : !cart.CartItems || cart.CartItems.length === 0 ? (
        <Card className="p-5 text-center shadow-sm border-0">
          <h4 className="text-muted mb-3">Tu carrito está actualmente vacío</h4>
          <p className="text-muted">Explora nuestro catálogo y encuentra artículos para tu guardarropa.</p>
          <div>
            <Link to="/" className="btn btn-primary px-4 py-2 fw-semibold">
              Empezar a Comprar
            </Link>
          </div>
        </Card>
      ) : (
        <Row>
          <Col lg={8}>
            <ListGroup className="shadow-sm border-0 mb-4">
              {cart.CartItems.map((item) => {
                if (!item.Product) return null;
                const imageUrl = item.Product.image
                  ? (item.Product.image.startsWith('http') ? item.Product.image : `${cartService.BASE_URL}${item.Product.image}`)
                  : 'https://via.placeholder.com/80?text=Sin+Imagen';

                return (
                  <ListGroup.Item key={item.Product.id} className="p-3">
                    <Row className="align-items-center">
                      <Col xs={3} sm={2}>
                        <Image 
                          src={imageUrl} 
                          alt={item.Product.name} 
                          fluid 
                          rounded 
                          style={{ 
                            height: '80px', 
                            width: '80px', 
                            objectFit: 'contain', 
                            backgroundColor: '#ffffff', 
                            padding: '4px', 
                            border: '1px solid #eee' 
                          }}
                        />
                      </Col>
                      <Col xs={9} sm={4}>
                        <h5 className="mb-1 fs-6 fw-bold">{item.Product.name}</h5>
                        <p className="text-muted small mb-0">${Number(item.Product.price).toFixed(2)} c/u</p>
                      </Col>
                      <Col xs={6} sm={3} className="mt-3 mt-sm-0">
                        <div className="d-flex align-items-center">
                          <Button 
                            variant="outline-secondary" 
                            size="sm" 
                            style={{ width: '32px', height: '32px', padding: 0 }}
                            onClick={() => handleQuantityChange(item.Product.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="mx-3 fw-bold fs-6">{item.quantity}</span>
                          <Button 
                            variant="outline-secondary" 
                            size="sm" 
                            style={{ width: '32px', height: '32px', padding: 0 }}
                            onClick={() => handleQuantityChange(item.Product.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </Col>
                      <Col xs={4} sm={2} className="mt-3 mt-sm-0 text-end text-sm-start">
                        <span className="fw-bold fs-6 text-dark">
                          ${(item.Product.price * item.quantity).toFixed(2)}
                        </span>
                      </Col>
                      <Col xs={2} sm={1} className="mt-3 mt-sm-0 text-end">
                        <Button 
                          variant="outline-danger" 
                          size="sm" 
                          style={{ border: 'none' }}
                          title="Eliminar artículo"
                          onClick={() => handleRemoveItem(item.Product.id)}
                        >
                          ✕
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </Col>
          <Col lg={4}>
            <Card className="p-4 shadow-sm border-0">
              <h4 className="fw-bold mb-3">Resumen del Pedido</h4>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Envío</span>
                <span className="text-success fw-semibold">Gratis</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-4">
                <span className="fs-5 fw-bold">Total</span>
                <span className="fs-5 fw-bold text-dark">${getTotalPrice().toFixed(2)}</span>
              </div>
              <LinkContainer to="/checkout">
                <Button variant="primary" size="lg" className="w-100 py-3 fw-bold">
                  Proceder al Pago
                </Button>
              </LinkContainer>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Cart;
