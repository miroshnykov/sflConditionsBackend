const {getCampaigns, addCampaign, getCampaign} = require('../db/campaigns')

class Campaigns {
    static async getCampaign(id) {
        return await getCampaign(id)
    }
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