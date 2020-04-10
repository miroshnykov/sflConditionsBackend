const login = require('./login')
const user = require('./user')
const campaign = require('./campaign')
const campaigns = require('./campaigns')
const targeting = require('./targeting')
const countries = require('./countries')

const resolvers = [
    login,
    user,
    campaign,
    campaigns,
    targeting,
    countries
]

module.exports = {resolvers}