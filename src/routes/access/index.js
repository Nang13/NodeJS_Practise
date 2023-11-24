'use strict'

 const express = require('express')
 const accessController = require('../../controllers/access.controller')
 const router = express.Router()
 const  {asyncHandler} = require('../../auth/checkAuth')
 //sign Up

 router.post('/shops/signup' ,asyncHandler(accessController.signUp))
 router.post('/shops/login' ,asyncHandler(accessController.login))
 

 module.exports = router 