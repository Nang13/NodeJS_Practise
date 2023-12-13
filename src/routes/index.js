'use strict'
const  express = require('express')
const {   apiKey, permission } = require('../auth/checkAuth')
const router = express.Router()

//check API Key
router.use(apiKey)
// check permissions
router.use(permission('0000'))

router.use('/v1/api/products',require('./product'))
router.use('/v1/api/carts',require('./cart'))
router.use('/v1/api/discounts',require('./discount'))
router.use('/v1/api',require('./access'))


module.exports = router