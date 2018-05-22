const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    orderNumber: String,
    description: String,
    price: String,
    category: String,
    imageUrl: String
});

const ModelClass = mongoose.model('sticker', stickerSchema)

module.exports = ModelClass;


