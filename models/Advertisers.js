const {getAdvertisers,getSflAdvertisers} = require('../db/advertisers')

class Advertisers {
    static async getAdvertisers() {
        return await getAdvertisers()
    }
    static async getSflAdvertisers() {
        return await getSflAdvertisers()
    }

}

module.exports = {
    Advertisers,
};