'use strict'

const { Schema, model } = require('mongoose'); // Erase if already required
const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'Carts'
// Declare the Schema of the Mongo model
var CartSchema = new Schema({

    cart_state: {
        type: String, required: true,
        enum: ['active', 'completed', 'failed', 'pending'],
        default: true
    },
    cart_products: { type: Array, required: true, default: [] },
    cart_count_product: { type: Number, default: 0 },
    cart_userId: { type: Number, required: true }

}, {
    collection: COLLECTION_NAME,
    timestamps: {
        createdAt: 'createdOn',
        updatedAt: 'modifiedOn'
    }
});

//Export the model
module.exports = {
    cart: model(DOCUMENT_NAME, CartSchema)
};