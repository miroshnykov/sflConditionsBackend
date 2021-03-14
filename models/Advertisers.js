const {getAdvertisers,getSflAdvertisers, getSflAdvertisersManagers} = require('../db/advertisers')

class Advertisers {
    static async getAdvertisers() {
        return await getAdvertisers()
    }
    static async getSflAdvertisers() {
        return await getSflAdvertisers()
    }
    static async getSflAdvertisersManagers() {
        return await getSflAdvertisersManagers()
    }
}

module.exports = {
    Advertisers,
};