const {Targeting: Targeting} = require('../models')
const checkUser = require('../helper/perm')

module.exports = {
    Query: {
        targeting: (_, {campaignId}, ctx) => {
            checkUser(ctx.user)
            return Targeting.get(campaignId)
        },
    },
    Mutation: {

        addTargeting: async (_, {
            campaignId,
            position,
            geo,
            platform,
            sourceType,
            cpc,
            filterTypeId
        }, ctx) => {
            checkUser(ctx.user)

            let targeting = {}
            targeting.campaignId = campaignId
            targeting.position = position
            targeting.geo = geo
            targeting.platform = platform
            targeting.sourceType = sourceType
            targeting.cpc = cpc
            targeting.filterTypeId = filterTypeId
            targeting.user = ctx.user.email

            return await Targeting.add(targeting)
        },

    }
}