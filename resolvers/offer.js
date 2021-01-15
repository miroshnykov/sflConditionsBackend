const {Offer} = require('../models')
const checkUser = require('../helper/perm')

module.exports = {
    Query: {
        getOfferCap: (_, {offerId}, ctx) => {
            checkUser(ctx.user)
            return Offer.cap(offerId)
        }
    },
    Mutation: {
        createOffer: async (_, data, ctx) => {
            checkUser(ctx.user)
            data.email = ctx.user.email
            return await Offer.create(data)
        },
        saveOffer: async (_, data, ctx) => {
            checkUser(ctx.user)
            data.email = ctx.user.email
            return await Offer.update(data)
        },
        delOffer: async (_, {id}, ctx) => {
            checkUser(ctx.user)
            return await Offer.del(id)
        },

    }
}