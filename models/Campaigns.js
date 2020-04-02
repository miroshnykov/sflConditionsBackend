const {getCampaigns, addCampaign, getCampaign, updateCampaign} = require('../db/campaigns')

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
    static async updateCampaign(data) {
        return await updateCampaign(data)
    }
}

module.exports = {
    Campaigns: Campaigns,
};