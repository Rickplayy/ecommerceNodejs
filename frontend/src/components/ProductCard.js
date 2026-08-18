import React, { useState } from 'react';
import { Card, Button, Alert } from 'react-bootstrap';
import cartService from '../services/cartService';

const CATEGORY_NAMES = {
  men: 'Hombre',
  women: 'Mujer',
  accessories: 'Accesorios'
};

const ProductCard = ({ product }) => {
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(true);

  const handleAddToCart = () => {
    cartService.addToCart(product.id, 1)
      .then(() => {
        setIsSuccess(true);
        setMessage('¡Agregado al carrito!');
        setTimeout(() => setMessage(''), 2000);
      })
      .catch(() => {
        setIsSuccess(false);
        setMessage('Por favor inicia sesión primero.');
        setTimeout(() => setMessage(''), 2500);
      });
  };

  const imageUrl = product.image 
    ? (product.image.startsWith('http') ? product.image : `${cartService.BASE_URL}${product.image}`)
    : 'https://via.placeholder.com/300x220?text=Sin+Imagen';

  return (
    <Card className="h-100 shadow-sm border-0 d-flex flex-column rounded-3 overflow-hidden w-100 bg-white">
      <div 
        style={{ 
          height: '220px', 
          width: '100%', 
          backgroundColor: '#ffffff', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '12px',
          overflow: 'hidden'
        }}
      >
        <Card.Img 
          variant="top" 
          src={imageUrl} 
          alt={product.name}
          style={{ 
            maxHeight: '100%', 
            maxWidth: '100%', 
            width: 'auto',
            height: 'auto',
            objectFit: 'contain'
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300x220?text=Sin+Imagen';
          }}
        />
      </div>
      <Card.Body className="d-flex flex-column p-3 flex-grow-1">
        <div className="d-flex justify-content-between align-items-start mb-1">
          <Card.Title className="fw-bold fs-6 mb-0 text-truncate w-75" title={product.name}>
            {product.name}
          </Card.Title>
          {product.category && (
            <span className="badge bg-light text-secondary text-uppercase border" style={{ fontSize: '0.7rem' }}>
              {CATEGORY_NAMES[product.category] || product.category}
            </span>
          )}
        </div>

        <Card.Text 
          className="text-muted small mb-3 flex-grow-1" 
          style={{ 
            minHeight: '38px',
            display: '-webkit-box', 
            WebkitLineClamp: 2, 
            WebkitBoxOrient: 'vertical', 
            overflow: 'hidden' 
          }}
          title={product.description}
        >
          {product.description}
        </Card.Text>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="fs-5 fw-bold text-dark">
            ${Number(product.price).toFixed(2)}
          </span>
        </div>

        {message && (
          <Alert variant={isSuccess ? 'success' : 'warning'} className="py-1 px-2 mb-2 text-center small">
            {message}
          </Alert>
        )}

        {/* Distinct Add to Cart button */}
        <Button 
          variant="primary" 
          onClick={handleAddToCart}
          className="mt-auto w-100 py-2 fw-semibold rounded-pill shadow-sm"
        >
          Agregar al Carrito
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
