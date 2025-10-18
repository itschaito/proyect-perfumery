// frontend/src/context/useAuth.jsx
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

    // FUNCIÓN DE VERIFICACIÓN MEJORADA:
    const isAdminAuthenticated = () => {
        // Verifica el token en el estado Y el token en localStorage
        // Esto es más seguro contra errores de tiempo de renderizado.
        return !!token || !!localStorage.getItem('adminToken');
    };

    const contextValue = { token, login, logout, isAdminAuthenticated };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};