const {
    get,
    add,
    update,
    updateName,
    del
} = require('../db/campaign')

class Campaign {
    static async get(id) {
        return await get(id)
    }
    static async add(data) {
        return await add(data)
    }
    static async update(data) {
        return await update(data)
    }
    static async updateName(data) {
        return await updateName(data)
    }
    static async del(id) {
        return await del(id)
    }
}

module.exports = {
    Campaign: Campaign,
};