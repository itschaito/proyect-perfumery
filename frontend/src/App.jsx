// frontend/src/App.jsx
import React, { useState } from 'react'; 
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Box } from '@mui/material';

// Importaciones (Verifica tus rutas)
import Navbar from './components/Navbar';
import Footer from './components/Footer'; 
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProductForm from './components/ProductForm';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute'; 

const AppContent = () => {
    const [searchTerm, setSearchTerm] = useState(''); 
    const location = useLocation();
    
    // Si la ruta es la de login, NO MOSTRAR Navbar ni Footer.
    const isLoginLayout = location.pathname === '/admin/login'; 

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    return (
        // El Box principal ahora maneja dos posibles layouts
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            
            {/* -------------------- 1. NAVBAR (Condicional) -------------------- */}
            {!isLoginLayout && <Navbar onSearch={handleSearch} />}
            
            <Box component="main" sx={{ flexGrow: 1 }}>
                <Routes>
                    
                    {/* RUTA DE LOGIN (Layout Limpio) */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    
                    {/* RUTAS CON LAYOUT COMPLETO (Home y Admin) */}
                    <Route path="/" element={<Home searchTerm={searchTerm} />} /> 
                    
                    {/* Rutas Protegidas */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/admin/agregar" element={<ProductForm action="add" />} />
                        <Route path="/admin/editar/:id" element={<ProductForm action="edit" />} />
                    </Route>

                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Box>

            {/* -------------------- 2. FOOTER (Condicional) -------------------- */}
            {!isLoginLayout && <Footer />} 
        </Box>
    );
}

// El componente principal App debe envolver todo en Router
const App = () => (
    <Router>
        <AppContent />
    </Router>
);

export default App;