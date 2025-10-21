// backend/controllers/productos.controller.js

const fs = require('fs/promises');
const path = require('path');

// Ruta al archivo JSON de productos
const productosFilePath = path.join(__dirname, '..', 'data', 'productos.json');

// Función para generar un ID simple (solo para este ejemplo)
const generateId = (products) => {
    const maxId = products.reduce((max, product) => Math.max(max, product.id || 0), 0);
    return maxId + 1;
};

// --- FUNCIÓN PARA AGREGAR NUEVO PRODUCTO (POST /api/productos) ---
const addProduct = async (req, res) => {
    try {
        const newProduct = req.body;

        // Leer los productos existentes
        const data = await fs.readFile(productosFilePath, 'utf-8');
        const products = JSON.parse(data);

        // Generar un nuevo ID
        const finalProduct = {
            id: generateId(products), 
            ...newProduct,
            // Asegurar que el timestamp de creación esté presente
            createdAt: new Date().toISOString(), 
        };

        // Agregar el nuevo producto
        products.push(finalProduct);

        // Escribir el arreglo actualizado de vuelta al archivo
        await fs.writeFile(productosFilePath, JSON.stringify(products, null, 2));

        // Respuesta exitosa
        res.status(201).json(finalProduct);

    } catch (error) {
        console.error('Error al agregar el producto:', error);
        res.status(500).json({ message: 'Error interno del servidor al guardar el producto.' });
    }
};

// ... exporta otras funciones como getAllProducts, etc.
module.exports = {
    addProduct,
    // ...
};