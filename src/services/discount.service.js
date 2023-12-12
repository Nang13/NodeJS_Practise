'use strict'
const { BadRequestError, NotFoundError } = require('../core/error.response')
const discount = require('../models/discount.model')
const { product } = require('../models/product.model')
const { convertToTypes } = require('../utils')
const { findAllProduct } = require('../models/repository/product.repo')
const { findAllDiscountCodeUnSelect, checkDiscountExist } = require('../models/repository/discount.repo')
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
            name,
            description,
            type,
            value,
            max_value,
            code,
            start_date,
            end_date,
            max_uses,
            uses_count,
            users_used,
            max_uses_per_user,
            is_active,
            shopId,
            min_order_value,
            product_ids,
            applies_to,
        } = payload
        console.log(payload)
        //? check value 
        //* Viết handle service có thể dùng builder Pattern 
        // if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
        //     throw new BadRequestError('Discount code has expired!')
        // }


        // if (new Date(start_date) >= new Date(end_date)) {
        //     throw new BadRequestError('Start date must before end Date  !')
        // }
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
            discount_description: payload.description,
            discount_type: type,
            discount_code: code,
            discount_value: value,
            discount_min_order_value: min_order_value || 0,
            discount_max_value: max_value,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_uses: max_uses,
            discount_uses_count: uses_count,
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
        let product
        //* create index for discount_code 
        const foundDiscount = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToTypes(shopId)
        }).lean();

        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new NotFoundError('Discount not exits')
        }
        const { discount_applies_to, discount_product_ids } = foundDiscount
        if (discount_applies_to === 'all') {
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


        if (discount_applies_to === 'specific') {
            product = await findAllProduct({
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }
        return product
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
            model: discount
        })


        return discounts;
    }

    /**
     * TODO : Apply discount code product 
     * products = {
     * productId ,shopId ,quantity, name , price 
     * }
     * 
     */
    static async getDiscountAmount({ code, userId, shopId, products }) {
        const foundDiscount = await checkDiscountExist({
            model: discount,
            filter: {
                discount_code: code,
                discount_shopId: convertToTypes(shopId)
            }
        })

        if (!foundDiscount) {
            throw new NotFoundError('Discount does not exist')
        }

        const {
            discount_is_active,
            discount_max_uses,
            discount_start_date,
            discount_end_date,
            discount_min_order_value,
            discount_max_uses_per_user,
            discount_users_used,
            discount_value,
            discount_type,

        } = foundDiscount

        if (!discount_is_active) {
            throw new NotFoundError('Discount expired')
        }
        if (!discount_max_uses) {
            throw new NotFoundError('Discount are out ')
        }

        // if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
        //     throw new NotFoundError('Discount are out ')
        // }
        let totalOrder = 0;
        //? Check have set min value in order
        if (discount_min_order_value > 0) {
            totalOrder = products.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

        }

        if (totalOrder < discount_min_order_value) throw new NotFoundError('Discount requires a minium order value of ')
        if (discount_max_uses_per_user > 0) {
            const userUserDiscount = discount_users_used.find(user => user.userId === userId)
            if (userUserDiscount) {
                //? Nếu user sử dụng rồi thì sao với sử dụng 1 lần
            }

            //? Check discount is fix_amount hay ---
            const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)


            return {
                totalOrder,
                discount: amount,
                totalPrice: totalOrder - amount
            }
        }
    }

    //* Delete out of database 
    //? chuyen vao 1 database khac hai la chuyen trang thai
    //? truong hop phuc tap 
    /**
     * 
     * TODO : KIỂM TRA THỬ CÓ ĐANG ĐƯỢC SỬ DỤNG KHÔNG
     * TODO : 
     * @param {*} param0 
     */
    static async deleteDiscountCode({ shopId, codeId }) {
        const deleted = await discount.findOneAndDelete({
            discount_code: codeId,
            discount_shopId: convertToTypes(shopId)
        })
        return deleted
    }

    /**
     * todo : it have problem with discount can cancel
     * @param{}
     */
    static async cancelDiscountCode({ codeId, shopId, userId }) {
        const foundDiscount = await checkDiscountExist({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToTypes(shopId)
            }
        })

        if (!foundDiscount) {
            throw new NotFoundError('Not found the codeId ');
        }
        const result = await discount.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                discount_users_used: userId,
            },
            $inc: {
                discount_max_uses: 1,
                discount_use_count: -1
            }
        })

        return result
    }


}


module.exports = DiscountService