// backend/routes/auth.routes.js (CORREGIDO)
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // VALIDACIÓN (SIMULADA SIN BASE DE DATOS)
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD; 

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
        return res.status(401).json({ message: 'Credenciales inválidas.' });
    }

    // Generar el Token JWT
    const token = jwt.sign(
        { id: 1, role: 'admin' }, 
        process.env.JWT_SECRET // ¡YA NO HAY OPCIÓN DE EXPIRACIÓN!
    );

    // 💡 NOTA: Asegúrate de que process.env.JWT_SECRET sea la MISMA clave que usas en el middleware de autenticación.

    res.json({ token, role: 'admin', message: 'Inicio de sesión exitoso.' });
});

module.exports = router;