const {
    all
} = require('../db/advCampaigns')

class AdvCampaigns {

    static async all() {
        return await all()
    }
}

module.exports = {
    AdvCampaigns: AdvCampaigns,
}