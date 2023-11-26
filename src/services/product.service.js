'use strict '

const { product, clothings, electronics } = require('../models/product.model')
const { BadRequestError } = require('../core/error.response')

//? Define the Factory Class  to create product 
class ProductFactory {
    /**
     * type : 'Clothing'
     * payload
     */
    static async createProduct(type, payload) {
        switch (type) {
            case 'Electronics':
                return new Electronics(payload)
            case 'Clothing':
                console.log(payload)
                return new Clothing(payload).createProduct()
            default: throw new BadRequestError(`Invalid Product Type ${type}`)
        }
    }

}
/**
 *    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: { type: String, required: true, enum: ['Electronics', 'Clothing', 'Furniture'] },
    product_description: { type: Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, required: true },
 */

//? Define base product class 
class Product {
    constructor({ product_name, product_thumb, product_description, product_price, product_quantity, product_type, product_shop, product_attributes }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }

    async createProduct() {
        return await product.create(this)
    }
}

//? Define sub-class for different product types Clothing 
class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothings.create(this.product_attributes)
        if (!newClothing) throw new BadRequestError('Create new Clothing error')

        const newProduct = await super.createProduct()
        if (!newProduct) throw new BadRequestError('Create new Clothing error')


        return newProduct
    }
}
//? Define sub-class for different product types Clothing 
class Electronics extends Product{
    async createProduct() {
        const newClothing = await electronics.create(this.product_attributes)
        if (!newClothing) throw new BadRequestError('Create new Clothing error')

        const newProduct = await super.createProduct()
        if (!newProduct) throw new BadRequestError('Create new Clothing error')


        return newProduct
    }
}

module.exports = ProductFactory;