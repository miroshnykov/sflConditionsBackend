const {all} = require('../db/countries')

class Countries {
    static async all() {
        return await all()
    }
}

module.exports = {
    Countries,
};