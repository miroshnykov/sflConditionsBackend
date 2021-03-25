const config = require('plain-config')()
const {
    getCampaigns,
    uploadCampaigns
} = require('../db/migrate')

// node migrate/migrateCampaigns.js

// DELETE FROM sfl_offer_campaigns


const run = async () => {
    let campaigns = await getCampaigns()
    let success = 0
    let errors = 0
    let total = campaigns.length
    let errorsDetail = []
    for (const item of campaigns) {
        // console.log(item)
        let res = await uploadCampaigns(item)
        if (res && res.id === item.campaignId) {
            console.log(`Added campaignId:${item.campaignId}`)
            success++
        } else {
            errorsDetail.push(item.campaignId)
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