const {LpOffers} = require('../models')
const checkUser = require('../helper/perm')
const {getDataCache, setDataCache} = require('../redis/redis')

module.exports = {
    Query: {
        getLpOffers: (_, {}, ctx) => {
            checkUser(ctx.user)
            return LpOffers.getLpOffers()
        }
    },
    Mutation: {
        createLpOffer: async (_, data, ctx) => {
            checkUser(ctx.user)
            data.email = ctx.user.email
            return await LpOffers.create(data)
        },
        updateLpOffer: async (_, data, ctx) => {
            checkUser(ctx.user)
            data.email = ctx.user.email
            return await LpOffers.update(data)
        },
        deleteLpOffer: async (_, data, ctx) => {
            checkUser(ctx.user)
            return await LpOffers.del(data)
        },

    }
}