'use strict'
const JWT = require('jsonwebtoken')
const { asyncHandler } = require('../helpers/asyncHandler')
const { AuthFailureError, NotFoundError } = require('../core/error.response')
const { findByUserId } = require('../services/keyToken.service')
const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
    CLIENT_ID: 'x-client-id',
    REFRESH_TOKEN:'x-rtoken-id'
}
const createTokenPair = async (payload, publicKey, privateKey) => {

    //* publicKey to verify token
    //* 
    try {
        //? create access token by private key
        const accessToken = await JWT.sign(payload, publicKey, {
            expiresIn: '2 days'
        })

        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '7 days'
        })

        //? Verify to using public token 
        //* in normal way, people usually use one key to  side and verify. Nowaydays , they usually to key
        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error('error verify:: ', err)
            } else {
                console.log('decode verify:: ', decode)
            }
        })


        return { accessToken, refreshToken }
    } catch (error) {
        return error;
    }


}


/*
1. Check userId missing ??
2. Get Access Token 
3. Verify token 
4. Check user in DB 
5. Check keysStore with this userId 
6. OK => return next 
*/
const authentication = asyncHandler(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId) throw new AuthFailureError('Invalid request')

    //2  
    const keyStore = await findByUserId(userId)
    if (!keyStore) throw new NotFoundError('Not Found  Key Store')

    //? 3   
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) throw new AuthFailureError('Invalid request')

    //?4 
    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)

        console.log(decodeUser.userId)
        if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid user')
        req.keyStore = keyStore
        return next();
    } catch (error) {
        throw error
    }

})


const authenticationV2 = asyncHandler(async (req, res, next) => {
    const userId = req.headers[HEADER.CLIENT_ID]
    if (!userId) throw new AuthFailureError('Invalid request')

    //?2  
    const keyStore = await findByUserId(userId)
    if (!keyStore) throw new NotFoundError('Not Found  Key Store')

    //? 3   


    if (req.headers[HEADER.REFRESH_TOKEN]) {
        try {
            const refreshToken = req.headers[HEADER.REFRESH_TOKEN]
            const decodeUser = JWT.verify(refreshToken, keyStore.privateKey)
            if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid user')
            req.keyStore = keyStore
            req.user = decodeUser
            req.refreshToken = refreshToken
            return next();
        } catch (error) {
            throw error
        }
    }
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) throw new AuthFailureError('Invalid request')

    //?4 
    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid user')
        req.keyStore = keyStore
        return next();
    } catch (error) {
        throw error
    }

})


const verifyJWT = async (token, keySecret) => {
    return  await JWT.verify(token, keySecret)
}



module.exports = {
    createTokenPair,
    authentication,
    verifyJWT,
    authenticationV2
}