'use strict'
const express = require('express')
const cartController = require('../../controllers/cart.controller')
const router = express.Router()
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')


router.post('/create', asyncHandler(cartController.createCart))
router.delete('/delete', asyncHandler(cartController.deleteCart))
router.post('/update', asyncHandler(cartController.updateCart))
router.get('', asyncHandler(cartController.getCart))
// //? get amount a discount 
// router.get('/amount', asyncHandler(discountController.getAllDiscountAmount))
// router.get('/list_product_code', asyncHandler(discountController.getAllDiscountWithProducts))


// router.use(authenticationV2)

// router.get('', asyncHandler(discountController.getAllDiscountCodes))
// router.post('/create', asyncHandler(discountController.createDiscountCode))

module.exports = router