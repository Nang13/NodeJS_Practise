'use strict'

const _  = require("lodash");

const getIntoData  = ({fields: fields  = [],object =  {} }) => {

    return _.pick(object , fields)
}

module.exports = {
    getIntoData
}