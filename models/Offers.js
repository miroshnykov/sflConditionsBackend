const {getOffer, getOffers} = require('../db/offers')

class Offers {
    static async getOffer(id) {
        return await getOffer(id)
    }

    static async getOffers() {
        return await getOffers()
    }

}

module.exports = {
    Offers,
};