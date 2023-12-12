'use strict'
const DiscountService = require('../services/discount.service')
const { SuccessResponse } = require('../core/success.response')


class DiscountController {

    createDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create Discount Successfully',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res)
    }


    getAllDiscountCodes = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create Discount Successfully',
            metadata: await DiscountService.getAllDiscountCodesByShop({
                ...req.body,
                shopId: req.user.userId
            })
        }).send(res)
    }


    getAllDiscountWithProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create Discount Successfully',
            metadata: await DiscountService.getAllDiscountCodesWithProduct({
                ...req.query,
            })
        }).send(res)
    }

    getAllDiscountAmount = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create Discount Successfully',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body,
            })
        }).send(res)
    }
}


module.exports = new DiscountController()