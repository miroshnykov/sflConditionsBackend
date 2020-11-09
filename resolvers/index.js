const login = require('./login')
const user = require('./user')
const campaign = require('./campaign')
const campaigns = require('./campaigns')
const targeting = require('./targeting')
const publisherTargeting = require('./publisherTargeting')
const countries = require('./countries')
const segments = require('./segments')
const segment = require('./segment')
const affiliates = require('./affiliates')
const dimensions = require('./dimensions')
const lp = require('./lp')

const resolvers = [
    login,
    user,
    campaign,
    campaigns,
    targeting,
    publisherTargeting,
    countries,
    segments,
    segment,
    dimensions,
    affiliates,
    lp
]

module.exports = {resolvers}