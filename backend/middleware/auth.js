const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    // 1. Obtener el token del header (formato: "Bearer <token>")
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Acceso denegado. Formato de token inválido o faltante.' });
    }
    
    const token = authHeader.replace('Bearer ', '');

    try {
        // 2. Verificar y decodificar el token con la clave secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Adjuntar info del usuario (e.g., role: 'admin')
        
        // Opcional: Verificar el rol explícitamente (si tu app tuviera más roles)
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Prohibido. No tienes permisos de administrador.' });
        }
        
        // 3. Token válido, continuar con la ruta
        next();

    } catch (error) {
        // Captura errores de expiración, token malformado o clave incorrecta
        res.status(401).json({ message: 'Token inválido o expirado.' });
    }
};

module.exports = auth;