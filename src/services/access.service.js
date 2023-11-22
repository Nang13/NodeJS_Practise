'use strict'

const shopModels = require("../models/shop.models")
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const { getIntoData } = require("../utils")
const { BadRequestError } = require("../core/error.response")
const roleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {

    static signUp = async ({ name, email, password }) => {
        try {

            //? Step 1 

            const holderShop = await shopModels.findOne({ email }).lean()

            if (holderShop) {
                throw new BadRequestError('Error: Shop already registered')
            }
            const passwordHash = await bcrypt.hash(password, 10)
            const newShop = await shopModels.create({ name, email, password: passwordHash, roles: [roleShop.SHOP] })

            if (newShop) {
                // * created private Key 
                /*
                 *private key : để cho người dùng ,không lưu trong hệ thống của chúng ta ,dùng để sai token 
                 *public key : lưu vào hệ thống của chúng ta, dùng để verify token
                 *context : khi hacker xâm nhập vào hệ thống của chúng ta nó chỉ lấy được public key, nhưng không thể sai token, mà nó chỉ có verify token 
                 * phải biết được cả 2 hai nên xác suất khá là hiếm 
                 */
                // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                //     modulusLength: 4096,
                //     publicKeyEncoding : {
                //         type : 'pkcs1',
                //         format : 'pem'
                //     },
                //     privateKeyEncoding :{
                //         type : 'pkcs1',
                //         format : 'pem'
                //     }
                // })

                const privateKey = crypto.randomBytes(64).toString('hex');
                const publicKey = crypto.randomBytes(64).toString('hex');

                console.log({ privateKey, publicKey }) //* Save to collection KeyStore 
                const KeyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                })


                if (!KeyStore) {
                    return {
                        code: 'xxx',
                        message: 'publicKeyString token'
                    }
                }

                //const publicKeyObject = crypto.createPublicKey(publicKeyString)
                //? Created token pair 
                const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
                console.log(`Create Token Success :: `, tokens);
                return {
                    code: 201,
                    metadata: {
                        shop: getIntoData({ fields: ['_id', 'name', 'email'], object: newShop }),
                        tokens
                    }
                }
            }
        } catch (error) {
            return {
                code: '413',
                message: error.message,
                status: 'error'
            }

        }
    }

}


module.exports = AccessService