// backend/routes/productRoutes.js (REVISADO Y CONFIRMADO)
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Asegúrate que la ruta a tu middleware sea correcta
const fs = require('fs/promises');
const path = require('path');

// Definición de la ruta al archivo JSON
const PRODUCTS_FILE = path.join(__dirname, '..', 'data', 'productos.json');

// --- Funciones de Utilidad para Leer/Escribir ---\r\n
const readProducts = async () => {
    try {
        const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

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
router.post('/admin/productos', auth, async (req, res) => { // Protegida con 'auth'
    try {
        const products = await readProducts();
        
        // Lógica para asignar nuevo ID
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        
        // Lógica para formatear notas
        const notesArray = typeof req.body.notes === 'string' ? req.body.notes.split(/[\s,]+/).filter(Boolean) : [];

        // Crear el nuevo producto
        const newProduct = {
            id: newId,
            ...req.body,
            price: Number(req.body.price),
            stock: Number(req.body.stock),
            notes: notesArray, 
            createdAt: new Date().toISOString()
        };

        products.push(newProduct);
        await writeProducts(products);
        res.status(201).json(newProduct);

    } catch (error) {
        console.error('Error al crear el producto:', error);
        res.status(500).json({ message: 'Error interno del servidor al guardar el producto.' });
    }
});

// PUT /api/admin/productos/:id -> Actualizar un producto existente
router.put('/admin/productos/:id', auth, async (req, res) => { // Protegida con 'auth'
    const products = await readProducts();
    const id = parseInt(req.params.id);
    const index = products.findIndex(p => p.id === id);

    if (index === -1) return res.status(404).json({ message: 'Producto no encontrado' });
    
    let updatedData = { ...req.body };
    
    // Asegura que los campos numéricos y las notas se manejen correctamente
    if (updatedData.price) updatedData.price = Number(updatedData.price);
    if (updatedData.stock) updatedData.stock = Number(updatedData.stock);
    if (updatedData.notes && typeof updatedData.notes === 'string') {
        updatedData.notes = updatedData.notes.split(/[\s,]+/).filter(Boolean);
    }
    
    products[index] = { ...products[index], ...updatedData, id: id };
    
    await writeProducts(products);
    res.json(products[index]);
});

// DELETE /api/admin/productos/:id -> Eliminar un producto
router.delete('/admin/productos/:id', auth, async (req, res) => { // Protegida con 'auth'
    let products = await readProducts();
    const id = parseInt(req.params.id);
    
    const initialLength = products.length;
    products = products.filter(p => p.id !== id);

    if (products.length === initialLength) {
        return res.status(404).json({ message: 'Producto no encontrado.' });
    }
    
    await writeProducts(products);
    res.json({ message: 'Producto eliminado con éxito.' });
});

module.exports = router;