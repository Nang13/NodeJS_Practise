'use strict'

const { cart } = require("../models/cart.model")

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
}