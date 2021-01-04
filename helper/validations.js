const {getDimensions} = require('../db/dimensions')
const {getAffiliates} = require('../db/affiliates')
const {getCountries} = require('../db/countries')
const {getCampaigns} = require('../db/advCampaigns')

const segmentValidations = (segmentName, weight, multiplier) => {

    if (weight < 80 || weight > 100) {
        throw new Error('weight range between 80 adn 100')
    }
    if (multiplier < 0.5 || multiplier > 1.5) {
        throw new Error('multiplier range between 0.5 adn 1.5')
    }
}

const createRuleValidations = async (segmentId, dimensionId, value, segmentRuleIndex, filterTypeId) => {

    let filterL = [
        {id: 0, name: 'Include'},
        {id: 1, name: 'Exclude'}
    ]
    let checkFilterType = filterL.filter(item => (item.id === filterTypeId))
    if (checkFilterType.length === 0) {
        throw new Error(`filterTypeId:${filterTypeId} does not exists,  0-include , 1-exclude`)
    }

    let dList = await getDimensions()
    let checkDimension = dList.filter(item => (item.id === dimensionId))
    if (checkDimension.length === 0) {
        throw new Error(`dimensionId:${dimensionId} does not exists`)
    }
    console.log('checkDimension:', checkDimension)
    let affiliates = await getAffiliates()
    let affId
    switch (checkDimension[0].name) {
        case `affiliate`:
            affId = value
            let affiliateAffiliate = affiliates.filter(item => (item.id === Number(affId)))
            if (affiliateAffiliate.length === 0) {
                throw new Error(`affiliaet id :${affId} does not exists in DB`)
            }
            break
        case `country`:
            let countries = await getCountries()
            let countryCode = value
            let countryCountry = countries.filter(item => (item.code === countryCode))
            if (countryCountry.length === 0) {
                throw new Error(`checkCountry code:${countryCode} does not exists in DB`)
            }
            break
        case `affiliate_campaign`:
            let campaignId = value.substr(value.indexOf('/') + 1)
            // let campId = value.substr(value.indexOf('/') + 1, value.length - 1)
            affId = value.substr(0, value.indexOf('/'))

            // console.log('affId:', affId)
            // console.log('campaignId:', campaignId)
            let affiliateCampaignAff = affiliates.filter(item => (item.id === Number(affId)))
            if (affiliateCampaignAff.length === 0) {
                throw new Error(`affiliate_campaign , affiliate id :${affId} does not exists in DB`)
            }
            let getCampaignAffiliate  = await getCampaigns(affId)
            let affiliateCampaignCamp = getCampaignAffiliate.filter(item => (item.id === Number(campaignId)))
            if (affiliateCampaignCamp.length === 0) {
                throw new Error(`affiliate_campaign affiliate:${affId} campaignId:${campaignId} does not exists in DB`)
            }
            break
        case `affiliate_country`:
            let country = value.substr(value.indexOf('/') + 1)
            // let campId = value.substr(value.indexOf('/') + 1, value.length - 1)
            affId = value.substr(0, value.indexOf('/'))
            let affiliateCountry = affiliates.filter(item => (item.id === Number(affId)))
            let affiliateCountryCountry = affiliateCountry.filter(item => (item.countryCode === country))
            console.log('affiliate_country affId:',affId)
            console.log('affiliate_country country:',country)
            console.log('affiliate_country affiliateCountry:',affiliateCountry)
            // let affiliateCampaign = value
            // let affiliate_campaign = countres.filter(item=>(item.code === countryCode))
            if (affiliateCountryCountry.length ===0){
                throw new Error(`affiliate_country checkAffCountry code:${country} does not exists in DB`)
            }
            let affiliateCountryAff = affiliates.filter(item => (item.id === Number(affId)))
            if (affiliateCountryAff.length === 0) {
                throw new Error(`affiliate_country , affiliate id :${affId} does not exists in DB`)
            }

            break
        case `affiliate_sub_campaign`:
            // let affiliateCampaign = value
            // let affiliate_campaign = countres.filter(item=>(item.code === countryCode))
            // if (checkCountry.length ===0){
            //     throw new Error(`checkCountry code:${countryCode} does not exists in DB`)
            // }
            break
        default:
    }

    // if (dimensionId < 80 || weight > 100) {
    //     throw new Error('weight range between 80 adn 100')
    // }
    // if (multiplier < 0.5 || multiplier > 1.5) {
    //     throw new Error('multiplier range between 0.5 adn 1.5')
    // }
}
module.exports = {
    segmentValidations,
    createRuleValidations
}