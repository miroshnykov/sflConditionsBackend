const {all} = require('../db/lp')

class Lp {
    static async all() {
        return await all()
    }
}

module.exports = {
    Lp,
}