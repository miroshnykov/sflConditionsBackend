const {Offers} = require('../models')
const checkUser = require('../helper/perm')
const {getDataCache, setDataCache} = require('../redis/redis')

module.exports = {
    Query: {
        getOffer: (_, {id}, ctx) => {
            checkUser(ctx.user)
            return Offers.getOffer(id)
        },
        getOffers: async (_, {}, ctx) => {
            checkUser(ctx.user)
            return await Offers.getOffers()

        },
        getOfferHistory: async (_, {id}, ctx) => {
            checkUser(ctx.user)
            return await Offers.getOfferHistory(id)
        },
    },
}