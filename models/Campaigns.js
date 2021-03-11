const {getCampaign, getCampaigns} = require('../db/campaigns')

class Campaigns {
    static async getCampaign(affiliateId) {
        return await getCampaign(affiliateId)
    }

    static async getCampaigns(segmentId) {
        return await getCampaigns(segmentId)
    }

}

module.exports = {
    Campaigns,
};