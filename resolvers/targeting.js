const {Targeting} = require('../models')
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
            platformAndroid,
            platformIos,
            platformWindows,
            sourceTypeSweepstakes,
            sourceTypeVod,
            cpc,
            filterTypeId
        }, ctx) => {
            checkUser(ctx.user)

            let targeting = {}
            targeting.campaignId = campaignId
            targeting.position = position
            targeting.geo = geo
            targeting.platformAndroid = platformAndroid
            targeting.platformIos = platformIos
            targeting.platformWindows = platformWindows
            targeting.sourceTypeSweepstakes = sourceTypeSweepstakes
            targeting.sourceTypeVod = sourceTypeVod
            targeting.cpc = cpc
            targeting.filterTypeId = filterTypeId
            targeting.user = ctx.user.email
            return await Targeting.add(targeting)
        },
        deleteTargeting: async (_, {campaignId}, ctx) => {
            checkUser(ctx.user)
            return await Targeting.del(campaignId)
        },
    }
}