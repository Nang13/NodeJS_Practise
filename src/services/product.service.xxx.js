'use strict '

const { product, clothings, electronics, furnitures } = require('../models/product.model')
const { BadRequestError } = require('../core/error.response')
const {
    findAllDraftForShop,
    findAllPublishedForShop,
    publishProductByShop,
    unPublishProductByShop,
    searchProduct,
    findAllProduct,
    findProduct,
    updateProductById
} = require('../models/repository/product.repo')
const { removeUndefinedObject, updateNestedObjectParser } = require('../utils')
const { insertInventory } = require('../models/repository/inventory.repo')
//? Define the Factory Class  to create product 
class ProductFactory {
    /**
     * type : 'Clothing'
     * payload
     */
    static productRegistry = {}

    static registerProductTye(type, classRef) {
        ProductFactory.productRegistry[type] = classRef
    }

    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) throw new BadRequestError(`Invalid Product Type ${type}`)

        return new productClass(payload).createProduct()
    }
    static async updateProduct(type, productId, payload) {
        const productClass = ProductFactory.productRegistry[type];
        if (!productClass) throw new BadRequestError(`Invalid Product Type ${type}`)

        return new productClass(payload).updateProduct(productId)
    }
    // static async createProduct(type, payload) {
    //     console.log(payload)
    //     switch (type) {
    //         case 'Electronics':
    //             return new Electronics(payload).createProduct()
    //         case 'Clothing':
    //             return new Clothing(payload).createProduct()
    //         default: throw new BadRequestError(`Invalid Product Type ${type}`)
    //     }
    // }

    static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }
        return await findAllDraftForShop({ query, limit, skip })
    }
    static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true }
        return await findAllPublishedForShop({ query, limit, skip })
    }

    //? Put
    static async publishProductByShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id })
    }

    static async unPublishProductByShop({ product_shop, product_id }) {
        return await unPublishProductByShop({ product_shop, product_id })
    }

    static async searchProduct({ keySearch }) {
        return await searchProduct({ keySearch })
    }

    static async findAllProduct({ limit = 50, sort = 'ctime', page = 1, filter = { isPublished: true } }) {
        return await findAllProduct({ limit, sort, filter, page, select: ['product_name', 'product_price', 'product_thumb'] })

    }
    static async findProduct({ product_id }) {

        return await findProduct({ product_id, unSelect: ['__v', 'product_variations'] })
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

    async createProduct(product_id) {
        const newProduct = await product.create({ ...this, _id: product_id })
        if (newProduct) {
            //? add product_stock in inventory collection
            await insertInventory({
                productId: newProduct._id,
                shopId: this.product_shop,
                stock: this.product_quantity
            })
        }
        return newProduct;
    }

    async updateProduct(productId, bodyUpdate) {
        return await updateProductById({ productId, bodyUpdate, model: product })
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
    async updateProduct(productId) {

        //? không lấy giá trị null hoặc undefined
        //* 1. remove attr has null or undefined
        // const objectParams = removeUndefinedObject(this)
        const objectParams = removeUndefinedObject(this)
        //* 2. check xem update o cho nao ? 
        console.log(`Check product`, objectParams.product_attributes)
        if (objectParams.product_attributes) {
            //* Update Child
            await updateProductById({
                productId,
                bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
                model: clothings
            })
        }
        const updateProduct = await super.updateProduct(productId, updateNestedObjectParser(objectParams))
        return updateProduct

    }

}
//? Define sub-class for different product types Clothing 
class Electronics extends Product {
    async createProduct() {
        const newElectronics = await electronics.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newElectronics) throw new BadRequestError('Create new Clothing error')

        const newProduct = await super.createProduct(newElectronics._id)
        if (!newProduct) throw new BadRequestError('Create new Clothing error')


        return newProduct
    }
}
//? Define sub-class for different product types Furniture 
class Furnitures extends Product {
    async createProduct() {
        const newFurniture = await furnitures.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newFurniture) throw new BadRequestError('Create new Clothing error')

        const newProduct = await super.createProduct(newFurniture._id)
        if (!newProduct) throw new BadRequestError('Create new Clothing error')


        return newProduct
    }
}


ProductFactory.registerProductTye('Electronic', Electronics)
ProductFactory.registerProductTye('Clothing', Clothing)
ProductFactory.registerProductTye('Furniture', Furnitures)
module.exports = ProductFactory;