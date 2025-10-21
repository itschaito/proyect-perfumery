// frontend/src/context/useAuth.jsx (¡CORREGIDO!)
import React, { createContext, useState, useContext } from 'react';
// ... (otras importaciones) ...

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Inicializa el token con lo que haya en localStorage
    const [token, setToken] = useState(localStorage.getItem('adminToken') || null);

    const login = (newToken) => {
        localStorage.setItem('adminToken', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('adminToken');
        setToken(null);
    };

    // --- FUNCIÓN AÑADIDA: Obtiene el token de localStorage ---
    const getAuthToken = () => {
        return localStorage.getItem('adminToken');
    };
    // --------------------------------------------------------

    // FUNCIÓN DE VERIFICACIÓN MEJORADA:
    const isAdminAuthenticated = () => {
        // Usa getAuthToken para la verificación
        return !!getAuthToken();
    };

    // --- OBJETO DE CONTEXTO CORREGIDO: Incluye getAuthToken ---
    const contextValue = { token, login, logout, isAdminAuthenticated, getAuthToken };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};