import React, { useState, useEffect } from 'react';
import { 
    Container, Typography, Box, Button, Grid, Paper, 
    Table, TableBody, TableCell, TableContainer, TableHead, 
    TableRow, IconButton, Alert 
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/useAuth'; // Para obtener el token

const API_PRODUCTS_URL = 'http://localhost:5000/api/productos'; // GET público
const API_ADMIN_URL = 'http://localhost:5000/api/admin/productos'; // Rutas CRUD

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
            setError('Error al cargar la lista de productos.');
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
            setError(err.response?.data?.message || 'Error al eliminar el producto. ¿Token expirado?');
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    if (loading) return <Container sx={{ mt: 8 }}><Typography>Cargando Dashboard...</Typography></Container>;

    // --- Renderizado ---
    return (
        <Container sx={{ mt: 8, mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" sx={{ color: 'primary.main' }}>
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

            {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead sx={{ bgcolor: 'lightgray' }}>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Precio</TableCell>
                            <TableCell>Notas Olfativas</TableCell>
                            <TableCell align="right">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id} hover>
                                <TableCell>{product.id}</TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>${product.price.toFixed(2)}</TableCell>
                                <TableCell>{product.notes.substring(0, 50)}...</TableCell>
                                <TableCell align="right">
                                    <IconButton 
                                        color="primary"
                                        onClick={() => navigate(`/admin/editar/${product.id}`)} // <-- Ruta para Editar
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton 
                                        color="error"
                                        onClick={() => handleDelete(product.id)}
                                    >
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            
            {/* OTRAS CARACTERÍSTICAS SUGERIDAS */}
            <Box mt={4}>
                <Typography variant="h6">Otras Características Sugeridas:</Typography>
                <Button variant="outlined" sx={{ mr: 2 }}>Gestionar Pedidos (Falso)</Button>
                <Button variant="outlined">Ver Reporte de Ventas (Falso)</Button>
            </Box>

        </Container>
    );
};

export default AdminDashboard;