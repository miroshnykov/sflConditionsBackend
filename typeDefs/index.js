const { query } = require('./query')
const { login } = require('./login')
const { user } = require('./user')
const { campaign } = require('./campaign')
const { campaigns } = require('./campaigns')
const { targeting } = require('./targeting')
const { countries } = require('./countries')

const typeDefs = [
    query,
    login,
    user,
    campaign,
    campaigns,
    targeting,
    countries
]

module.exports = {
    typeDefs,
}