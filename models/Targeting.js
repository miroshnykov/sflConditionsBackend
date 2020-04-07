const {
    getTargeting,
} = require('../db/targrting')

class Targeting {
    static async getTargeting(id) {
        return await getTargeting(id)
    }

}

module.exports = {
    Targeting: Targeting,
};