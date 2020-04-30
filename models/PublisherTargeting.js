const {
    get,
} = require('../db/publisherTargeting')

class PublisherTargeting {
    static async get() {
        return await get()
    }
}

module.exports = {
    PublisherTargeting,
}