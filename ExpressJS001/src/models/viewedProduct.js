const mongoose = require('mongoose');

const viewedProductSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    viewedAt: { type: Date, default: Date.now }
});

viewedProductSchema.index({ user: 1, viewedAt: -1 });

module.exports = mongoose.model('ViewedProduct', viewedProductSchema);