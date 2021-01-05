const {create, del} = require('../db/offer')

class Offer {
    static async create(data) {
        return await create(data)
    }

    static async del(id) {
        return await del(id)
    }

}

module.exports = {
    Offer,
};