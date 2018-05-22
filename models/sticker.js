const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stickerSchema = new Schema({
    title: String,
    description: String,
    price: String,
    category: String,
    imageUrl: String
});

const ModelClass = mongoose.model('sticker', stickerSchema)

module.exports = ModelClass;


