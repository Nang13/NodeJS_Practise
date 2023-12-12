'use strict'
const { BadRequestError, NotFoundError } = require('../core/error.response')
const discount = require('../models/discount.model')
const { product } = require('../models/product.model')
const { convertToTypes } = require('../utils')
const { findAllProduct } = require('../models/repository/product.repo')
const { findAllDiscountCodeUnSelect } = require('../models/repository/discount.repo')
/***
 * * Discount Service 
 * TODO : Generator discount code [Shop | Admin]
 * TODO : Get Discount Amount  [User]
 * TODO : Get All Discount Codes [User | Shop   ]
 * TODO : Verify Discount Code  [User | Shop   ]
 * TODO : Delete Discount Code  [Admin| Shop   ]
 * TODO : Cancel  Discount Code  [User  ]
 *
 */



class DiscountService {

    static async createDiscountCode(payload) {
        const {
            code, start_date, end_date, is_active, shopId, minOrder, product_ids, applies_to, name, description,
            type, value, max_value, max_uses, uses_count, max_uses_per_user
        } = payload
        //? check value 
        //* Viết handle service có thể dùng builder Pattern 
        if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
            throw new BadRequestError('Discount code has expired!')
        }


        if (new Date(start_date) >= new Date(end_date)) {
            throw new BadRequestError('Start date must before end Date  !')
        }
        //? create index for discount code 
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToTypes(shopId)
        }).lean()

        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError("This discount have been existed ")
        }

        const newDiscount = await discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_code: code,
            discount_value: value,
            discount_min_order_value: minOrder || 0,
            discount_max_value: max_value,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_users: max_uses,
            discount_use_count: uses_count,
            discount_users_used: users_used,
            discount_max_uses_per_user: max_uses_per_user,
            discount_shopId: shopId,
            discount_is_active: is_active,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === 'all' ? [] : product_ids
        })

        return newDiscount

    }

    static async updateDiscount() {
        //? do by myself
    }

    //? Get All discounts codes available with products
    static async getAllDiscountCodesWithProduct({
        code, shopId, userId, limit, page
    }) {
        //* create index for discount_code 
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToTypes(shopId)
        }).lean();

        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new NotFoundError('Discount not exits')
        }
        const { discount_applies_to, discount_product_ids } = foundDiscount
        if (discount_applies_to === 'specific ') {
            product = await findAllProduct({
                filter: {
                    product_shop: convertToTypes(shopId),
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }


        if (discount_applies_to === 'all ') {
            product = await findAllProduct({
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                sort: ['product_name']
            })
        }
    }


    static async getAllDiscountCodesByShop({
        limit, page, shopId
    }) {
        const discounts = await findAllDiscountCodeUnSelect({
            limit: +limit,
            page: +page,
            filter: {
                discount_shopId: convertToTypes(shopId),
                discount_is_active: true
            },
            unSelect: ['__v', 'discount_shopId'],
            model : discount
        })


        return discounts;
    }
}