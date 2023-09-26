require('dotenv').config()
const compression = require('compression')
const express = require('express')
const { default: helmet } = require('helmet')
const morgan = require('morgan')


const app = express()

console.log(`Process:: `, process.env)
//init middleware 

app.use(morgan("dev"))
app.use(helmet())
app.use(compression)
//check connect
const {checkOverload} = require('./helpers/check.connect')
//checkOverload()

//init db
require('./dbs/init.mongodb')

//init routes


//handling error


module.exports = app