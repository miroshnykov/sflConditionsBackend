const { AuthenticationError } = require('apollo-server-express')

const checkUser = (user) => {

    if (!user) {
        throw new AuthenticationError('Authentication token is invalid, please log in')
    }
}

module.exports = checkUser
