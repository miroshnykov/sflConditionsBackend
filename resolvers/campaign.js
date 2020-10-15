const {Campaign} = require('../models')
const checkUser = require('../helper/perm')

module.exports = {
    Query: {
        campaign: (_, {id}, ctx) => {
            checkUser(ctx.user)
            return Campaign.get(id)
        },
    },
    Mutation: {
        addCampaign: async (_, {
            name,
            budgetTotal,
            budgetDaily,
            cpc,
            landingPage,
            landingPageValid,
            noLimit,
        }, ctx) => {
            checkUser(ctx.user)

            let campaign = {}
            campaign.name = name
            campaign.budgetTotal = budgetTotal
            campaign.budgetDaily = budgetDaily
            campaign.cpc = cpc
            campaign.landingPage = landingPage
            campaign.landingPageValid = landingPageValid || false
            campaign.noLimit = noLimit
            campaign.user = ctx.user.email
            return await Campaign.add(campaign)
        },
        updateCampaign: async (_, {
            id,
            name,
            budgetTotal,
            budgetDaily,
            cpc,
            status,
            landingPage,
            landingPageValid,
            noLimit
        }, ctx) => {
            checkUser(ctx.user)

            let campaign = {}
            campaign.id = id
            campaign.name = name
            campaign.budgetTotal = budgetTotal
            campaign.budgetDaily = budgetDaily
            campaign.cpc = cpc
            campaign.landingPage = landingPage
            campaign.status = status
            campaign.landingPageValid = landingPageValid || false
            campaign.noLimit = noLimit
            return await Campaign.update(campaign)
        },
        updateCampaignName: async (_, {
            id,
            name
        }, ctx) => {
            checkUser(ctx.user)

            let campaign = {}
            campaign.id = id
            campaign.name = name
            return await Campaign.updateName(campaign)
        },
        deleteCampaign: async (_, {
            campaignId
        }, ctx) => {
            checkUser(ctx.user)
            return await Campaign.del(campaignId)
        },
    }
}