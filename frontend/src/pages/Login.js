import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const user = await authService.login({ email, password });
      onLogin(user);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/accessories');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión. Por favor verifica tus credenciales.');
    }
  };

  return (
    <Container className="mt-5">
      <Card style={{ maxWidth: '450px', margin: 'auto' }} className="shadow-sm border-0">
        <Card.Body className="p-4">
          <h2 className="text-center mb-4 fw-bold">Iniciar Sesión</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className="fw-semibold">Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="py-2"
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="formBasicPassword">
              <Form.Label className="fw-semibold">Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="py-2"
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 py-2 fw-semibold">
              Iniciar Sesión
            </Button>

            <div className="text-center mt-3">
              <small className="text-muted">
                ¿No tienes cuenta? <Link to="/register" className="fw-semibold">Regístrate aquí</Link>
              </small>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;