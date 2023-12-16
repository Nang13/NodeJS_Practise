'use strict'


const redis = require('redis')
const { promisify } = require('util')
const redisClient = redis.createClient()

const pexipre = promisify(redisClient.pexipre).bind(redisClient)
const setnxAsync = promisify(redisClient.setnx).bind(redisClient)

const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_v203_${productId}`
    const expireTime = 3000
    const retryTime = 10

    for (let index = 0; index < retryTime.length; index++) {
        // create key how have this key can pay
        const result = await setnxAsync[key, expireTime]

        console.log(`result :::`, result)
        if (result === 1) {
            const isReservation = await reservationInventory({
                productId,
                quantity,
                cartId
            })

            if (isReservation.modifiedCount) {
                await pexipre(key, expireTime)
                return key
            }
            //thao tac voi inventory
            return null;
        } else {
            await new Promise((resolve) => setTimeout(resolve, 50))
        }

    }
}

const releaseLock = async keyLock => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient)

    return await delAsyncKey(keyLock)
}

module.exports = {
    releaseLock,
    acquireLock
}