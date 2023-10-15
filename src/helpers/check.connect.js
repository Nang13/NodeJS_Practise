'use strict'

const mongoose = require('mongoose')
const _SECONDS = 5000;
const os = require('os')
const process = require('process')
//* count connect ( using to check many connects connect to server)
const checkConnect = () => {
    const numberConnection = mongoose.connections.length.toString()
    console.log(`Number of connections :: ${numberConnection}`)

}

//* check overload connect 
const checkOverload = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length
        const numCores = os.cpus().length
        const memoryUsage = process.memoryUsage().rss

        //* Exam maximum number of connections based on number of cores
        const maxConnections = numCores * 5

        console.log(`Memory usage : ${memoryUsage / 1024 / 1024} Mb`)
        if (numConnection > maxConnections) {
            console.log(`Connections overload detected`)
        }

    }, _SECONDS) //* Monitor every 5 seconds  


}

module.exports = {
    checkConnect,checkOverload
}