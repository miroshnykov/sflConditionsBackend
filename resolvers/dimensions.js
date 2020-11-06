const { Dimensions } = require('../models')
const checkUser = require('../helper/perm')

module.exports = {
    Query: {
        dimensions: (_, { }, ctx) => {
            checkUser(ctx.user)
            return Dimensions.getDimensions()
        },
    },
}