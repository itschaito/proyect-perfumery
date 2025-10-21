// frontend/src/components/ProductForm.jsx (¡VERSION FINAL Y MODIFICADA CON BLOQUEO DE CAMPOS!)
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Button, Grid, Paper } from '@mui/material';
import { Save } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; // Para obtener el ID
import { useAuth } from '../context/useAuth'; 

// DEFINE LA URL PÚBLICA DE TU BACKEND DE RENDER
const BACKEND_URL = 'https://proyect-perfumery-1.onrender.com'; // <--- ¡REEMPLAZA ESTA URL!

// Cambia las URL de la API:
const API_BASE_URL = `${BACKEND_URL}/api/admin/productos`; 
const API_PUBLIC_URL = `${BACKEND_URL}/api/productos`;

const ProductForm = ({ action = 'add' }) => {
    const { id } = useParams(); // ID solo existe si la ruta es /admin/editar/:id

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        image: '',
        notes: '', 
        description: '',
        stock: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [initialLoad, setInitialLoad] = useState(action === 'edit');
    
    const navigate = useNavigate();
    const { getAuthToken } = useAuth(); 

    // Cargar los datos del producto existente (SOLO PARA EDICIÓN)
    useEffect(() => {
        if (action === 'edit' && id) {
            const fetchProduct = async () => {
                try {
                    const response = await axios.get(`${API_PUBLIC_URL}/${id}`);
                    const product = response.data;

                    // Formatear notas: de array a string para el TextField
                    const notesString = Array.isArray(product.notes) ? product.notes.join(', ') : (product.notes || '');

                    setFormData({
                        name: product.name || '',
                        price: product.price || '',
                        // Fallback por si en el JSON antiguo usa 'imageUrl'
                        image: product.image || product.imageUrl || '', 
                        notes: notesString,
                        description: product.description || '',
                        stock: product.stock || 0,
                    });
                    setInitialLoad(false); 
                } catch (err) {
                    console.error('Error al cargar el producto para edición:', err);
                    setError('No se pudo cargar la información del producto. Verifique la ID y el backend.'); 
                    setInitialLoad(false);
                }
            };
            fetchProduct();
        } else if (action === 'add') {
            setInitialLoad(false);
        }
    }, [action, id]); 
    
    // Manejar cambio en los campos
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Manejar el envío (POST para agregar, PUT para editar)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const token = getAuthToken(); 
        if (!token) {
            setError('Error: Sesión expirada. Por favor, inicie sesión de nuevo.');
            setLoading(false);
            return;
        }

        const productData = { ...formData };
        
        // Determinar URL y Método
        const url = action === 'edit' ? `${API_BASE_URL}/${id}` : API_BASE_URL;
        const method = action === 'edit' ? 'put' : 'post';

        try {
            await axios({
                method: method,
                url: url,
                data: productData,
                headers: { 
                    'Authorization': `Bearer ${token}` 
                }
            });
            
            navigate('/admin'); 

        } catch (err) {
            const msg = err.response?.data?.message || `Error al ${action === 'edit' ? 'actualizar' : 'guardar'}. Verifique los campos.`;
            setError(msg);
        } finally {
            setLoading(false);
        }
    };
    
    const title = action === 'add' ? 'AGREGAR NUEVO PRODUCTO' : `EDITAR PRODUCTO ID: ${id}`;
    
    // Estado de carga inicial
    if (initialLoad) {
        return (
            <Container sx={{ mt: 5 }}>
                <Typography align="center" variant="h5">Cargando datos del producto...</Typography>
            </Container>
        );
    }
    
    // La variable 'isEdit' nos ayuda a deshabilitar campos
    const isEdit = action === 'edit';
    
    return (
        <Container component={Paper} elevation={3} sx={{ mt: 5, p: 4, maxWidth: '800px' }}>
            <Typography variant="h4" gutterBottom align="center" sx={{ color: 'primary.main', mb: 4 }}>
                {title}
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <Grid container spacing={3}>
                    
                    {/* ID del Producto */}
                    {isEdit && (
                        <Grid item xs={12}>
                            <TextField fullWidth label="ID del Producto" name="id" value={id} disabled />
                        </Grid>
                    )}
                    
                    {/* Nombre (BLOQUEADO EN EDICIÓN) */}
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            required 
                            fullWidth 
                            label="Nombre del Producto" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            disabled={isEdit} // <-- CAMPO DESHABILITADO
                            helperText={isEdit ? "El nombre no se puede editar." : ""}
                        />
                    </Grid>
                    
                    {/* Precio (EDITABLE) */}
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            required 
                            fullWidth 
                            label="Precio (Solo números)" 
                            name="price" 
                            type="number" 
                            value={formData.price} 
                            onChange={handleChange} 
                            inputProps={{ step: "0.01" }} 
                        />
                    </Grid>

                    {/* URL de Imagen (BLOQUEADO EN EDICIÓN) */}
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            required 
                            fullWidth 
                            label="URL de Imagen" 
                            name="image" 
                            value={formData.image} 
                            onChange={handleChange} 
                            disabled={isEdit} // <-- CAMPO DESHABILITADO
                            helperText={isEdit ? "La imagen no se puede editar." : ""}
                        />
                    </Grid>
                    
                    {/* Stock (EDITABLE) */}
                    <Grid item xs={12} sm={6}>
                        <TextField 
                            required 
                            fullWidth 
                            label="Stock" 
                            name="stock" 
                            type="number" 
                            value={formData.stock} 
                            onChange={handleChange} 
                        />
                    </Grid>

                    {/* Notas Olfativas (BLOQUEADO EN EDICIÓN) */}
                    <Grid item xs={12}>
                        <TextField 
                            required 
                            fullWidth 
                            label="Notas Olfativas (ej. rosa, madera, cítrico)" 
                            name="notes" 
                            value={formData.notes} 
                            onChange={handleChange} 
                            multiline 
                            disabled={isEdit} // <-- CAMPO DESHABILITADO
                            helperText={isEdit ? "Las notas no se pueden editar." : ""}
                        />
                    </Grid>

                    {/* Descripción (BLOQUEADO EN EDICIÓN) */}
                    <Grid item xs={12}>
                        <TextField 
                            required 
                            fullWidth 
                            label="Descripción del Producto" 
                            name="description" 
                            value={formData.description} 
                            onChange={handleChange} 
                            multiline 
                            rows={4} 
                            disabled={isEdit} // <-- CAMPO DESHABILITADO
                            helperText={isEdit ? "La descripción no se puede editar." : ""}
                        />
                    </Grid>
                </Grid>

                {/* Mensaje de Error */}
                {error && (
                    <Typography color="error" variant="body1" sx={{ mt: 2 }}>
                        {error}
                    </Typography>
                )}

                {/* Botones */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}>
                    <Button 
                        variant="outlined" 
                        onClick={() => navigate('/admin')}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={<Save />}
                        disabled={loading}
                    >
                        {loading ? 'GUARDANDO...' : (isEdit ? 'ACTUALIZAR PRODUCTO' : 'GUARDAR PRODUCTO')}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default ProductForm;