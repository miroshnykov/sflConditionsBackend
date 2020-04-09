const {
    getCampaigns,
    addCampaign,
    getCampaign,
    updateCampaign,
    updateCampaignName,
    del
} = require('../db/campaigns')

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
    static async updateCampaignName(data) {
        return await updateCampaignName(data)
    }
    static async del(id) {
        return await del(id)
    }
}

module.exports = {
    Campaigns: Campaigns,
};