'use strict'

const shopModels = require("../models/shop.models")

const findByEmail = async ({ email, select = {
    email: 1, password: 2, name: 1, status: 1, roles: 1
} }) => {

    //email:1, password:2,name:1, status :1 ,roles : 1
    return await shopModels.findOne({ email }).select(select).lean()
}

module.exports = { findByEmail }