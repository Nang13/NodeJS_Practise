'use strict'

const { NotFoundError } = require("../core/error.response")
const { cart } = require("../models/cart.model")
const { getProductById } = require("../models/repository/product.repo")

/**
 * * Cart Service
 * todo : add product to cart 
 * todo : reduce product quantity
 * todo : increase product quantity 
 * todo : get list to Cart
 * todo : delete cart 
 * todo : delete cart item 
 */
class CartService {

    //? start repo cart 
    static async createUserCart({ userId, product }) {
        const query = { cart_userId: userId, cart_state: 'active' },
            updateOrInsert = {
                $addToSet: {
                    cart_products: product
                }
            }, options = { upsert: true, new: true }

        return await cart.findOneAndUpdate(query, updateOrInsert, options)
    }
    static async updateQuantity({ userId, product }) {
        const { productId, quantity } = product
        const query = {
            cart_userId: userId,
            'cart_products.productId': productId,
            cart_state: 'active'
        },
            updateSet = {
                $inc: {
                    'cart_product.$.quantity': quantity
                }
            }, options = { upsert: true, new: true }

        return await cart.findOneAndUpdate(query, updateSet, options)
    }
    static async AddToCart({ userId, product = {} }) {
        //check cart is exist
        const userCart = await cart.findOne({
            cart_userId: userId
        })

        if (!userCart) {
            return await this.createUserCart({ userId, product })
        }

        //? if have a cart but don't have any items 
        if (!userCart.cart_products.length) {
            userCart.cart_products = [product]
            return await userCart.save();
        }
        //? if have a cart but don't have any items 
        return await CartService.updateQuantity({ userId, product })

    }

    //* Update To Cart 
    /**
     * shop_oder_ids : [
     * {
     * shopId, 
     * item_products :[
     * {
     * quantity, 
     * price ,
     * shopId,
     * old_quantity,
     * 
     * 
     * } 
     * ]
     * }
     * ]
     * @param {} param0 
     */
    static async addToCartV2({ userId, shop_order_ids }) {
        const { productId, quantity, old_quantity } = shop_order_ids[0]?.items_products[0]
        //? Check Product
        console.log(shop_order_ids)
        const foundProduct = await getProductById(productId)
        if (!foundProduct) throw new NotFoundError('Not Found Product');
        //? Compare ProductShop == shopId
        if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) throw new NotFoundError('Product not belong to this shop')

        if (quantity === 0) {

        }
        return await CartService.updateQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity
            }
        })


    }

    static async deleteCart({ userId, productId }) {
        const query = {
            cart_userId: userId, cart_state: 'active'
        },
            updateSet = {
                $pull: {
                    cart_products: {
                        productId
                    }
                }
            }
        const deleteCart = await cart.updateOne(query, updateSet);
        return deleteCart
    }

    static async getListCart({ userId }) {
        return await cart.findOne({
            cart_userId: +userId
        }).select()
    }
}

module.exports = CartService