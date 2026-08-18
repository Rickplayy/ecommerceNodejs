import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col, ListGroup, Image, Modal } from 'react-bootstrap';
import adminService from '../services/adminService';
import productService from '../services/productService';

const CATEGORY_NAMES = {
  men: 'Hombre',
  women: 'Mujer',
  accessories: 'Accesorios'
};

const Admin = () => {
  // Add Product Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('men');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [products, setProducts] = useState([]);

  // Edit Product Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editCategory, setEditCategory] = useState('men');
  const [editImage, setEditImage] = useState(null);
  const [editError, setEditError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchProducts = async () => {
    try {
      const response = await productService.getAllProducts();
      setProducts(response.data);
    } catch (err) {
      console.error('Failed to fetch products', err);
      setError('Error al cargar la lista de productos.');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleEditImageChange = (e) => {
    setEditImage(e.target.files[0]);
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
    if (image) {
      formData.append('image', image);
    }

    try {
      await adminService.addProduct(formData);
      setSuccess('¡Producto agregado exitosamente!');
      setName('');
      setDescription('');
      setPrice('');
      setCategory('men');
      setImage(null);
      e.target.reset();
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al agregar el producto. Por favor intenta nuevamente.');
    }
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setEditName(product.name);
    setEditDescription(product.description);
    setEditPrice(product.price);
    setEditCategory(product.category);
    setEditImage(null);
    setEditError('');
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingProduct(null);
    setEditImage(null);
    setEditError('');
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setEditError('');
    setIsUpdating(true);

    const formData = new FormData();
    formData.append('name', editName);
    formData.append('description', editDescription);
    formData.append('price', editPrice);
    formData.append('category', editCategory);
    if (editImage) {
      formData.append('image', editImage);
    }

    try {
      await adminService.updateProduct(editingProduct.id, formData);
      setSuccess(`¡Producto "${editName}" actualizado exitosamente!`);
      handleCloseEditModal();
      fetchProducts();
    } catch (err) {
      setEditError(err.response?.data?.message || 'Error al actualizar el producto.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      return;
    }
    try {
      await adminService.deleteProduct(productId);
      setSuccess('¡Producto eliminado exitosamente!');
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar el producto.');
    }
  };

  return (
    <Container className="mt-5">
      <Card style={{ maxWidth: '600px', margin: 'auto' }} className="shadow-sm border-0">
        <Card.Body className="p-4">
          <h2 className="text-center mb-4 fw-bold">Agregar Nuevo Producto</h2>
          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
          {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Nombre del Producto</Form.Label>
              <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Descripción</Form.Label>
              <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Precio ($)</Form.Label>
              <Form.Control type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Categoría</Form.Label>
              <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="men">Hombre</option>
                <option value="women">Mujer</option>
                <option value="accessories">Accesorios</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Imagen del Producto</Form.Label>
              <Form.Control type="file" onChange={handleImageChange} required />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 py-2 fw-semibold">
              Agregar Producto
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <h2 className="mt-5 mb-4 text-center fw-bold">Administrar Productos</h2>
      {products.length === 0 ? (
        <p className="text-center text-muted">No hay productos para mostrar.</p>
      ) : (
        <ListGroup className="mb-5 shadow-sm">
          {products.map((product) => (
            <ListGroup.Item key={product.id} className="p-3">
              <Row className="align-items-center">
                <Col xs={3} md={2}>
                  <Image 
                    src={`${productService.BASE_URL}${product.image}`} 
                    alt={product.name} 
                    fluid 
                    rounded 
                    style={{ height: '70px', width: '70px', objectFit: 'contain', backgroundColor: '#ffffff', padding: '2px', border: '1px solid #eee' }}
                  />
                </Col>
                <Col xs={5} md={6}>
                  <h5 className="mb-1 fw-bold">{product.name}</h5>
                  <span className="badge bg-secondary me-2">{CATEGORY_NAMES[product.category] || product.category}</span>
                  <span className="fw-bold text-success">${Number(product.price).toFixed(2)}</span>
                </Col>
                <Col xs={4} md={4} className="text-end">
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="me-2 fw-semibold"
                    onClick={() => handleOpenEditModal(product)}
                  >
                    Editar
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    className="fw-semibold"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    Eliminar
                  </Button>
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      {/* Edit Product Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Editar Producto</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateProduct}>
          <Modal.Body>
            {editError && <Alert variant="danger">{editError}</Alert>}
            
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Nombre del Producto</Form.Label>
              <Form.Control 
                type="text" 
                value={editName} 
                onChange={(e) => setEditName(e.target.value)} 
                required 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Descripción</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                value={editDescription} 
                onChange={(e) => setEditDescription(e.target.value)} 
                required 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Precio ($)</Form.Label>
              <Form.Control 
                type="number" 
                step="0.01" 
                value={editPrice} 
                onChange={(e) => setEditPrice(e.target.value)} 
                required 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Categoría</Form.Label>
              <Form.Select 
                value={editCategory} 
                onChange={(e) => setEditCategory(e.target.value)}
              >
                <option value="men">Hombre</option>
                <option value="women">Mujer</option>
                <option value="accessories">Accesorios</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Cambiar Imagen (Opcional)</Form.Label>
              <Form.Control type="file" onChange={handleEditImageChange} />
              <Form.Text className="text-muted">
                Deja este campo vacío para mantener la imagen actual.
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEditModal} disabled={isUpdating} className="fw-semibold">
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={isUpdating} className="fw-semibold">
              {isUpdating ? 'Guardando Cambios...' : 'Guardar Cambios'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Admin;
