const login = require('./login')
const user = require('./user')
const campaigns = require('./campaigns')
const targeting = require('./targeting')
const countries = require('./countries')

const resolvers = [
    login,
    user,
    campaigns,
    targeting,
    countries
]

module.exports = {resolvers}