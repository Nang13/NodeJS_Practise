'use strict'

const mongoose = require('mongoose');

const connectionString = `mongodb://localhost:27017/ShopDEV`

const {  checkConnect } = require('../helpers/check.connect');

class Database {


    constructor() {
        this.connect()
    }
    connect(type = 'mongodb') {



        if (1 === 1) {
            mongoose.set('debug', true)
            mongoose.set('debug', { color: true })
        }
        mongoose.connect(connectionString,{
            maxPoolSize : 50
        }).then(_ => {console.log(`Connected MongoDB Success PRO`, checkConnect())
    
    })
            .catch(err => console.log(`Error Connect! + ${err}`))



    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance
    }
}


const instanceMongoDB = Database.getInstance()
module.exports = instanceMongoDB