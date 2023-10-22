'use  strict'
//? Create new token 

const keyTokenModel =   require("../../src/models/keytoken.model");

class KeyTokenService{
    /**
     * public key khi xin ra bằng thuật toán chưa được hash nên 
     * chuyển về to string để không bị lỗi 
     *  
     */
    static createKeyToken = async ({ userId ,publicKey, privateKey }) => {
        try {
          //  const  publicKeyString = publicKey.toString();
            const tokens  = await keyTokenModel.create({
                user :  userId,
                publicKey : publicKey,
                privateKey : privateKey
            })

            return tokens ? tokens.publicKey : null
        } catch (error) {
            
        }
    }
}

module.exports = KeyTokenService