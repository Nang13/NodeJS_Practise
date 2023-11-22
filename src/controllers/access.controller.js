'use strict'

const AccessService = require('../services/access.service')
const { CREATED, OK } = require('../core/success.response')
class AccessController {
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