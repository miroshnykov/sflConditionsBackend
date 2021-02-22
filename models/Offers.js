const {getOffer, getOffers, getOfferHistory} = require('../db/offers')

class Offers {
    static async getOffer(id) {
        return await getOffer(id)
    }

    static async getOffers() {
        return await getOffers()
    }

    static async getOfferHistory(id) {
        return await getOfferHistory(id)
    }

}

module.exports = {
    Offers,
};