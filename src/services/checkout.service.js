'use strict'

const { BadRequestError } = require("../core/error.response")
const { findCartById, CheckProductByServer } = require("../models/repository/cart.repo")
const { getDiscountAmount } = require("./discount.service")

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
}



module.exports = CheckoutService