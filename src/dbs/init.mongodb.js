'use strict'

const mongoose = require('mongoose')
const { countConnect } = require('../helpers/check.connect')
const connectString = `mongodb+srv://mandayngu:886Ul9ypAUPh6R1a@cluster0.wfxmcch.mongodb.net/`

class Database {
    constructor() {
        this.connect()
    }

    connect(type = 'mongodb') {

        if (1 === 1) {
            mongoose.set('debug', true)
            mongoose.set('debug', { color: true })
        }

        mongoose.connect(connectString, {
            maxPoolSize: 50
        })
            .then(_ => console.log(`Connected Mongodb Success`, countConnect()))
            .catch(err => console.log(`Error connect :${err} `))
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database()
        }

        return Database.instance
    }
}


const instanceMongodb = Database.getInstance()
module.exports = instanceMongodb