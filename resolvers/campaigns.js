const {Campaigns: Campaigns} = require('../models')
const checkUser = require('../helper/perm')

module.exports = {
    Query: {
        campaigns: (_, {email}, ctx) => {
            checkUser(ctx.user)
            return Campaigns.getCampaigns()
        },
        campaign: (_, {id}, ctx) => {
            checkUser(ctx.user)
            return Campaigns.getCampaign(id)
        },
    },
    Mutation: {
        addCampaign: async (_, {
            name,
            budgetTotal,
            budgetDaily,
            cpc,
            landingPage
        }, ctx) => {
            checkUser(ctx.user)

            let campaign = {}
            campaign.name = name
            campaign.budgetTotal = budgetTotal
            campaign.budgetDaily = budgetDaily
            campaign.cpc = cpc
            campaign.landingPage = landingPage
            campaign.user = ctx.user.email
            return await Campaigns.addCampaign(campaign)
        },
        updateCampaign: async (_, {
            id,
            name,
            budgetTotal,
            budgetDaily,
            cpc,
            landingPage
        }, ctx) => {
            checkUser(ctx.user)

            let campaign = {}
            campaign.id = id
            campaign.name = name
            campaign.budgetTotal = budgetTotal
            campaign.budgetDaily = budgetDaily
            campaign.cpc = cpc
            campaign.landingPage = landingPage
            campaign.user = ctx.user.email
            return await Campaigns.updateCampaign(campaign)
        },
        updateCampaignName: async (_, {
            id,
            name
        }, ctx) => {
            checkUser(ctx.user)

            let campaign = {}
            campaign.id = id
            campaign.name = name
            campaign.user = ctx.user.email
            return await Campaigns.updateCampaignName(campaign)
        },
    }
}