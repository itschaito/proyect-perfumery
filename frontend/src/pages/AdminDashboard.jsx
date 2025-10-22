// frontend/src/pages/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { 
    Container, Typography, Box, Button, Paper, 
    Table, TableBody, TableCell, TableContainer, TableHead, 
    TableRow, IconButton, Alert 
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/useAuth'; 

// frontend/src/pages/AdminDashboard.jsx

// DEFINE LA URL PÚBLICA DE TU BACKEND DE RENDER
const BACKEND_URL = 'https://proyect-perfumery.onrender.com'; // <--- ¡REEMPLAZA ESTA URL!

// Cambia las URL de la API:
const API_PRODUCTS_URL = `${BACKEND_URL}/api/productos`; // GET público
const API_ADMIN_URL = `${BACKEND_URL}/api/admin/productos`; // Rutas CRUD
// ... (resto del código)

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const { getAuthToken } = useAuth();
    const navigate = useNavigate();

    // Función para obtener la lista de productos
    const fetchProducts = async () => {
        try {
            const response = await axios.get(API_PRODUCTS_URL);
            setProducts(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error al cargar la lista de productos:', err);
            setError('Error al cargar la lista de productos. Verifique la conexión al backend.');
            setLoading(false);
        }
    };

    // Función para eliminar un producto
    const handleDelete = async (id) => {
        if (!window.confirm(`¿Estás seguro de que quieres eliminar el producto ID ${id}?`)) {
            return;
        }

        try {
            const token = getAuthToken();
            await axios.delete(`${API_ADMIN_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage(`Producto ID ${id} eliminado con éxito.`);
            fetchProducts(); // Recargar la lista
        } catch (err) {
            setError(err.response?.data?.message || 'Error al eliminar. Asegúrese de estar logeado.');
        }
    };

    // Al montar el componente, cargamos la lista
    useEffect(() => {
        fetchProducts();
    }, []); 

    if (loading) return <Container sx={{ mt: 8 }}><Typography>Cargando Dashboard...</Typography></Container>;

    return (
        <Container sx={{ mt: 8, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700 }}>
                    Panel de Administración de Productos
                </Typography>
                <Button 
                    variant="contained" 
                    color="secondary"
                    startIcon={<Add />}
                    component={Link}
                    to="/admin/agregar" // <-- Ruta para Agregar
                >
                    Agregar Nuevo Producto
                </Button>
            </Box>

            {/* Mensajes de feedback */}
            {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Nombre</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Precio</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Stock</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Notas Olfativas</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 700 }}>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id} hover>
                                <TableCell>{product.id}</TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>${product.price ? product.price.toFixed(2) : 'N/A'}</TableCell>
                                <TableCell>{product.stock || 0}</TableCell>
                                <TableCell>{
                                    Array.isArray(product.notes) 
                                        ? product.notes.join(', ').substring(0, 50) + '...'
                                        : product.notes ? product.notes.substring(0, 50) + '...' : ''
                                }</TableCell>
                                <TableCell align="right">
                                    <IconButton 
                                        color="primary"
                                        onClick={() => navigate(`/admin/editar/${product.id}`)} 
                                        aria-label="editar"
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton 
                                        color="error"
                                        onClick={() => handleDelete(product.id)}
                                        aria-label="eliminar"
                                    >
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            
            <Box mt={6} textAlign="center">
                <Typography variant="subtitle1" color="text.secondary">
                    Gestión de Contenido Adicional (Falso):
                </Typography>
                <Button variant="outlined" sx={{ mr: 2, mt: 1 }}>Gestionar Pedidos</Button>
                <Button variant="outlined" sx={{ mt: 1 }}>Ver Reporte de Ventas</Button>
            </Box>

        </Container>
    );
};

export default AdminDashboard;