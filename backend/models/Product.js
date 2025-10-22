// backend/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true 
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    image: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    // Las notas se guardarán como un Array de Strings
    notes: {
        type: [String], 
        required: true
    },
    description: {
        type: String,
        required: true
    },
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;