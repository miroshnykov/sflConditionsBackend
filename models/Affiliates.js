const {getAffiliates, getAffiliatesByFilter, getAffiliatesBySegmentId} = require('../db/affiliates')

class Affiliates {
    static async allAffiliates() {
        return await getAffiliates()
    }
    static async getAffiliatesByFilter(filter) {
        return await getAffiliatesByFilter(filter)
    }
    static async getAffiliatesBySegmentId(segmentId) {
        return await getAffiliatesBySegmentId(segmentId)
    }
}

module.exports = {
    Affiliates,
};