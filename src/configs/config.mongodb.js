'use strict'

//level 0

const dev = {
    app: {
        port: process.env.DEV_APP_PORT || 3052
    },
    db: {
        host: process.env.DEV_APP_PORT || 'localhost',
        port: process.env.DEV_APP_PORT || 27017,
        name: process.env.DEV_APP_PORT || 'shopDEV'
    }
}


const pro = {
    app: {
        port: process.env.PRP_APP_PORT || 3000
    },
    db: {
        host: process.env.PRP_DB_PORT || 'localhost',
        port: process.env.PRP_DB_PORT || 27017,
        name: process.env.PRP_DB_NAME || 'shopPRO'
     }
}

const config = {dev, pro}
const env = process.env.NODE_ENV || 'dev'
module.exports = config[env]