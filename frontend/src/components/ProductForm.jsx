// frontend/src/components/ProductForm.jsx (¡VERSION FINAL Y CORREGIDA!)
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Button, Grid, Paper } from '@mui/material';
import { Save } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/useAuth'; 

// ⚠️ CAMBIO CRÍTICO: Usar el puerto local del backend (5000)
// Esto debe cambiarse a 'https://tu-url-render.onrender.com' antes de desplegar
const BACKEND_URL = 'https://proyect-perfumery.onrender.com'; 

// URLs de la API
const API_BASE_URL = `${BACKEND_URL}/api/admin/productos`; 
const API_PUBLIC_URL = `${BACKEND_URL}/api/productos`;      

const ProductForm = ({ action = 'add' }) => {
    // useParams() se usa para obtener el ID de la URL si estamos en modo edición
    const { id } = useParams(); 
    const isEdit = action === 'edit';

    const [formData, setFormData] = useState({
        name: '', price: '', image: '', notes: '', description: '', stock: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    // El 'initialLoad' se usa solo en edición para mostrar un spinner mientras carga el producto
    const [initialLoad, setInitialLoad] = useState(isEdit); 
    const navigate = useNavigate();
    
    // ✅ CORRECCIÓN CRÍTICA: Desestructuración para 'getAuthToken is not a function'
    const { getAuthToken } = useAuth(); 

    // Cargar datos del producto si estamos editando
    useEffect(() => {
        if (isEdit && id) {
            console.log('📝 Modo Edición: Cargando producto con ID:', id);
            setLoading(true);
            axios.get(`${API_PUBLIC_URL}/${id}`)
                .then(response => {
                    const product = response.data;
                    console.log('✅ Producto cargado:', product);
                    setFormData({
                        name: product.name || '',
                        price: product.price || '',
                        image: product.image || '',
                        // Convierte el array de Mongoose a string para el TextField
                        notes: Array.isArray(product.notes) ? product.notes.join(', ') : '', 
                        description: product.description || '',
                        stock: product.stock || '',
                    });
                })
                .catch(err => {
                    console.error('❌ Error al cargar los datos del producto:', err);
                    setError('Error al cargar los datos del producto.');
                })
                .finally(() => {
                    setLoading(false);
                    setInitialLoad(false);
                });
        } else if (!isEdit) {
            setInitialLoad(false);
        }
    }, [isEdit, id]); // Dependencias del useEffect

    // Manejar cambio en los campos
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const token = getAuthToken(); // Obtiene el token

        if (!token) {
            console.log('❌ Error: Token no encontrado.');
            setError('Error de autenticación. Por favor, inicia sesión de nuevo.');
            setLoading(false);
            return;
        }

        // Prepara los datos para Mongoose
        const productData = {
            ...formData,
            // Convierte Price y Stock a Number para Mongoose
            price: Number(formData.price),
            stock: Number(formData.stock),
            // Convierte el string de notas en un Array de Strings para Mongoose
            notes: formData.notes.split(/[\s,]+/).filter(Boolean), 
        };
        
        console.log('📤 Enviando datos:', productData);

        const url = isEdit ? `${API_BASE_URL}/${id}` : API_BASE_URL;
        const method = isEdit ? axios.put : axios.post; // Selecciona PUT o POST

        try {
            await method(url, productData, {
                // ⚠️ CABECERA CRÍTICA para enviar el Token
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            });
            
            console.log(`✅ Producto ${isEdit ? 'actualizado' : 'creado'} con éxito.`);
            navigate('/admin'); // Redirige al dashboard
        } catch (err) {
            const status = err.response?.status;
            const errMsg = err.response?.data?.message || `Error de conexión o Token inválido. (Código: ${status})`;
            
            console.error('❌ Error en la petición:', err.response?.data || err.message);
            setError(errMsg);
        } finally {
            setLoading(false);
        }
    };
    
    const title = action === 'add' ? 'AGREGAR NUEVO PRODUCTO' : `EDITAR PRODUCTO ID: ${id}`;
    
    if (initialLoad) {
        return (
            <Container sx={{ mt: 5 }}>
                <Typography align="center" variant="h5">Cargando datos del producto...</Typography>
            </Container>
        );
    }
    
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
                            disabled={isEdit} 
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
                            disabled={isEdit} 
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
                            label="Notas Olfativas (separadas por comas)" 
                            name="notes" 
                            value={formData.notes} 
                            onChange={handleChange} 
                            multiline 
                            disabled={isEdit} 
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
                            disabled={isEdit} 
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