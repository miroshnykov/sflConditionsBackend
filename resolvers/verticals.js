const {Verticals} = require('../models')
const checkUser = require('../helper/perm')

module.exports = {
    Query: {
        verticals: async (_, {}, ctx) => {
            checkUser(ctx.user)
            return await Verticals.getVerticals()
        },
    },
}
