import React, { createContext, useState } from 'react';

// 1. Exportamos el Contexto (para que el hook lo pueda importar)
export const AuthContext = createContext(null);

// 2. Exportamos el Provider (que es un componente de React, y solo exportamos UNO)
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('adminToken'));

    const login = (newToken) => {
        localStorage.setItem('adminToken', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('adminToken');
        setToken(null);
    };

    const isAdminAuthenticated = () => !!token;

    const contextValue = { token, login, logout, isAdminAuthenticated };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};