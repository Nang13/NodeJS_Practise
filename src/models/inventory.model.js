'use strict'

const { Schema, model } = require('mongoose'); // Erase if already required
const { convertToTypes } = require('../utils');
const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories'
// Declare the Schema of the Mongo model
var InventoriesSchema = new Schema({
    inven_productID: { type: Schema.Types.ObjectId, ref: 'Product' },
    inven_location: { type: String, default: 'unKnow' },
    inven_stock: { type: Number, required: true },
    inven_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
    inven_reservations: { type: Array, default: [] }
    /**
     * cartID 
     * stock : 1,
     * createOn
     */
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

const reservationInventory = async ({ productId, quantity, cartId }) => {
    const query = {
        inven_productID: convertToTypes(productId),
        inven_stock: { $gte: quantity }
    }
    const updateSet = {
        $inc: {
            inven_stock: -quantity
        },
        $push: {
            inven_reservations: {
                quantity,
                cartId,
                createOn: new Date()
            }
        }
    }

    const options = { upsert: true, new: true }
    return await this.inventory.findOneAndUpdate(query, updateSet, options)
}

//Export the model
module.exports = {
    inventory: model(DOCUMENT_NAME, InventoriesSchema)
};