const {getAffiliateWebsites} = require('../db/affiliateWebsites')

class AffiliateWebsites {
    static async getAffiliateWebsites() {
        return await getAffiliateWebsites()
    }

}

module.exports = {
    AffiliateWebsites,
};