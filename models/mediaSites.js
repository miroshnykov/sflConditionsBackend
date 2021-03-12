const {
    sites
} = require('../api/mediaSites.js')

class mediaSites {
    static async getSites() {
        return await sites()
    }
}

module.exports = {
    mediaSites
}