const {Targeting: Targeting} = require('../models')
const checkUser = require('../helper/perm')

module.exports = {
    Query: {
        targeting: (_, {campaignId}, ctx) => {
            checkUser(ctx.user)
            return Targeting.getTargeting(campaignId)
        },
    },
    Mutation: {
        // addTargeting: async (_, {
        //     name,
        //     budgetTotal,
        //     budgetDaily,
        //     cpc,
        //     landingPage
        // }, ctx) => {
        //     checkUser(ctx.user)
        //
        //     let targeting = {}
        //     targeting.name = name
        //
        //     return await Targeting.addTargeting(targeting)
        // },

    }
}