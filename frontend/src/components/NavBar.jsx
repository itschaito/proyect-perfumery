import React, { useState } from 'react'; // <-- Importar useState
import { AppBar, Toolbar, Typography, Button, Box, IconButton, TextField, InputAdornment } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth'; 
import DashboardIcon from '@mui/icons-material/Dashboard'; 
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; 
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; 
// import PersonIcon from '@mui/icons-material/Person'; // <-- Eliminado
import SearchIcon from '@mui/icons-material/Search'; 

// El Navbar ahora acepta una prop 'onSearch'
const Navbar = ({ onSearch }) => { 
    const { isAdminAuthenticated, logout } = useAuth(); 
    const [searchTerm, setSearchTerm] = useState(''); // Estado local para el término de búsqueda

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        // Llamar a la función de búsqueda si se proporciona (idealmente para búsqueda instantánea)
        if (onSearch) {
            onSearch(event.target.value);
        }
    };

    // Fondo Blanco y Letras Negras
    const primaryColor = 'white'; 
    const textColor = 'black'; 

    return (
        <AppBar 
            position="static" 
            elevation={1} 
            sx={{ 
                bgcolor: primaryColor, 
                borderBottom: '1px solid #e0e0e0', 
                height: 70,
                py: 1
            }}
        >
            <Toolbar sx={{ minHeight: '60px !important' }}>
                
                {/* -------------------- Logo/Marca -------------------- */}
                <Typography 
                    variant="h5" 
                    component="div" 
                    sx={{ 
                        flexGrow: 1, 
                        fontWeight: 600, 
                        letterSpacing: 2, 
                        color: textColor,
                    }}
                >
                    <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                        PERFUMES.COM
                    </Link>
                </Typography>

                {/* -------------------- Buscador (Centro) -------------------- */}
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
                    <TextField
                        placeholder="BUSCAR fragancia, marca..."
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={handleSearchChange} // <-- Manejador de cambio
                        sx={{ 
                            width: '80%', 
                            maxWidth: 450,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 50, 
                                backgroundColor: '#f9f9f9',
                                '&.Mui-focused fieldset': {
                                    borderColor: 'primary.main',
                                },
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: 'text.secondary' }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>


                {/* -------------------- Íconos y Login -------------------- */}
                <Box display="flex" alignItems="center" sx={{ ml: 2 }}>
                    
                    {/* Carrito (Carreta) */}
                    <IconButton sx={{ color: textColor, '&:hover': { color: 'primary.main' } }}>
                        <ShoppingCartIcon />
                    </IconButton>

                    {/* Botón de Dashboard Admin (Solo si está autenticado) */}
                    {isAdminAuthenticated() && (
                        <>
                            <Button 
                                component={Link} 
                                to="/admin"
                                startIcon={<DashboardIcon />}
                                sx={{ color: 'primary.main', mx: 1, fontWeight: 600, '&:hover': { bgcolor: '#f0f0f0' } }}
                            >
                                DASHBOARD
                            </Button>
                            <Button 
                                onClick={logout}
                                startIcon={<ExitToAppIcon />}
                                sx={{ color: textColor, '&:hover': { bgcolor: '#f0f0f0' } }}
                            >
                                SALIR
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;