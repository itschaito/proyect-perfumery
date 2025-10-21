import { Link } from 'react-router-dom';
import React from 'react';
import { Box, Container, Typography, Grid, Button, Divider, IconButton } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import StoreIcon from '@mui/icons-material/Store';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TikTokIcon from '@mui/icons-material/GitHub'; 

const Footer = () => {
    
    // ... (El resto del código de Footer.jsx es el mismo)
    const lightGrayBg = '#f5f5f5'; 
    const darkFooterBg = '#1A1A1A'; 

    const services = [
        { icon: <LockIcon sx={{ fontSize: 40, color: 'primary.main' }} />, title: 'Pago Seguro', description: 'Cifrado de datos de alta seguridad.' },
        { icon: <LocalShippingIcon sx={{ fontSize: 40, color: 'primary.main' }} />, title: 'Envío Gratis', description: 'En compras mayores a $150.' },
        { icon: <StoreIcon sx={{ fontSize: 40, color: 'primary.main' }} />, title: 'Tienda Cercana', description: 'Encuentra nuestro punto de venta más cercano.' },
    ];

    return (
        <Box component="footer">
            
            {/* --- Sección de Servicios (Gris Claro) --- */}
            <Box sx={{ bgcolor: lightGrayBg, py: 6 }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4} justifyContent="center" textAlign="center">
                        {services.map((service, index) => (
                            <Grid item xs={12} sm={4} key={index}>
                                {service.icon}
                                <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}>{service.title}</Typography>
                                <Typography variant="body2" color="text.secondary">{service.description}</Typography>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* --- Sección de Navegación y Contacto (Gris Oscuro) --- */}
            <Box sx={{ bgcolor: darkFooterBg, color: 'white', py: 5 }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        
                        <Grid item xs={12} md={4}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, letterSpacing: 1.5 }}>PERFUMES.COM</Typography>
                            <Typography variant="body2">
                                La selección más exclusiva de fragancias de lujo. Garantizamos autenticidad y excelencia en cada envío.
                            </Typography>
                        </Grid>
                        
                        <Grid item xs={6} md={2}>
                            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>Descubrir</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                {/* Botones usan Link */}
                                <Button component={Link} to="/" sx={{ color: 'white', justifyContent: 'flex-start', py: 0.5 }}>Catálogo</Button>
                                <Button component={Link} to="/admin" sx={{ color: 'white', justifyContent: 'flex-start', py: 0.5 }}>Administración</Button>
                            </Box>
                        </Grid>
                        
                        <Grid item xs={6} md={2}>
                            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>Ayuda</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Button sx={{ color: 'white', justifyContent: 'flex-start', py: 0.5 }}>Términos</Button>
                                <Button sx={{ color: 'white', justifyContent: 'flex-start', py: 0.5 }}>Contacto</Button>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={4} textAlign="right">
                            <Typography variant="body1" sx={{ mb: 2 }}>
                                Contáctanos: info@perfumes.com
                            </Typography>
                            <Button variant="contained" sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}>
                                CHAT EN VIVO
                            </Button>
                        </Grid>
                    </Grid>
                    
                    <Divider sx={{ my: 4, bgcolor: '#444' }} />

                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" color="#ccc">
                            © {new Date().getFullYear()} PERFUMES.COM. Todos los derechos reservados.
                        </Typography>
                        <Box>
                            <IconButton href="#" target="_blank" sx={{ color: 'white' }}><FacebookIcon /></IconButton>
                            <IconButton href="#" target="_blank" sx={{ color: 'white' }}><InstagramIcon /></IconButton>
                            <IconButton href="#" target="_blank" sx={{ color: 'white' }}><TikTokIcon /></IconButton>
                        </Box>
                    </Box>
                </Container>
            </Box>

        </Box>
    );
};

export default Footer;