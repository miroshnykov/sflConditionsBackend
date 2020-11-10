const {
    all,
    reordering,
    deleteSegment,
    create
} = require('../db/segments')

class Segments {
    static async all() {
        return await all()
    }
    static async reordering(data) {
        return await reordering(data)
    }

    static async createSegment(data) {
        return await create(data)
    }

    static async deleteSegment(id) {
        return await deleteSegment(id)
    }

}

module.exports = {
    Segments,
}