'use strict'
const ProductService = require('../services/product.service')
const ProductServiceV2 = require('../services/product.service.xxx')
const { SuccessResponse } = require('../core/success.response')

class ProductController {


    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new Product success',
            metadata: await ProductServiceV2.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }
    //? Update Product 
    updateProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update Product success',
            metadata: await ProductServiceV2.updateProduct(req.body.product_type, req.params.productId, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    searchProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Search Product success',
            metadata: await ProductServiceV2.searchProduct(req.params)
        }).send(res)
    }


    publishProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Publish Product  successfully',
            metadata: await ProductServiceV2.publishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    unPublishProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Publish Product  successfully',
            metadata: await ProductServiceV2.unPublishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }
    /**
     * 
     * @param {string} lim 
     * @param {Number} skip 
     * @param {*} next 
     */
    getAllDraftShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list success',
            metadata: await ProductServiceV2.findAllDraftForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }


    getAllPublishShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get list success',
            metadata: await ProductServiceV2.findAllPublishForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    findAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get findAllProducts success',
            metadata: await ProductServiceV2.findAllProduct(req.query)
        }).send(res)
    }

    findProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get findProduct success',
            metadata: await ProductServiceV2.findProduct({
                product_id: req.params.product_id
            })
        }).send(res)
    }
}

module.exports = new ProductController();