// frontend/src/pages/AdminLogin.jsx
import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth'; 
import axios from 'axios'; 


const BACKEND_URL = 'http://localhost:5000'; // <--- ¡REEMPLAZA ESTA URL!

// Cambia las URL de la API:
const LOGIN_API_URL = `${BACKEND_URL}/api/auth/login`;

const AdminLogin = () => {
    const [username, setUsername] = useState('admin'); // Puedes pre-llenar el usuario para facilitar las pruebas
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => { 
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 1. Enviar las credenciales al backend
            const response = await axios.post(LOGIN_API_URL, {
                username: username,
                password: password,
            });

            // Suponiendo que el backend devuelve un objeto con un 'token'
            const token = response.data.token;
            
            if (token) {
                // 2. Si el token existe, llamar a login() y redirigir
                login(token); 
                navigate('/admin'); 
            } else {
                setError('Respuesta del servidor incompleta. Falta token.');
            }

        } catch (err) {
            // 3. Manejar errores de respuesta (401 Unauthorized, etc.)
            if (err.response && err.response.data && err.response.data.msg) {
                setError(err.response.data.msg); 
            } else {
                setError('Credenciales incorrectas o el servidor no responde. Verifica que el backend esté ejecutándose.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ mt: 8, mb: 8 }}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 4,
                    border: '1px solid #ddd',
                    borderRadius: 2,
                    boxShadow: 3
                }}
            >
                <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
                    Acceso de Administrador
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    {/* --- CAMPO DE USUARIO --- */}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Nombre de usuario"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    {/* --- CAMPO DE CONTRASEÑA --- */}
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Contraseña"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    
                    {error && (
                        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                            {error}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading} 
                        sx={{ mt: 3, mb: 2, bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
                    >
                        {loading ? 'INGRESANDO...' : 'INICIAR SESIÓN'}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default AdminLogin;