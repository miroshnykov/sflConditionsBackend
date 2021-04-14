const config = require('plain-config')()
const {getOffer,
    getCotchaAffiliates,
    uploadOffers,
    checkOfferExists
} = require('../db/migrate')

// node migrate/migrateOffers.js

// DELETE FROM sfl_offers_cap;
// DELETE FROM sfl_offer_geo;
// DELETE FROM sfl_offer_custom_landing_pages;
// DELETE FROM sfl_offers_history;
// DELETE FROM sfl_offer_landing_pages;
// DELETE FROM sfl_offers;



const run = async () => {
    let offer = await getOffer()
    let success = 0
    let errors = 0
    let notExsistsOffer = 0
    let exsistsOffer = 0
    let total = offer.length
    let errorsDetail = []
    for (const item of offer) {
        // console.log(item)
        let checkOffer = await checkOfferExists(item.offerId)

        if (!checkOffer){
            notExsistsOffer++
            let res = await uploadOffers(item)
            if (res && res.id === item.offerId) {
                console.log(`Added offerId:${item.offerId}`)
                success++
            } else {
                errorsDetail.push(item.offerId)
                errors++
            }
        } else {
            exsistsOffer++
        }


    }
    console.log(`Total records: { ${total} }, added: { ${success} } , errors: { ${errors} },exsistsOffer:{ ${exsistsOffer} }, notExsistsOffer: { ${notExsistsOffer} }`)
    console.log(`Errors details:${JSON.stringify(errorsDetail)}`)
}

(async () => {
    return await run()
})().then(v => {
    console.log('end')
})