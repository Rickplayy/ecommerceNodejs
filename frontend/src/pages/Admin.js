
import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col, ListGroup, Image } from 'react-bootstrap';
import adminService from '../services/adminService';
import productService from '../services/productService';

const Admin = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('men');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await productService.getAllProducts();
      setProducts(response.data);
    } catch (err) {
      console.error('Failed to fetch products', err);
      setError('Failed to load products.');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('image', image);

    try {
      await adminService.addProduct(formData);
      setSuccess('Product added successfully!');
      // Clear form
      setName('');
      setDescription('');
      setPrice('');
      setCategory('men');
      setImage(null);
      e.target.reset();
      fetchProducts(); // Refresh product list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product. Please try again.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await adminService.deleteProduct(productId);
      setSuccess('Product deleted successfully!');
      fetchProducts(); // Refresh product list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product. Please try again.');
    }
  };

  return (
    <Container className="mt-5">
      <Card style={{ maxWidth: '600px', margin: 'auto' }}>
        <Card.Body>
          <h2 className="text-center mb-4">Add New Product</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="accessories">Accessories</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Product Image</Form.Label>
              <Form.Control type="file" onChange={handleImageChange} required />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Add Product
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <h2 className="mt-5 mb-4 text-center">Manage Products</h2>
      {products.length === 0 ? (
        <p className="text-center">No products to display.</p>
      ) : (
        <ListGroup className="mb-5">
          {products.map((product) => (
            <ListGroup.Item key={product.id}>
              <Row className="align-items-center">
                <Col md={2}>
                  <Image src={`http://localhost:3001/${product.image}`} alt={product.name} fluid rounded />
                </Col>
                <Col md={6}>
                  <h5>{product.name}</h5>
                  <p>${product.price}</p>
                </Col>
                <Col md={4} className="text-end">
                  <Button variant="danger" onClick={() => handleDeleteProduct(product.id)}>
                    Delete
                  </Button>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Container>
  );
};

export default Admin;
