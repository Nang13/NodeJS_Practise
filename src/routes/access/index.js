'use strict'

const express = require('express')
const accessController = require('../../controllers/access.controller')
const router = express.Router()
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authentication ,authenticationV2} = require('../../auth/authUtils')
//sign Up

router.post('/shops/signup', asyncHandler(accessController.signUp))
router.post('/shops/login', asyncHandler(accessController.login))

//authentication 
router.use(authenticationV2)

//////
router.post('/shops/logout', asyncHandler(accessController.logout))
router.post('/shops/handlerRefreshToken', asyncHandler(accessController.handlerRefreshToken))

module.exports = router 