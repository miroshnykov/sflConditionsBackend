const {
    all
} = require('../db/prod')

class Prod {

    static async all() {
        return await all()
    }
}

module.exports = {
    Prod,
}