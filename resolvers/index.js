const login = require('./login')
const user = require('./user')
const campaigns = require('./campaigns')

const resolvers = [
    login,
    user,
    campaigns
]

module.exports = {resolvers}