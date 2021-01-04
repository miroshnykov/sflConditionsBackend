const {
    all,
    reordering,
    deleteSegment,
    create
} = require('../db/segments')

class Segments {
    static async all(type) {
        return await all(type)
    }

    static async reordering(data) {
        return await reordering(data)
    }

    static async createSegment(data) {
        return await create(data)
    }

    static async deleteSegment(data) {
        return await deleteSegment(data)
    }

}

module.exports = {
    Segments,
}