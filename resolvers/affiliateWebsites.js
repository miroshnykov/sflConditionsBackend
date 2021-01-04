const {AffiliateWebsites} = require('../models')
const checkUser = require('../helper/perm')
const {getDataCache, setDataCache} = require('../redis/redis')

module.exports = {
    Query: {
        getAffiliateWebsites: async (_, {}, ctx) => {
            checkUser(ctx.user)
            let affiliateWebsitesCache = await getDataCache(`affiliateWebsites`)
            if (affiliateWebsitesCache) {
                return affiliateWebsitesCache
            } else {
                let affiliateWebsites = await AffiliateWebsites.getAffiliateWebsites()
                await setDataCache(`affiliateWebsites`, affiliateWebsites)
                return affiliateWebsites
            }
        },
    },
}