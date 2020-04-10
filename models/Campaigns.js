const {
    all
} = require('../db/campaigns')

class Campaigns {

    static async all() {
        return await all()
    }

}

module.exports = {
    Campaigns: Campaigns,
};