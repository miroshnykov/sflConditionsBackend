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
}