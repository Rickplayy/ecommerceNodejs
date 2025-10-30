
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
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand style={{cursor: "default"}}>
          <img
            src="/logotipo.png"
            width="60"
            height="60"
            className="d-inline-block align-middle"
            alt="ROCKPA logo"
          />{' '}
          <span className="align-middle">ROCKPA</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/men">
              <Nav.Link>Men</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/women">
              <Nav.Link>Women</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/accessories">
              <Nav.Link>Accessories</Nav.Link>
            </LinkContainer>
          </Nav>
          <Form onSubmit={submitHandler} className="d-flex">
            <FormControl
              type="search"
              placeholder="Search Products..."
              className="me-2"
              aria-label="Search"
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Button type="submit" variant="outline-success">Search</Button>
          </Form>
          <Nav className="ms-3">
            {currentUser ? (
              <>
                {currentUser.role === 'admin' && (
                  <LinkContainer to="/admin">
                    <Nav.Link>Admin</Nav.Link>
                  </LinkContainer>
                )}
                {currentUser.role !== 'admin' && (
                  <LinkContainer to="/cart">
                    <Nav.Link>Cart</Nav.Link>
                  </LinkContainer>
                )}
                <NavDropdown title={currentUser.name} id="basic-nav-dropdown">
                  <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <LinkContainer to="/login">
                  <Nav.Link>Login</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/register">
                  <Nav.Link>Register</Nav.Link>
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

