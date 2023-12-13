'use strict'
const express = require('express')
const discountController = require('../../controllers/discount.controller')
const router = express.Router()
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')

//? get amount a discount 
router.get('/amount', asyncHandler(discountController.getAllDiscountAmount))
router.get('/list_product_code', asyncHandler(discountController.getAllDiscountWithProducts))


router.use(authenticationV2)

router.get('', asyncHandler(discountController.getAllDiscountCodes))
router.patch('/update/:discountId', asyncHandler(discountController.updateDiscount))
router.post('/create', asyncHandler(discountController.createDiscountCode))

module.exports = router