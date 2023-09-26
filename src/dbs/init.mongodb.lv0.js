'use strict'

const mongoose = require('mongoose')

const connectString = `cluster0.wfxmcch.mongodb.net`
mongoose.connect(connectString).then(_ => console.log('Connected Mongodb Success')).catch(err => console.log('Error connect'))

if(1 === 1){
    mongoose.set('debug', true)
    mongoose.set('debug',{color : true})

}

module.exports = mongoose