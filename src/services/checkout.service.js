'use strict'

const { BadRequestError } = require("../core/error.response")
const { order } = require("../models/order.model")
const { findCartById, CheckProductByServer } = require("../models/repository/cart.repo")
const { getDiscountAmount } = require("./discount.service")
const { acquireLock, releaseLock } = require("./redis.service")

/**
 * * Order Service
 * todo : create new order [user]
 * todo : query orders [user]
 * todo : query order using it's ID [user]
 * todo : cancel order[user]
 * todo : update order status [admin]
 */

class CheckoutService {

    /**
     * {
     * cartId 
     * userId 
     * shop_order_ids :[
     * {
     * item_products :[{
     * price ,
     * quantity ,
     * productId}]
     * }
     * ]
     * }
     * @param {*} param0 
     */
    static async checkoutReview({ cartId, userId, shop_order_ids }) {

        //? check cartId ton tai khong 
        const foundCart = await findCartById(cartId)
        if (!foundCart) throw new BadRequestError('Not Fount this cart')

        const checkout_order = {
            totalPrice: 0,/// tong tien hang
            feeShip: 0,
            totalDiscount: 0,//? tong tien discount 
            totalCheckout: 0, //? tong thanh toan

        }, shop_order_ids_new = []


        for (let i = 0; i < shop_order_ids.length; i++) {
            const { shopId, shop_discounts = [], items_product = [] } = shop_order_ids[i]
            const checkProductServer = await CheckProductByServer(items_product)
            console.log(checkProductServer)
            if (!checkProductServer[0]) throw new BadRequestError('order wrong ????')
            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            //? Tong tien truoc khi xu ly 
            checkout_order.totalPrice = + checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice,//? tien truoc khi giam gia
                priceApplyDiscount: checkoutPrice,
                items_product: checkProductServer

            }


            //? neu shop_discount lon hon khong thi co hop le hay khoong
            if (shop_discounts.length > 0) {
                //gia su chi co mot discount 
                //get amount discount 
                const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
                    codeId: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products: checkProductServer
                })

                checkout_order.totalDiscount += discount

                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }

            //thanh toan cuoi cung 
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount
            shop_order_ids_new.push(itemCheckout)
        }
        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }


    }
    static async orderByUser({
        shop_order_ids,
        cartId,
        userId,
        user_address = {},
        user_payment = {}
    }) {

        const { shop_order_ids_new, checkout_order } = await CheckoutService.checkoutReview({
            cartId,
            userId,
            shop_order_ids,
        })

        //? check again if overate the quantity in the storage 
        const products = shop_order_ids_new.flatMap(order => order.items_product)
        console.log(products)
        const acquireProduct = []
        // khóa lạc quan : chặn luồn đi của nhiều luồng 
        for (let i = 0; i < products.length; i++) {
            const { productId, quantity } = products[i];
            const keyLock = await acquireLock(productId, quantity, cartId)
            acquireProduct.push(keyLock ? true : false)
            if (keyLock) {
                await releaseLock(keyLock)
            }
        }

        //check if the product  don't have any in the inventory
        if (acquireProduct.includes(false)) {
            throw new BadRequestError(`Mot so san pham duoc cap nhat , hay quay lai gio hang`)
        }
        const newOrder = await order.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new
        })
        //? neu insert thanh cong thi remove product trong gio hang cua chung ta 
        if (newOrder) {
            //remove product in my cart k

        }
        return newOrder
    }

    //? Query Order [Users]
    static async getOrdersByUser() {

    }

    //?Query Orders Using Id [Users]
    static async getOneOrderByUser() { }
    //?Cancel Order [Users]
    static async cancelOrderByUser() { }
    //?Update Order Status  [Shop / Admin]
    static async updateOrderStatusByShop() { }
}



module.exports = CheckoutService