// backend/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path'); // <-- NECESARIO PARA CARGAR EL .ENV CORRECTAMENTE

// ⚠️ CORRECCIÓN CRÍTICA DE .env
// Forzamos a dotenv a cargar el archivo .env de la carpeta actual
require('dotenv').config({ path: path.resolve(__dirname, '.env') }); 

const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ----------------------------------------------------
// ⚠️ CONEXIÓN A MONGODB ATLAS
const DB_URI = process.env.MONGO_URI; 

// Verificación de existencia de la URI (para evitar el error "undefined")
if (!DB_URI) {
    console.error("❌ ERROR CRÍTICO: MONGO_URI no cargada. Revisa tu archivo .env.");
    console.error("Asegúrate de que la URI esté en el .env y que no tenga espacios al inicio.");
    process.exit(1); // Detiene el proceso para que no falle al intentar conectarse
}

mongoose.connect(DB_URI)
    .then(() => console.log('✅ Conexión a MongoDB Atlas exitosa.'))
    .catch(err => {
        console.error('❌ Error de conexión a MongoDB:', err.message);
        // Si el error es de conexión de red (p. ej., el Access List no está activo)
        process.exit(1);
    });

// ----------------------------------------------------

// Middleware y Configuración CORS
// ⚠️ ¡REEMPLAZA ESTA URL CON LA QUE COPIASTE DE NETLIFY!
const NETLIFY_FRONTEND_URL = 'https://mi-tienda-de-perfumes.netlify.app'; 

app.use(cors({ 
    origin: [NETLIFY_FRONTEND_URL, 'http://localhost:5173'], 
    credentials: true 
}));
app.use(express.json());

// Uso de Rutas
app.use('/api/auth', authRoutes);
app.use('/api', productRoutes); 

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor Express corriendo en el puerto ${PORT}`);
});