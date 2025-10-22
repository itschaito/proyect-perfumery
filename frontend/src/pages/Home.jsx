// frontend/src/pages/Home.jsx (VERSIÓN FINAL Y COMPLETA)
import React, { useState, useEffect } from 'react';
import { 
    Container, Typography, Box, Grid, Card, CardContent, 
    CardMedia, Button, Modal, IconButton, Fade, Backdrop, 
    Divider, Chip 
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import axios from 'axios';

const BACKEND_URL = 'https://proyect-perfumery.onrender.com';

const API_URL = `${BACKEND_URL}/api/productos`;

// Estilo del Modal
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '95%', sm: 600, md: 700 }, 
    bgcolor: '#1A1A1A', 
    color: 'white',
    boxShadow: 24,
    p: { xs: 3, md: 4 }, 
    borderRadius: 2,
    maxHeight: '85vh',
    overflowY: 'auto',
};

const Home = ({ searchTerm = '' }) => { 
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null); 
    
    // Función para obtener la URL de la imagen, con fallback para datos antiguos
    const getProductImage = (product) => {
        // Busca en 'image' (nuevo formato) o 'imageUrl' (posible formato antiguo)
        return product.image || product.imageUrl || 'URL_IMAGEN_DEFAULT_AQUI'; 
    };

    const handleOpen = (product) => {
        setSelectedProduct(product);
        setOpenModal(true);
    };

    const handleClose = () => {
        setOpenModal(false);
        setSelectedProduct(null);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(API_URL);
                setProducts(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error al cargar los productos:", err);
                setError("No se pudieron cargar los productos. Verifique la conexión al backend (puerto 5000).");
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Renderiza las notas olfativas como chips
    const renderNotesAsChips = (notes) => {
        const notesArray = Array.isArray(notes) 
            ? notes 
            : typeof notes === 'string' ? notes.split(/[\s,]+/).filter(Boolean) : [];
        
        return notesArray.map((note, index) => ( 
            <Chip 
                key={index}
                label={note.trim()}
                icon={<LocalOfferIcon sx={{ color: 'white!important', opacity: 0.8, fontSize: '1rem' }} />}
                size="small"
                sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.15)', 
                    color: 'white', 
                    mr: 1, 
                    mb: 1, 
                    fontWeight: 500
                }}
            />
        ));
    };

    // Lógica de Filtrado
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) return (
        <Container sx={{ mt: 8, textAlign: 'center' }}>
            <Typography variant="h6" color="primary">Cargando catálogo...</Typography>
        </Container>
    );

    if (error) return (
        <Container sx={{ mt: 8 }}>
            <Typography variant="h6" color="error">{error}</Typography>
        </Container>
    );
    
    return (
        <Container component="main" maxWidth="xl" sx={{ mt: 6, mb: 8, p: 3 }}>
            
            <Typography 
                variant="h2" 
                component="h1" 
                align="center" 
                sx={{ color: 'primary.dark', fontWeight: 700, letterSpacing: 4, mb: 6 }}
            >
                COLECCIÓN DE FRAGANCIAS
            </Typography>

            {/* --- Grid de Productos --- */}
            <Grid 
                container 
                spacing={5} 
                // Asegura la centralización de las tarjetas
                justifyContent="flex-start" 
                sx={{ mx: 'auto', maxWidth: '1400px' }} // Límite de ancho para mejor visualización
            >
                
                {filteredProducts.length === 0 ? (
                    <Grid item xs={12}>
                        <Box sx={{ p: 6, border: '2px dashed #ddd', borderRadius: 2, textAlign: 'center' }}>
                            <Typography variant="h5" color="text.secondary">
                                El catálogo está vacío o no hay resultados para "{searchTerm}".
                            </Typography>
                        </Box>
                    </Grid>
                ) : (
                    filteredProducts.map((product) => (
                        // --- CONFIGURACIÓN PARA 3 POR FILA (md=4) ---
                        <Grid 
                            item 
                            key={product.id} 
                            xs={12} sm={6} md={4} lg={4} // lg=4 también asegura 3 por fila en pantallas muy grandes
                        >
                            <Card 
                                elevation={6} 
                                sx={{ 
                                    cursor: 'pointer', 
                                    height: '100%', 
                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                    borderRadius: 3, 
                                    '&:hover': { 
                                        transform: 'translateY(-5px)', 
                                        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)'
                                    }
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="320" 
                                    // --- USO DE LA FUNCIÓN CON FALLBACK ---
                                    image={getProductImage(product)} 
                                    alt={product.name}
                                    sx={{ objectFit: 'cover', borderBottom: '1px solid #eee' }}
                                />
                                <CardContent sx={{ textAlign: 'center', p: 3 }}>
                                    
                                    <Typography 
                                        variant="h6" 
                                        component="div" 
                                        sx={{ color: 'black', fontWeight: 700, letterSpacing: 0.5, mb: 1 }}
                                    >
                                        {product.name}
                                    </Typography>
                                    
                                    <Typography variant="h5" color="primary.main" sx={{ mb: 2, fontWeight: 500 }}>
                                        ${product.price ? product.price.toFixed(2) : '0.00'}
                                    </Typography>
                                    
                                    <Button
                                        variant="contained"
                                        startIcon={<VisibilityIcon />}
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            handleOpen(product); 
                                        }} 
                                        fullWidth
                                        sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
                                    >
                                        VER DETALLE
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>

            {/* --- Modal de Detalle --- */}
            {selectedProduct && (
                <Modal
                    open={openModal}
                    onClose={handleClose}
                    closeAfterTransition
                    slots={{ backdrop: Backdrop }}
                    slotProps={{ backdrop: { timeout: 500 } }}
                >
                    <Fade in={openModal}>
                        <Box sx={modalStyle}>
                            <IconButton 
                                onClick={handleClose} 
                                sx={{ position: 'absolute', right: 8, top: 8, color: 'white', zIndex: 10 }}
                            >
                                <CloseIcon />
                            </IconButton>
                            
                            <Grid container spacing={{ xs: 2, md: 5 }}>
                                <Grid item xs={12} md={6}>
                                    <Box 
                                        component="img"
                                        // Usa la función con fallback para la imagen del modal
                                        src={getProductImage(selectedProduct)}
                                        alt={selectedProduct.name}
                                        sx={{ width: '100%', height: 'auto', borderRadius: 2, boxShadow: 6 }}
                                    />
                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                        Stock: {selectedProduct.stock} unidades
                                    </Typography>
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <Typography variant="overline" color="primary.light" sx={{ mb: 1, display: 'block' }}>
                                        Fragancia Exclusiva
                                    </Typography>
                                    <Typography variant="h4" component="h2" sx={{ mb: 1, fontWeight: 800, color: 'white' }}>
                                        {selectedProduct.name}
                                    </Typography>
                                    
                                    <Divider sx={{ my: 2, bgcolor: 'primary.dark' }} />

                                    <Typography variant="h5" sx={{ mt: 1, color: 'primary.light', fontWeight: 700 }}>
                                        ${selectedProduct.price ? selectedProduct.price.toFixed(2) : '0.00'}
                                    </Typography>
                                    
                                    <Box sx={{ my: 3 }}>
                                        <Typography variant="body2" sx={{ mb: 1, color: '#ccc' }}>
                                            **Notas Olfativas Principales:**
                                        </Typography>
                                        <Box>
                                            {renderNotesAsChips(selectedProduct.notes)}
                                        </Box>
                                    </Box>

                                    <Typography variant="body1" sx={{ mt: 3, color: '#eee' }}>
                                        {selectedProduct.description}
                                    </Typography>

                                    <Button
                                        variant="contained"
                                        startIcon={<ShoppingCartIcon />}
                                        fullWidth
                                        sx={{ mt: 4, py: 1.5, bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
                                        onClick={() => console.log('Boton Pedir presionado')} 
                                    >
                                        AÑADIR A LA BOLSA
                                    </Button>
                                </Grid>
                            </Grid>

                        </Box>
                    </Fade>
                </Modal>
            )}
        </Container>
    );
};

export default Home;