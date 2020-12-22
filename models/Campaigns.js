const {getCampaign, getCampaigns} = require('../db/campaigns')

class Campaigns {
    static async getCampaign(affiliateId) {
        return await getCampaign(affiliateId)
    }

    static async getCampaigns() {
        return await getCampaigns()
    }

}

module.exports = {
    Campaigns,
};