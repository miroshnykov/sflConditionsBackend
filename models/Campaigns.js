const {getCampaigns, addCampaign} = require('../db/campaigns')

class Campaigns {
    static async getCampaigns() {
        return await getCampaigns()
    }
    static async addCampaign(data) {
        return await addCampaign(data)
    }
}

module.exports = {
    Campaigns: Campaigns,
};