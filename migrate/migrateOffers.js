const config = require('plain-config')()
const {getOffer,
    getCotchaAffiliates,
    uploadOffers
} = require('../db/migrate')



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
    let total = offer.length
    let errorsDetail = []
    for (const item of offer) {
        console.log(item)
        let res = await uploadOffers(item)
        if (res && res.id === item.offerId) {
            console.log(`Added offerId:${item.offerId}`)
            success++
        } else {
            errorsDetail.push(item.offerId)
            errors++
        }
    }
    console.log(`Total records: { ${total} }, added: { ${success} } , errors: { ${errors} }`)
    console.log(`Errors details:${JSON.stringify(errorsDetail)}`)
}

(async () => {
    return await run()
})().then(v => {
    console.log('end')
})