const {getAffiliates} = require('../db/affiliates')

class Affiliates {
    static async allAffiliates() {
        return await getAffiliates()
    }
}

module.exports = {
    Affiliates,
};