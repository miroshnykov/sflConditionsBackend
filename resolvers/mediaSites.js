const {mediaSites} = require('../models')

module.exports = {
    
    Query: {
        getMediaSites: (_, {}, ctx) => {
            return mediaSites.getSites()
        },
    }
}