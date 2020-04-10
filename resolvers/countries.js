const { Countries } = require('../models')
const checkUser = require('../helper/perm')

module.exports = {
    Query: {
        countries: (_, { }, ctx) => {
            checkUser(ctx.user)
            return Countries.all()
        },
    },
}