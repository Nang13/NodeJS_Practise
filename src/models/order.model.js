'use strict'

const { Schema, model } = require('mongoose'); // Erase if already required
const DOCUMENT_NAME = 'Order';
const COLLECTION_NAME = 'Orders'
// Declare the Schema of the Mongo model
var OrderSchema = new Schema({

    order_userId: { type: Number, required: true },
    order_checkout: { type: Object, default: {} },
    /**
     * total price , total apply , discount , feeDelivery
     */
    order_shipping: { type: Object, default: {} },
    /**
     * street ,city , country ,state
     */
    order_payment: { type: Object, default: {} },
    order_products: { type: Array, required: true },
    order_trackingNumber: { type: String, default: '#000011852022' },
    order_status: { type: String, enum: ['pending', 'shipped', 'canceled', 'confirmed', 'delivered'], default: 'pending' },
});

//Export the model
module.exports = {
    order: model(DOCUMENT_NAME, CartSchema)
};