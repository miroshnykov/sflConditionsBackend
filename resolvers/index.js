const login = require('./login')
const user = require('./user')
const campaign = require('./campaign')
const campaigns = require('./campaigns')
const targeting = require('./targeting')
const publisherTargeting = require('./publisherTargeting')
const countries = require('./countries')
const segments = require('./segments')

const resolvers = [
    login,
    user,
    campaign,
    campaigns,
    targeting,
    publisherTargeting,
    countries,
    segments
]

module.exports = {resolvers}