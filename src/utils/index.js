'use strict'

const _ = require("lodash");

const getIntoData = ({ fields: fields = [], object = {} }) => {

    return _.pick(object, fields)
}

const getSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 1]))
}
const unGetSelectData = (select = []) => {
    return Object.fromEntries(select.map(el => [el, 0]))
}
module.exports = {
    getIntoData,
    getSelectData,
    unGetSelectData

}