const {Campaigns} = require('../models')
const checkUser = require('../helper/perm')
const {getDataCache, setDataCache} = require('../redis/redis')

module.exports = {
    Query: {
        getCampaign: (_, {affiliateId}, ctx) => {
            checkUser(ctx.user)
            return Campaigns.getCampaign(affiliateId)
        },
        getCampaigns: async (_, {}, ctx) => {
            checkUser(ctx.user)
            let campaignsCache = await getDataCache(`campaigns`)
            if (campaignsCache) {
                return campaignsCache
            } else {
                let campaigns = await Campaigns.getCampaigns()
                await setDataCache(`campaigns`, campaigns)
                return campaigns
            }
        },
    },
}