'use strict'

const { Schema, model } = require('mongoose'); // Erase if already required
const slugify = require("slugify")
const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products'


const productSchema = new Schema({
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_slug: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: { type: String, required: true, enum: ['Electronics', 'Clothing', 'Furnitures'] },
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, required: true },
    product_ratingAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be  above 1.0'],
        max: [5, 'Rating must be  above 5.0'],
        set: (val) => Math.round(val * 10) / 10
    },
    product_variations: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})


//?Create index for search 
productSchema.index({ product_name: 'text', product_description: 'text' })

//? Document middleware: runs before .save()  or .create()...
productSchema.pre('save', function (next) {
    this.product_slug = slugify(this.product_name, { lower: true })
    next();
})

//* Define the product type = clothing

const clothingSchema = new Schema({
    brand: { type: String, require: true },
    size: String,
    material: String,

}, {
    collection: 'clothes',
    timestamps: true
})
//* Define the product type = electronics

const electronicsSchema = new Schema({
    manufacturer: { type: String, require: true },
    model: String,
    color: String,

}, {
    collection: 'electronics',
    timestamps: true
})
//* Define the product type = electronics

const furnitureSchema = new Schema({
    brand: { type: String, require: true },
    size: String,
    material: String,

}, {
    collection: 'electronics',
    timestamps: true
})

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    electronics: model('Electronics', electronicsSchema),
    clothings: model('Clothing', clothingSchema),
    furnitures: model('Furniture', furnitureSchema),
}