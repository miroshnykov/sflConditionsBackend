const {getLpOffers} = require('../db/lpOffers')

class LpOffers {

    static async getLpOffers() {
        return await getLpOffers()
    }

}

module.exports = {
    LpOffers,
};