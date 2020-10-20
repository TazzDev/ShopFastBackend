const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    productId: Number,
    name: String,
    description: String,
    category: String,
    available: Boolean,
})

module.exports = mongoose.model('Product',productSchema)