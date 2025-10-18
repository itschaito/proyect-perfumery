import React, { useState, useEffect } from 'react';
import { 
    Container, Box, Typography, TextField, Button, Alert 
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/useAuth';

const API_PRODUCTS_URL = 'http://localhost:5000/api/productos'; // Obtener detalle para editar
const API_ADMIN_URL = 'http://localhost:5000/api/admin/productos'; // POST/PUT CRUD

const ProductForm = ({ action }) => {
    const { id } = useParams(); // Para modo 'edit'
    const navigate = useNavigate();
    const { getAuthToken } = useAuth();
    const token = getAuthToken();
    
    const [formData, setFormData] = useState({
        name: '', notes: '', description: '', price: '', imageUrl: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const isEdit = action === 'edit';
    const pageTitle = isEdit ? `Editar Producto ID: ${id}` : 'Agregar Nuevo Producto';

    // Cargar datos si estamos en modo Edición
    useEffect(() => {
        if (isEdit) {
            const fetchProduct = async () => {
                setLoading(true);
                try {
                    // Nota: Usamos la ruta pública GET para obtener los detalles
                    const response = await axios.get(`${API_PRODUCTS_URL}?id=${id}`); 
                    const product = response.data.find(p => p.id === parseInt(id));
                    
                    if (product) {
                        setFormData({
                            name: product.name || '',
                            notes: product.notes || '',
                            description: product.description || '',
                            price: product.price || '',
                            imageUrl: product.imageUrl || ''
                        });
                    }
                } catch (err) {
                    console.error('Error al cargar el producto para editar:', err);
                    setError('No se pudo cargar el producto para editar.');
                }
                setLoading(false);
            };
            fetchProduct();
        }
    }, [isEdit, id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: name === 'price' ? parseFloat(value) : value 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (!token) throw new Error("No autenticado. Por favor, inicie sesión.");

            if (isEdit) {
                // PUT para editar
                await axios.put(`${API_ADMIN_URL}/${id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Producto actualizado con éxito!');
            } else {
                // POST para agregar
                await axios.post(API_ADMIN_URL, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert('Producto agregado con éxito!');
            }
            navigate('/admin'); // Regresar al dashboard
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Error al guardar el producto.');
        }
    };

    if (loading) return <Container sx={{ mt: 8 }}><Typography>Cargando formulario...</Typography></Container>;

    return (
        <Container component="main" maxWidth="sm" sx={{ mt: 8 }}>
            <Box 
                sx={{ 
                    p: 4, 
                    boxShadow: 3, 
                    borderRadius: 2, 
                    backgroundColor: 'white' 
                }}
            >
                <Typography variant="h4" sx={{ mb: 4, color: 'primary.main' }}>
                    {pageTitle}
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField fullWidth required label="Nombre" name="name" value={formData.name} onChange={handleChange} sx={{ mb: 2 }} />
                    <TextField fullWidth required label="Precio" name="price" type="number" value={formData.price} onChange={handleChange} sx={{ mb: 2 }} />
                    <TextField fullWidth label="URL de Imagen" name="imageUrl" value={formData.imageUrl} onChange={handleChange} sx={{ mb: 2 }} />
                    <TextField fullWidth label="Notas Olfativas" name="notes" value={formData.notes} onChange={handleChange} sx={{ mb: 2 }} />
                    <TextField fullWidth label="Descripción Detallada" name="description" multiline rows={4} value={formData.description} onChange={handleChange} sx={{ mb: 3 }} />
                    
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        {isEdit ? 'Guardar Cambios' : 'Crear Producto'}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default ProductForm;