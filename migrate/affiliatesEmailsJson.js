const fs = require('fs')
const {
    updateEmailAffiliates,
    updateEmailAffiliates2
} = require('../db/migrate')

// node migrate/affiliatesEmailsJson.js

const readJson = async () => {
    try {

        let fileJson = `${__dirname}/aff.json`
        const affString = fs.readFileSync(fileJson)
        const aff = JSON.parse(affString)
        let listAff = []
        Object.values(aff).forEach(i => {
            i.forEach(b => {
                listAff.push({id: b.affiliate_id, email: b.contacts.contact_info.email_address})
            })
        })

        return listAff
    } catch (err) {
        console.log(err)
        return
    }
}

(async () => {
    let data = await readJson()

    let success = 0
    let errors = 0
    let total = data.length
    let errorsDetail = []

    for (const item of data) {

        // console.log(item)
        let res = await updateEmailAffiliates(item)
        if (res && res.id === item.id) {
            console.log(`update email:{ ${item.email} }  Id: { ${item.id} }`)
            success++
        } else {
            errorsDetail.push(item.id)
            errors++
        }

    }
    console.log(`Total records: { ${total} }, added: { ${success} } , errors: { ${errors} }`)
    console.log(`Errors details:${JSON.stringify(errorsDetail)}`)

    return data
})().then(v => {
    console.log('end')
})
