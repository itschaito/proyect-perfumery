// frontend/src/components/ProtectedRoute.jsx
import React from 'react';
import { useAuth } from '../context/useAuth';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    // 1. Obtener la función de verificación del contexto
    const { isAdminAuthenticated } = useAuth();
    
    // 2. Verificar si el usuario está autenticado
    if (!isAdminAuthenticated()) {
        // Si no está autenticado, redirigir a la página de login
        return <Navigate to="/admin/login" replace />;
    }
    
    // Si está autenticado, renderizar la ruta hija (AdminDashboard o ProductForm)
    return <Outlet />;
};

export default ProtectedRoute;