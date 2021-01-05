const {Offer} = require('../models')
const checkUser = require('../helper/perm')

module.exports = {
    Query: {
        // getOffer: (_, {id}, ctx) => {
        //     checkUser(ctx.user)
        //     return Offers.getOffer(id)
        // },

    },
    Mutation: {
        createOffer: async (_, data, ctx) => {
            checkUser(ctx.user)
            data.email = ctx.user.email
            return await Offer.create(data)
        },
        delOffer: async (_, {id}, ctx) => {
            checkUser(ctx.user)
            return await Offer.del(id)
        },

    }
}