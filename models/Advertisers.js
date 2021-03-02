const {getAdvertisers} = require('../db/advertisers')

class Advertisers {
    static async getAdvertisers() {
        return await getAdvertisers()
    }
}

module.exports = {
    Advertisers,
};