// backend/server.js (CORREGIDO)
const express = require('express');
const cors = require('cors');
require('dotenv').config(); 

const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// --- CONFIGURACIÓN CORREGIDA DE CORS ---
// ⚠️ ¡IMPORTANTE! Reemplaza 'https://tu-dominio-netlify.netlify.app' con la URL REAL de tu frontend.
const NETLIFY_FRONTEND_URL = 'perfumería-chai.netlify.app'; 

const corsOptions = {
    // Permitir acceso desde el dominio público (Netlify) y desde local
    origin: [NETLIFY_FRONTEND_URL, 'http://localhost:5173'], 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Esto es crucial para manejar el token JWT
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json());

// Uso de Rutas
app.use('/api/auth', authRoutes);
app.use('/api', productRoutes); 

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor Express corriendo en http://localhost:${PORT}`);
});