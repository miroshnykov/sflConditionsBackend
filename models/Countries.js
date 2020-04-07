const {getCountries} = require('../db/countries')

class Countries {
    static async getCountries() {
        return await getCountries()
    }
}

module.exports = {
    Countries,
};