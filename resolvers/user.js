const {User} = require('../models')
const checkUser = require('../helper/perm')

module.exports = {
    Query: {
        user: (_, {email}, ctx) => {
            checkUser(ctx.user)
            return User.getUser(email)
        },
    },
}