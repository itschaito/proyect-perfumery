// frontend/src/pages/Home.jsx
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

const API_URL = '/api/productos';

// Estilo del Modal (Tamaño ajustado para MD: 700px)
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

const Home = ({ searchTerm = '' }) => { // Recibe searchTerm, default a ''
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

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
                setError("No se pudieron cargar los productos. ¿Está el backend activo en :5000?");
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Lógica de Filtrado (busca en nombre y notas)
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.notes.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Renderiza las notas olfativas como chips
    const renderNotesAsChips = (notesString) => {
        if (!notesString) return null;
        return notesString.split(/[\s,]+/).filter(Boolean).map((note, index) => ( 
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

    if (loading) return (
        <Container sx={{ mt: 8, textAlign: 'center' }}>
            <Typography variant="h6" color="primary">Cargando catálogo premium...</Typography>
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
                sx={{ color: 'primary.dark', fontWeight: 700, letterSpacing: 4, mb: 2 }}
            >
                COLECCIÓN DE FRAGANCIAS
            </Typography>
            <Typography 
                variant="h6" 
                align="center" 
                color="text.secondary" 
                sx={{ mb: 6, fontStyle: 'italic' }}
            >
                Encuentra tu esencia perfecta entre nuestros productos seleccionados.
            </Typography>

            <Grid container spacing={5} justifyContent="center">
                
                {/* --- Manejo de Resultados y Búsqueda --- */}
                {filteredProducts.length === 0 && searchTerm !== '' ? (
                    <Grid item xs={12}>
                        <Box sx={{ p: 6, border: '2px dashed #ff4081', borderRadius: 2, textAlign: 'center' }}>
                            <Typography variant="h5" color="error">
                                😔 Producto no encontrado. Intenta con otra búsqueda.
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                                El término "{searchTerm}" no arrojó resultados.
                            </Typography>
                        </Box>
                    </Grid>
                ) : filteredProducts.length === 0 && products.length === 0 ? (
                    // Catálogo vacío al inicio
                    <Grid item xs={12}>
                        <Box sx={{ p: 6, border: '2px dashed #ddd', borderRadius: 2, textAlign: 'center' }}>
                            <Typography variant="h5" color="text.secondary">
                                El catálogo está vacío. Agrega productos desde el Dashboard Admin.
                            </Typography>
                        </Box>
                    </Grid>
                ) : (
                    // Renderizar los productos filtrados (3 por fila en lg)
                    filteredProducts.map((product) => (
                        <Grid 
                            item 
                            key={product.id} 
                            xs={12} sm={6} md={4} 
                            lg={4} 
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
                                    image={product.imageUrl}
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
                                        ${product.price.toFixed(2)}
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
                                        src={selectedProduct.imageUrl}
                                        alt={selectedProduct.name}
                                        sx={{ width: '100%', height: 'auto', borderRadius: 2, boxShadow: 6 }}
                                    />
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
                                        ${selectedProduct.price.toFixed(2)}
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