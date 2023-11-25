'use  strict'
const { Types: { ObjectId } } = require('mongoose')
//? Create new token 

const keyTokenModel = require("../../src/models/keytoken.model");

class KeyTokenService {
    /**
     * public key khi xin ra bằng thuật toán chưa được hash nên 
     * chuyển về to string để không bị lỗi 
     *  
     */
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
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
                refreshTokensUsed: [],   
                refreshToken
            }, options = { upsert: true, new: true }
            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)
            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }



    static findByUserId = async (userId) => {
        console.log(userId)
        return await keyTokenModel.findOne({ user: new  ObjectId(userId) }).lean();
    }

    static removeKeyId = async ( id ) => {
        const result = await  keyTokenModel.deleteOne({ _id:  new ObjectId(id) })
        return result;
    }



}

module.exports = KeyTokenService