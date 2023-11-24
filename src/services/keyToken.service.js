'use  strict'
const { Types } = require("mongoose");
//? Create new token 

const keyTokenModel = require("../../src/models/keytoken.model");

class KeyTokenService {
    /**
     * public key khi xin ra bằng thuật toán chưa được hash nên 
     * chuyển về to string để không bị lỗi 
     *  
     */
    static createKeyToken = async ({ userId, publicKey, privateKey }) => {
        try {
            //  const  publicKeyString = publicKey.toString();
            //? Level 0
            // const tokens  = await keyTokenModel.create({
            //     user :  userId,
            //     publicKey : publicKey,
            //     privateKey : privateKey
            // })

            // return tokens ? tokens.publicKey : null

            //? Level XXX 
            const filter = { user: userId }, update = {
                publicKey,
                privateKey,
                refreshTokenUsed: [],
                refreshToken
            }, options = { upsert: true, new: true }
            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)
            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }
    static findByUserId = async (userId) => {
        return await keyTokenModel.findOne({ user: Types.ObjectId(userId) }).lean()
    }
}

module.exports = KeyTokenService