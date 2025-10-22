// backend/routes/productRoutes.js (¡MIGRADO A MONGOOSE!)
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Middleware para proteger rutas
// ⚠️ IMPORTAMOS EL MODELO DE MONGOOSE
const Product = require('../models/Product'); 

// ------------------------------------------------
// --- RUTAS PÚBLICAS (Cliente) ---
// ------------------------------------------------

// GET /api/productos -> Obtener todos los productos
router.get('/productos', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (error) {
        console.error('❌ Error al obtener productos de MongoDB:', error);
        res.status(500).json({ message: 'Error interno del servidor al cargar el catálogo.' });
    }
});

// GET /api/productos/:id -> Obtener un producto por ID
router.get('/productos/:id', async (req, res) => {
    try {
        // En tu frontend ProductForm.jsx usa el _id de MongoDB para la edición
        const product = await Product.findById(req.params.id); 
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }
        res.json(product);
    } catch (error) {
        console.error('❌ Error al obtener producto por ID:', error);
        res.status(400).json({ message: 'Formato de ID inválido.' }); 
    }
});


// ------------------------------------------------
// --- RUTAS PROTEGIDAS (Admin) ---
// ------------------------------------------------

// POST /api/admin/productos -> Crear un nuevo producto
router.post('/admin/productos', auth, async (req, res) => {
    try {
        const { name, price, image, stock, notes, description } = req.body;
        
        // El frontend ya envía las notas como un array de strings si se siguen las instrucciones de ProductForm
        const notesArray = Array.isArray(notes) ? notes : notes.split(/[\s,]+/).filter(Boolean);

        const newProduct = new Product({
            name,
            price: Number(price),
            image,
            stock: Number(stock),
            notes: notesArray,
            description,
        });

        const savedProduct = await newProduct.save(); // Guarda en MongoDB Atlas
        res.status(201).json(savedProduct);

    } catch (error) {
        console.error('❌ Error al crear el producto en MongoDB:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Error de validación: Revise los campos requeridos.' });
        }
        if (error.code === 11000) { // Error de índice único (nombre duplicado)
            return res.status(400).json({ message: 'Ya existe un producto con este nombre.' });
        }
        res.status(500).json({ message: 'Error interno del servidor al crear producto.' });
    }
});

// PUT /api/admin/productos/:id -> Actualizar un producto existente
router.put('/admin/productos/:id', auth, async (req, res) => {
    try {
        const updateData = {
            price: Number(req.body.price),
            stock: Number(req.body.stock),
            // Los demás campos (name, image, notes, description) se mantienen fijos según tu ProductForm.jsx
        };

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id, 
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }
        
        res.json(updatedProduct);
        
    } catch (error) {
        console.error('❌ Error al actualizar producto:', error);
        res.status(500).json({ message: 'Error interno del servidor al actualizar producto.' });
    }
});

// DELETE /api/admin/productos/:id -> Eliminar un producto
router.delete('/admin/productos/:id', auth, async (req, res) => {
    try {
        const result = await Product.findByIdAndDelete(req.params.id);

        if (!result) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }
        
        res.status(204).send(); 
        
    } catch (error) {
        console.error('❌ Error al eliminar producto:', error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar producto.' });
    }
});

module.exports = router;