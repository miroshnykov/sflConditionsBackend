const login = require('./login')
const user = require('./user')
const advCampaign = require('./advCampaign')
const advCampaigns = require('./advCampaigns')
const campaigns = require('./campaigns')
const targeting = require('./targeting')
const publisherTargeting = require('./publisherTargeting')
const countries = require('./countries')
const segments = require('./segments')
const segment = require('./segment')
const affiliates = require('./affiliates')
const dimensions = require('./dimensions')
const lp = require('./lp')
const prod = require('./prod')

const resolvers = [
    login,
    user,
    advCampaign,
    advCampaigns,
    campaigns,
    targeting,
    publisherTargeting,
    countries,
    segments,
    segment,
    dimensions,
    affiliates,
    lp,
    prod
]

module.exports = {resolvers}