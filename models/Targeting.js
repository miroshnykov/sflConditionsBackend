const {
    get,
    add,
    del
} = require('../db/targrting')

class Targeting {
    static async get(id) {
        return await get(id)
    }

    static async add(data) {
        return await add(data)
    }

    static async del(id) {
        return await del(id)
    }
}

module.exports = {
    Targeting: Targeting,
};