'use strict'

const express = require('express')
const productController = require('../../controllers/product.controller')
const router = express.Router()
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')

router.get("/search/:keySearch", asyncHandler(productController.searchProduct))
router.get("/", asyncHandler(productController.findAllProducts))
router.get("/:product_id", asyncHandler(productController.findProduct))

//authentication 
router.use(authenticationV2);

//////
router.post('/create', asyncHandler(productController.createProduct))
router.patch('/:productId', asyncHandler(productController.updateProduct))

//? Query 
router.post('/publish/:id', asyncHandler(productController.publishProduct))
router.post('/unpublish/:id', asyncHandler(productController.unPublishProduct))
router.get("/draft/all", asyncHandler(productController.getAllDraftShop))
router.get("/publish/all", asyncHandler(productController.getAllPublishShop))
module.exports = router 