'use strict'

const { unGetSelectData , getSelectData} = require('../../utils/index')
const findAllDiscountCodeUnSelect = async ({ limit = 50, page = 1, sort = 'ctime', filter, unSelect, model }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const document = await model
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(unGetSelectData(unSelect))
        .lean()

    return document
}
const findAllDiscountCodeSelect = async ({ limit = 50, page = 1, sort = 'ctime', filter, Select, model }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const document = await model
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(getSelectData(Select))
        .lean()

    return document
}

module.exports = {
    findAllDiscountCodeUnSelect,
    findAllDiscountCodeSelect
}