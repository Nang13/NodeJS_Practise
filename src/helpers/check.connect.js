'use strict'

const mongoose = require('mongoose')
const os = require('os')
const process = require('process')
const _SECONDS = 5000
const countConnect = () => {
    const numberConnection = mongoose.connections.length
    console.log(`Number of connection :${numberConnection}`)
}


//check overload connect 
const checkOverload = () => {
    setInterval(() => {
        const numbConnection = mongoose.connection.length
        const numbCores = os.cpus().length
        const memoryUsage = process.memoryUsage().rss
        //example maximum number of connection base on number of core
        const maxConnection = numbCores*5;

        console.log(`Active connection::  ${numbConnection} `)
        console.log(`Memory usage:: ${memoryUsage /1024/1024 } MB`)
        
        if(numbConnection > maxConnection ){
            
            console.log(`Connection over load `)
        }
    }, _SECONDS)// Monitor every 5 seconds 
}
module.exports = {
    countConnect,
    checkOverload
}