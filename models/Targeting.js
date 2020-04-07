const {
    get,
    add
} = require('../db/targrting')

class Targeting {
    static async get(id) {
        return await get(id)
    }

    static async add(data) {
        return await add(data)
    }

}

module.exports = {
    Targeting: Targeting,
};