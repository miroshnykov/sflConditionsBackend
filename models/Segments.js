const {
    get,
    reordering,
    create
} = require('../db/segments')

class Segments {
    static async get(id) {
        return await get(id)
    }
    static async reordering(data) {
        return await reordering(data)
    }

    static async createSegment(data) {
        return await create(data)
    }

}

module.exports = {
    Segments,
}