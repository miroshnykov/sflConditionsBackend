const { query } = require('./query')
const { login } = require('./login')

const typeDefs = [
    query,
    login,
]

module.exports = {
    typeDefs,
};