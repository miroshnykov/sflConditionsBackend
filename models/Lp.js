const {all, create, update, del} = require('../db/lp')

class Lp {
    static async all() {
        return await all()
    }

    static async create(data) {
        return await create(data)
    }

    static async update(data) {
        return await update(data)
    }

    static async del(data) {
        return await del(data)
    }
}

module.exports = {
    Lp,
}