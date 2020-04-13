const {
    get,
    add,
    del,
    restoreSoftDelete
} = require('../db/targrting')

class Targeting {
    static async get(id) {
        return await get(id)
    }

    static async add(data) {
        return await add(data)
    }

    static async del(id, softDelete) {
        return await del(id, softDelete)
    }

    static async restoreSoftDelete(id) {
        return await restoreSoftDelete(id)
    }
}

module.exports = {
    Targeting,
};