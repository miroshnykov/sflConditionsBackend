const { query } = require('./query')
const { login } = require('./login')
const { user } = require('./user')
const { campaigns } = require('./campaigns')
const { targeting } = require('./targeting')
const { countries } = require('./countries')

const typeDefs = [
    query,
    login,
    user,
    campaigns,
    targeting,
    countries
]

module.exports = {
    typeDefs,
};