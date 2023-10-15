'use strict'
 
const mongoose =  require('mongoose')

const connectionString  = `mongodb://localhost:27017/ShopDEV`
mongoose.connect( connectionString).then( _ => console.log(`Connected MongoDB Success `))
                                    .catch( err => console.log(`Error Connect! + ${err}`))

if( 1 === 1 ){
    mongoose.set('debug', true)
    mongoose.set('debug', { color : true })
}

module.export = mongoose