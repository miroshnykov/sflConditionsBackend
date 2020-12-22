const {Campaigns: AdvCampaigns} = require('../models')
const checkUser = require('../helper/perm')

module.exports = {
    Query: {
        campaigns: (_, {}, ctx) => {
            checkUser(ctx.user)
            return AdvCampaigns.all()
        }
    }
}