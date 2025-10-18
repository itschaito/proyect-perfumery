// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config(); 

const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Uso de Rutas
app.use('/api/auth', authRoutes);
app.use('/api', productRoutes); // <-- Usa la ruta de productos

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor Express corriendo en http://localhost:${PORT}`);
});