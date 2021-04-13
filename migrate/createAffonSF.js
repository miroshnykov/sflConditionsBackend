const config = require('plain-config')()
const {
    getSflAffiliatesInfo
} = require('../db/migrate')



// node migrate/createAffonSF.js

// DELETE FROM sfl_affiliates;


const waitFor = delay => new Promise(resolve => setTimeout(resolve, delay))
const run = async () => {
    // let data = await readJson()
    const salesForce = require('../helper/salesForce')

    await waitFor(5000)

    let sflAff = await getSflAffiliatesInfo()
    // console.log(sflAff)

    let success = 0
    let errors = 0
    let total = sflAff.length
    let errorsDetail = []
    let errorsAffiliates = []

    // let s = 'miroshnykov@gmail.com'
    // let checkAccountExists = await salesForce.findAccountsById(s)
    // console.log(`checkAccountExists:${checkAccountExists.length} for email:${s}`)
    for (const item of sflAff) {

        // console.log(item)
        let checkAccountExists = await salesForce.findAccountsById(item.email)
        console.log(`checkAccountExists:${checkAccountExists.length} for email:${item.email}`)
        if (checkAccountExists.length !== 0) {
            console.log(`Account exists on SF:${item.email} `)
            let errorObj = {}
            errorObj.message = `Account exists on SF email:${item.email}}`
            errorsAffiliates.push(errorObj)
            continue
        }

        const salesForceResult = await salesForce.createAccount2(item)

        let salesForceId = salesForceResult.id
        console.log('salesForceId:', salesForceId)
        if (!salesForceId) {
            console.log(`Account doesnot create on SF email:${item.email}`)
            errors++
            continue
        } else {
            success++
        }


        // console.log('affId-',item.id)
        // console.log('email-',affEmail)
        // let res = await updateEmailAffiliates(obj)
        // if (res && res.id === item.id) {
        //     console.log(`update email:{ ${obj.email} }  Id: { ${obj.id} }`)
        //     success++
        // } else {
        //     errorsDetail.push(item.id)
        //     errors++
        // }

    }
    console.log(`Total records: { ${total} }, added: { ${success} } , errors: { ${errors} }`)
    console.log(`Errors details:${JSON.stringify(errorsDetail)}`)
    console.log(`errorsAffiliates :${JSON.stringify(errorsAffiliates)}`)
}

(async () => {
    return await run()
})().then(v => {
    console.log('end')
})