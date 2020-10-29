const {
    get,
    reordering
} = require('../db/segments')

class Segments {
    static async get(id) {
        return await get(id)
    }
    static async reordering(data) {
        return await reordering(data)
    }

}

module.exports = {
    Segments,
}