import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const Header = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search?q=${keyword}`);
    } else {
      navigate('/');
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="py-2 shadow-sm">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand style={{ cursor: "pointer" }} className="d-flex align-items-center">
            <img
              src="/logotipo.png"
              width="50"
              height="50"
              className="d-inline-block me-2"
              alt="ROCKPA logo"
            />
            <span className="fw-bold tracking-wide">ROCKPA</span>
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/men">
              <Nav.Link>Hombre</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/women">
              <Nav.Link>Mujer</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/accessories">
              <Nav.Link>Accesorios</Nav.Link>
            </LinkContainer>
          </Nav>
          <Form onSubmit={submitHandler} className="d-flex my-2 my-lg-0">
            <FormControl
              type="search"
              placeholder="Buscar productos..."
              className="me-2"
              aria-label="Buscar"
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Button type="submit" variant="primary" className="fw-semibold px-3">
              Buscar
            </Button>
          </Form>
          <Nav className="ms-lg-3">
            {currentUser ? (
              <>
                {currentUser.role === 'admin' && (
                  <LinkContainer to="/admin">
                    <Nav.Link className="text-warning fw-semibold">Administración</Nav.Link>
                  </LinkContainer>
                )}
                {currentUser.role !== 'admin' && (
                  <LinkContainer to="/cart">
                    <Nav.Link>Carrito 🛒</Nav.Link>
                  </LinkContainer>
                )}
                <NavDropdown title={currentUser.name} id="basic-nav-dropdown">
                  <NavDropdown.Item onClick={handleLogout}>Cerrar Sesión</NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <LinkContainer to="/login">
                  <Nav.Link>Iniciar Sesión</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Nav.Link>Registrarse</Nav.Link>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
