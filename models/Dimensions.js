const {getDimensions} = require('../db/dimensions')

class Dimensions {
    static async getDimensions() {
        return await getDimensions()
    }
}

module.exports = {
    Dimensions,
};