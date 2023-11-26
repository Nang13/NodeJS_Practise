'use strict'

const express = require('express')
const productController = require('../../controllers/product.controller')
const router = express.Router()
const { asyncHandler } = require('../../helpers/asyncHandler')
const {  authenticationV2} = require('../../auth/authUtils')


//authentication 
router.use(authenticationV2);

//////
router.post('/create', asyncHandler(productController.createProduct))

module.exports = router 