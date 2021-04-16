const config = require('plain-config')()
const {
    getCotzhaAdvertisers,
    uploadAdevertisers,
    checkAdveriser
} = require('../db/migrate')

// node migrate/migrateAdvertisers.js

// DELETE FROM sfl_advertisers;


const run = async () => {
    let advertisers = await getCotzhaAdvertisers()
    let success = 0
    let errors = 0
    let exsistsAdv = 0
    let notExsistsAdv = 0
    let total = advertisers.length
    let errorsDetail = []
    for (const item of advertisers) {
        // console.log(item)
        let checkAdv = await checkAdveriser(item.advertiserId)

        if (!checkAdv){
            notExsistsAdv++
            let res = await uploadAdevertisers(item)
            if (res && res.id === item.advertiserId) {
                console.log(`Added advertiserId:${item.advertiserId}`)
                success++
            } else {
                errorsDetail.push(item.advertiserId)
                errors++
            }
        } else {
            exsistsAdv++
        }

    }
    console.log(`Total records: { ${total} }, added: { ${success} } , errors: { ${errors} , exsistsAdv:${exsistsAdv} notExsistsAdv:${notExsistsAdv}`)
    console.log(`Errors details:${JSON.stringify(errorsDetail)}`)
}

(async () => {
    return await run()
})().then(v => {
    console.log('end')
})