const login = require('./login')
const user = require('./user')
const advCampaign = require('./advCampaign')
const advCampaigns = require('./advCampaigns')
const campaigns = require('./campaigns')
const offers = require('./offers')
const offer = require('./offer')
const targeting = require('./targeting')
const publisherTargeting = require('./publisherTargeting')
const countries = require('./countries')
const segments = require('./segments')
const segment = require('./segment')
const affiliates = require('./affiliates')
const dimensions = require('./dimensions')
const lp = require('./lp')
const prod = require('./prod')
const affiliateWebsites = require('./affiliateWebsites')

const resolvers = [
    login,
    user,
    advCampaign,
    advCampaigns,
    campaigns,
    offers,
    offer,
    targeting,
    publisherTargeting,
    countries,
    segments,
    segment,
    dimensions,
    affiliates,
    lp,
    prod,
    affiliateWebsites
]

module.exports = {resolvers}