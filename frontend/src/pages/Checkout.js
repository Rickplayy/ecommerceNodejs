import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Row, Col, Badge, ListGroup, Image } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import cartService from '../services/cartService';

const COMMON_BANKS = [
  'BBVA',
  'Santander',
  'Citibanamex',
  'Banorte',
  'HSBC',
  'Scotiabank',
  'Nu México',
  'Mercado Pago',
  'Banco Azteca',
  'Inbursa',
  'Otro'
];

const CATEGORY_NAMES = {
  men: 'Hombre',
  women: 'Mujer',
  accessories: 'Accesorios'
};

const Checkout = () => {
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [bank, setBank] = useState('BBVA');
  const [otherBank, setOtherBank] = useState('');
  
  const [cardInfo, setCardInfo] = useState({
    number: '',
    name: '',
    expiry: '',
    cvc: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const [cart, setCart] = useState({ items: [], total: 0 });
  const [cartLoading, setCartLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      setCartLoading(true);
      try {
        const response = await cartService.getCart();
        const items = (response.data.CartItems || []).map(cartItem => ({
          id: cartItem.Product.id,
          name: cartItem.Product.name,
          quantity: cartItem.quantity,
          price: Number(cartItem.Product.price),
          image: cartItem.Product.image,
          category: cartItem.Product.category
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

  // Format Card Number (adds space every 4 digits, max 16 digits)
  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || '';
    setCardInfo(prev => ({ ...prev, number: formatted }));

    if (touched.number) {
      validateField('number', formatted);
    }
  };

  // Format Expiry Date (MM/YY)
  const handleExpiryChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    let formatted = raw;
    if (raw.length >= 3) {
      formatted = `${raw.slice(0, 2)}/${raw.slice(2, 4)}`;
    }
    setCardInfo(prev => ({ ...prev, expiry: formatted }));

    if (touched.expiry) {
      validateField('expiry', formatted);
    }
  };

  // Format CVC (max 3 or 4 digits)
  const handleCvcChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCardInfo(prev => ({ ...prev, cvc: raw }));

    if (touched.cvc) {
      validateField('cvc', raw);
    }
  };

  // Name change
  const handleNameChange = (e) => {
    const val = e.target.value;
    setCardInfo(prev => ({ ...prev, name: val }));
    if (touched.name) {
      validateField('name', val);
    }
  };

  // Single field validator
  const validateField = (field, value) => {
    let err = '';
    const cleanNumber = (field === 'number' ? value : cardInfo.number).replace(/\s/g, '');

    switch (field) {
      case 'number':
        if (!cleanNumber) {
          err = 'El número de tarjeta es obligatorio.';
        } else if (cleanNumber.length !== 16) {
          err = `Debe tener exactamente 16 dígitos (llevas ${cleanNumber.length}).`;
        }
        break;

      case 'name':
        if (!value.trim()) {
          err = 'El nombre del titular es obligatorio.';
        } else if (value.trim().length < 3) {
          err = 'El nombre debe tener al menos 3 caracteres.';
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          err = 'El nombre solo debe contener letras.';
        }
        break;

      case 'expiry':
        if (!value) {
          err = 'Fecha requerida (MM/AA).';
        } else if (!/^\d{2}\/\d{2}$/.test(value)) {
          err = 'Formato inválido (MM/AA).';
        } else {
          const [month, year] = value.split('/').map(Number);
          const currentYear = Number(new Date().getFullYear().toString().slice(-2));
          const currentMonth = new Date().getMonth() + 1;

          if (month < 1 || month > 12) {
            err = 'Mes inválido (01 al 12).';
          } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
            err = 'La tarjeta está vencida.';
          }
        }
        break;

      case 'cvc':
        if (!value) {
          err = 'CVC requerido.';
        } else if (value.length < 3) {
          err = 'Mínimo 3 dígitos.';
        }
        break;

      case 'otherBank':
        if (bank === 'Otro' && !value.trim()) {
          err = 'Escribe el nombre de tu banco.';
        }
        break;

      default:
        break;
    }

    setErrors(prev => ({ ...prev, [field]: err }));
    return !err;
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, field === 'otherBank' ? otherBank : cardInfo[field]);
  };

  // Full form validator
  const validateForm = () => {
    const vNumber = validateField('number', cardInfo.number);
    const vName = validateField('name', cardInfo.name);
    const vExpiry = validateField('expiry', cardInfo.expiry);
    const vCvc = validateField('cvc', cardInfo.cvc);
    const vBank = bank === 'Otro' ? validateField('otherBank', otherBank) : true;

    setTouched({
      number: true,
      name: true,
      expiry: true,
      cvc: true,
      otherBank: true
    });

    return vNumber && vName && vExpiry && vCvc && vBank;
  };

  // Detect card brand
  const getCardBrand = () => {
    const raw = cardInfo.number.replace(/\s/g, '');
    if (raw.startsWith('4')) return { brand: 'VISA', color: '#1a1f71' };
    if (raw.startsWith('5')) return { brand: 'Mastercard', color: '#eb001b' };
    if (raw.startsWith('3')) return { brand: 'American Express', color: '#007bc1' };
    return { brand: 'Tarjeta', color: '#495057' };
  };

  const effectiveBankName = bank === 'Otro' ? (otherBank.trim() || 'Otro Banco') : bank;

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    setOrderId(Math.floor(100000 + Math.random() * 900000).toString());
    setOrderDate(new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }));

    setTimeout(async () => {
      setPaymentSuccess(true);
      setIsProcessing(false);
      try {
        await cartService.clearCart();
      } catch (err) {
        console.warn('Could not clear cart immediately:', err);
      }
    }, 1000);
  };

  const downloadTicket = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
      const token = localStorage.getItem('token');
      const cleanNumber = cardInfo.number.replace(/\s/g, '');

      const response = await axios.post(`${API_URL}/checkout/generate-pdf`, {
        items: cart.items,
        total: cart.total,
        last4: cleanNumber.slice(-4),
        bank: effectiveBankName
      }, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` }
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `Ticket_ROCKPA_${orderId || 'Compra'}.pdf`;
      link.click();

      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (error) {
      console.error('Error downloading ticket:', error);
    }
  };

  const cardBrand = getCardBrand();
  const subtotal = cart.total / 1.16;
  const tax = cart.total - subtotal;
  const last4Digits = cardInfo.number.replace(/\s/g, '').slice(-4);

  return (
    <Container className="mt-5 mb-5">
      <Card style={{ maxWidth: paymentSuccess ? '680px' : '520px', margin: 'auto' }} className="shadow-sm border-0">
        <Card.Body className="p-4">
          {cartLoading ? (
            <p className="text-center text-muted">Cargando tu carrito...</p>
          ) : paymentSuccess ? (
            /* Amazon-style Order Breakdown & Confirmation */
            <div>
              <div className="text-center mb-4">
                <div className="text-success fs-1 mb-1">✓</div>
                <h2 className="fw-bold text-dark mb-1">Compra finalizada</h2>
                <p className="text-muted">
                  ¡Gracias por tu compra! Tu pedido ha sido confirmado exitosamente.
                </p>
              </div>

              {/* Order Meta Info */}
              <div className="bg-light p-3 rounded-3 mb-4 border">
                <Row className="gy-2">
                  <Col sm={4}>
                    <small className="text-muted d-block">Número de Pedido</small>
                    <span className="fw-bold text-dark">#ROCKPA-{orderId}</span>
                  </Col>
                  <Col sm={4}>
                    <small className="text-muted d-block">Fecha de Compra</small>
                    <span className="fw-semibold text-dark">{orderDate}</span>
                  </Col>
                  <Col sm={4}>
                    <small className="text-muted d-block">Método de Pago</small>
                    <span className="fw-semibold text-dark">{effectiveBankName} (•••• {last4Digits})</span>
                  </Col>
                </Row>
              </div>

              {/* Itemized Products List (Amazon Style) */}
              <h5 className="fw-bold mb-3">
                Desglose de Artículos ({cart.items.reduce((acc, i) => acc + i.quantity, 0)})
              </h5>
              <ListGroup className="mb-4 border-0">
                {cart.items.map((item, index) => {
                  const imageUrl = item.image
                    ? (item.image.startsWith('http') ? item.image : `${cartService.BASE_URL}${item.image}`)
                    : 'https://via.placeholder.com/65?text=Sin+Imagen';

                  return (
                    <ListGroup.Item key={index} className="p-3 border rounded-3 mb-2">
                      <Row className="align-items-center">
                        <Col xs={3} sm={2}>
                          <Image 
                            src={imageUrl} 
                            alt={item.name} 
                            fluid 
                            rounded 
                            style={{ 
                              height: '65px', 
                              width: '65px', 
                              objectFit: 'contain', 
                              backgroundColor: '#ffffff', 
                              padding: '2px', 
                              border: '1px solid #eee' 
                            }}
                          />
                        </Col>
                        <Col xs={9} sm={6}>
                          <h6 className="mb-1 fw-bold text-dark">{item.name}</h6>
                          {item.category && (
                            <Badge bg="secondary" className="me-2 text-uppercase" style={{ fontSize: '0.65rem' }}>
                              {CATEGORY_NAMES[item.category] || item.category}
                            </Badge>
                          )}
                          <small className="text-muted d-block mt-1">
                            ${item.price.toFixed(2)} c/u
                          </small>
                        </Col>
                        <Col xs={6} sm={2} className="mt-2 mt-sm-0">
                          <span className="badge bg-light text-dark border px-2 py-1">
                            Cant: {item.quantity}
                          </span>
                        </Col>
                        <Col xs={6} sm={2} className="mt-2 mt-sm-0 text-end">
                          <span className="fw-bold fs-6 text-dark">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>

              {/* Price Breakdown */}
              <div className="bg-light p-3 rounded-3 mb-4 border">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">IVA (16%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Envío</span>
                  <span className="text-success fw-semibold">Gratis</span>
                </div>
                <hr className="my-2" />
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fs-5 fw-bold text-dark">Total Pagado:</span>
                  <span className="fs-4 fw-bold text-success">${cart.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
                <Button 
                  variant="primary" 
                  className="fw-semibold px-4 py-2"
                  onClick={downloadTicket}
                >
                  Descargar Ticket PDF
                </Button>
                <Link to="/" className="btn btn-outline-secondary fw-semibold px-4 py-2">
                  Volver a la Tienda
                </Link>
              </div>
            </div>
          ) : (
            /* Checkout Payment Form */
            <>
              <h2 className="text-center mb-4 fw-bold">Finalizar Compra</h2>

              {/* Virtual Card Preview */}
              <div 
                className="p-4 rounded-4 text-white mb-4 shadow-sm"
                style={{
                  background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
                  minHeight: '180px',
                  position: 'relative'
                }}
              >
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="fw-bold fs-6 text-uppercase tracking-wider">
                    🏦 {effectiveBankName}
                  </span>
                  <Badge bg="light" text="dark" className="px-2 py-1">
                    {cardBrand.brand}
                  </Badge>
                </div>

                <div className="my-3 font-monospace fs-4 tracking-widest text-center">
                  {cardInfo.number || '•••• •••• •••• ••••'}
                </div>

                <div className="d-flex justify-content-between align-items-end mt-3">
                  <div>
                    <small className="text-white-50 d-block" style={{ fontSize: '0.7rem' }}>TITULAR</small>
                    <span className="fw-semibold text-uppercase text-truncate d-inline-block" style={{ maxWidth: '200px' }}>
                      {cardInfo.name || 'NOMBRE DEL CLIENTE'}
                    </span>
                  </div>
                  <div>
                    <small className="text-white-50 d-block" style={{ fontSize: '0.7rem' }}>EXPIRA</small>
                    <span className="fw-semibold font-monospace">
                      {cardInfo.expiry || 'MM/AA'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Total Summary */}
              <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded-3 mb-4 border">
                <span className="text-muted fw-semibold">Total a Pagar:</span>
                <span className="fs-4 fw-bold text-success">${cart.total.toFixed(2)}</span>
              </div>

              <Form onSubmit={handlePayment} noValidate>
                {/* Bank Selector */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Institución Bancaria</Form.Label>
                  <Form.Select 
                    value={bank} 
                    onChange={(e) => {
                      setBank(e.target.value);
                      if (e.target.value !== 'Otro') {
                        setOtherBank('');
                        setErrors(prev => ({ ...prev, otherBank: '' }));
                      }
                    }}
                    className="py-2"
                  >
                    {COMMON_BANKS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                {/* Conditional Other Bank Input */}
                {bank === 'Otro' && (
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Especifica el nombre de tu Banco</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Ej. BanBajío, Afirme, Revolut..." 
                      value={otherBank}
                      onChange={(e) => {
                        setOtherBank(e.target.value);
                        if (touched.otherBank) validateField('otherBank', e.target.value);
                      }}
                      onBlur={() => handleBlur('otherBank')}
                      isInvalid={!!errors.otherBank}
                      className="py-2"
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.otherBank}
                    </Form.Control.Feedback>
                  </Form.Group>
                )}

                {/* Card Number */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">
                    Número de Tarjeta <small className="text-muted">(16 dígitos)</small>
                  </Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="1234 5678 9012 3456" 
                    value={cardInfo.number} 
                    onChange={handleCardNumberChange} 
                    onBlur={() => handleBlur('number')}
                    isInvalid={!!errors.number}
                    className="py-2 font-monospace"
                    maxLength={19}
                    required 
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.number}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Cardholder Name */}
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Nombre del Titular</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Como aparece en la tarjeta" 
                    value={cardInfo.name} 
                    onChange={handleNameChange} 
                    onBlur={() => handleBlur('name')}
                    isInvalid={!!errors.name}
                    className="py-2 text-uppercase"
                    required 
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>

                <Row>
                  {/* Expiry Date */}
                  <Col xs={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">Vencimiento</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="MM/AA" 
                        value={cardInfo.expiry} 
                        onChange={handleExpiryChange} 
                        onBlur={() => handleBlur('expiry')}
                        isInvalid={!!errors.expiry}
                        className="py-2 text-center font-monospace"
                        maxLength={5}
                        required 
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.expiry}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  {/* CVC */}
                  <Col xs={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">CVC / CVV</Form.Label>
                      <Form.Control 
                        type="password" 
                        placeholder="123" 
                        value={cardInfo.cvc} 
                        onChange={handleCvcChange} 
                        onBlur={() => handleBlur('cvc')}
                        isInvalid={!!errors.cvc}
                        className="py-2 text-center font-monospace"
                        maxLength={4}
                        required 
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.cvc}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-100 py-3 fw-semibold shadow-sm"
                  disabled={isProcessing || cart.total === 0}
                >
                  {isProcessing ? 'Validando con el Banco...' : `Pagar $${cart.total.toFixed(2)}`}
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
