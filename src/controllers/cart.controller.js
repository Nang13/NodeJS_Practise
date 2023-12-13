'use strict'
const CartService = require('../services/cart.service')
const { SuccessResponse } = require('../core/success.response')

class CartController {

    createCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create Cart Successfully',
            metadata: await CartService.AddToCart(req.body)
        }).send(res)
    }

    updateCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update Cart Successfully',
            metadata: await CartService.addToCartV2(req.body)
        }).send(res)
    }


    deleteCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete Cart Successfully',
            metadata: await CartService.deleteCart(req.body)
        }).send(res)
    }

    getCart = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get Cart Successfully',
            metadata: await CartService.getListCart(req.query)
        }).send(res)
    }

}

module.exports = new CartController()