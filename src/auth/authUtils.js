'use strict'
const JWT = require('jsonwebtoken')
const createTokenPair = async ( payload, publicKey, privateKey) => {

    //* publicKey to verify token
    //* 
    try {
        //? create access token by private key
        const accessToken = await JWT.sign( payload, publicKey, {
       
            expiresIn: '2 days'
        })

        const refreshToken = await JWT.sign( payload, privateKey, {
            expiresIn: '7 days'
        })

        //? Verify to using public token 
        //* in normal way, people usually use one key to  side and verify. Nowaydays , they usually to key
        JWT.verify( accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error('error verify:: ', err)
            } else {
                console.log('decode verify:: ', decode)
            }
        })


        return { accessToken, refreshToken }
    } catch (error) {

    }
}


module.exports = { createTokenPair }