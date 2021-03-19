const {get} = require('../db/verticals')

class Verticals {
    static async getVerticals() {
        return await get()
    }

}

module.exports = {
    Verticals,
};