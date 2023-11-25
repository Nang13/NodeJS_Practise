'use strict'

const AccessService = require('../services/access.service')
const { CREATED, OK, SuccessResponse } = require('../core/success.response')
class AccessController {

      handlerRefreshToken = async (req, res, next) => {
            //*Version 1
            // new SuccessResponse({
            //       message: 'Get Token Success!',
            //       metadata: await AccessService.handlerRefreshToken( req.body.refreshToken )
            // }).send(res)
            //*Version 2 with out access token 
            new SuccessResponse({
                  message: 'Get Token Success!',
                  metadata: await AccessService.handlerRefreshTokenV2( {
                        refreshToken : req.refreshToken,
                        user : req.user,
                        keyStore : req.keyStore
                  } )
            }).send(res)
      }


      login = async (req, res, next) => {
            new SuccessResponse({
                  metadata: await AccessService.login(req.body)
            }).send(res)
      }


      logout = async (req, res, next) => {
            console.log(req.keyStore)
            new SuccessResponse({
                  message: 'Logout success',
                  metadata: await AccessService.logout(req.keyStore)
            }).send(res)
      }
      signUp = async (req, res, next) => {
            new CREATED({
                  message: 'Registered Ok:',
                  metadata: await AccessService.signUp(req.body),
                  options: {
                        limit: 10
                  }
            }).send(res)
      }
}


module.exports = new AccessController()