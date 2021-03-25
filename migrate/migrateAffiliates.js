const config = require('plain-config')()
const {
    getCotchaAffiliates,
    uploadAffiliates
} = require('../db/migrate')

// node migrate/migrateAffiliates.js

// DELETE FROM sfl_affiliates;


const run = async () => {
    let affiliates = await getCotchaAffiliates()
    let success = 0
    let errors = 0
    let total = affiliates.length
    let errorsDetail = []
    for (const item of affiliates) {
        // console.log(item)
        let res = await uploadAffiliates(item)
        if (res && res.id === item.affiliateId) {
            console.log(`Added affiliateId:${item.affiliateId}`)
            success++
        } else {
            errorsDetail.push(item.affiliateId)
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