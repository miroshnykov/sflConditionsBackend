const {PublisherTargeting} = require('../models')
const checkUser = require('../helper/perm')

module.exports = {
    Query: {
        publisherTargeting: (_, {}, ctx) => {
            checkUser(ctx.user)
            return PublisherTargeting.get()
        },
    }
}