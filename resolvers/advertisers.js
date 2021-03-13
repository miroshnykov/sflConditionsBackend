const {Advertisers} = require('../models')
const checkUser = require('../helper/perm')
const {getDataCache, setDataCache} = require('../redis/redis')

module.exports = {
    Query: {
        getAdvertisers: async (_, {}, ctx) => {
            checkUser(ctx.user)
            let advertisersCache = await getDataCache(`advertisers`)
            if (advertisersCache) {
                return advertisersCache
            } else {
                let advertisers = await Advertisers.getAdvertisers()
                await setDataCache(`advertisers`, advertisers)
                return advertisers
            }
        },
        getSflAdvertisers: async (_, {}, ctx) => {
            checkUser(ctx.user)
            return await Advertisers.getSflAdvertisers()

        },
    },
}