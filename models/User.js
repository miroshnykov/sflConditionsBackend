const {getUser} = require('../db/user')

class User {
    static async getUser(email) {
        return await getUser(email)
    }
}

module.exports = {
    User: User,
};