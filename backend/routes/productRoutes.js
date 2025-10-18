// backend/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); 
const fs = require('fs/promises'); // Importa el módulo de promesas de File System
const path = require('path');

// Definición de la ruta al archivo JSON
const PRODUCTS_FILE = path.join(__dirname, '..', 'data', 'productos.json');

// --- Funciones de Utilidad para Leer/Escribir ---

// Lee el archivo JSON y lo convierte en un array de JS
const readProducts = async () => {
    try {
        const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // Si el archivo no existe o está vacío, retorna un array vacío
        return [];
    }
};

// Escribe el array de JS de vuelta al archivo JSON
const writeProducts = async (products) => {
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
};

// ------------------------------------------------

// RUTAS PÚBLICAS (Cliente)
router.get('/productos', async (req, res) => {
    const products = await readProducts();
    res.json(products);
});

// RUTAS PROTEGIDAS (Admin)

// POST /api/admin/productos -> Crear un nuevo producto
router.post('/admin/productos', auth, async (req, res) => {
    const products = await readProducts();
    const { name, notes, description, price } = req.body;
    
    // Calcula el ID, tomando el máximo ID actual + 1
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;

    const newProduct = { id: newId, name, notes, description, price: Number(price) };
    products.push(newProduct);
    
    await writeProducts(products); // Guarda el nuevo array en el archivo
    res.status(201).json(newProduct);
});

// PUT /api/admin/productos/:id -> Actualizar un producto existente
router.put('/admin/productos/:id', auth, async (req, res) => {
    const products = await readProducts();
    const id = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === id);

    if (index === -1) return res.status(404).json({ message: 'Producto no encontrado' });
    
    products[index] = { ...products[index], ...req.body, id: id };
    
    await writeProducts(products); // Guarda la actualización
    res.json(products[index]);
});

// DELETE /api/admin/productos/:id -> Eliminar un producto
router.delete('/admin/productos/:id', auth, async (req, res) => {
    let products = await readProducts();
    const id = parseInt(req.params.id);
    
    const initialLength = products.length;
    products = products.filter(p => p.id !== id);

    if (products.length < initialLength) {
        await writeProducts(products); // Guarda el array filtrado
        return res.status(204).send();
    }
    
    res.status(404).json({ message: 'Producto no encontrado' });
});

module.exports = router;