const { query } = require('./query')
const { login } = require('./login')
const { user } = require('./user')
const { campaigns } = require('./campaigns')

const typeDefs = [
    query,
    login,
    user,
    campaigns
]

module.exports = {
    typeDefs,
};