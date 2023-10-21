require('dotenv').config()

const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
const app = express();

 
console.log(`process ::`, process.env);

//* init middleware
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended : true 
}))

//* init database 
require('./dbs/init.mongodb')

//* Check Overload
const {checkOverload } = require('./helpers/check.connect')
checkOverload()   
//* init routes 

app.use('/',require('./routes'))
// app.get('/', (req, res, next) => {

//     return res.status(200).json({
//         message: 'Welcome JS',
     
//     })
// })
//*handling error





module.exports = app