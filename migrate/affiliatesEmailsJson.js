const fs = require('fs')
const config = require('plain-config')()
const {
    updateEmailAffiliates,
    updateEmailAffiliates2,
    getSflAffiliates
} = require('../db/migrate')

// node migrate/affiliatesEmailsJson.js

const xmlParser = require('xml2json')
const axios = require('axios')
const getAffiliatesFromGotchaApi = async (affiliateID) => {
    try {
        const {data} = await axios.get(`https://partners.gotzha.com/api/5/export.asmx/Affiliates?api_key=${config.gotzhaApi}&affiliate_id=${affiliateID}&affiliate_name=&account_manager_id=0&tag_id=0&start_at_row=0&row_limit=0&sort_field=affiliate_id&sort_descending=FALSE`)
        // console.log(data)

        let json = xmlParser.toJson(data)
        // console.log('JSON output', json)
        return json

    } catch (e) {
        console.log(e)
    }
}


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
    // let data = await readJson()
    let sflAff = await getSflAffiliates()
    // console.log(sflAff)

    let success = 0
    let errors = 0
    let total = sflAff.length
    let errorsDetail = []

    for (const item of sflAff) {

        // console.log(item.id)
        let data = await getAffiliatesFromGotchaApi(item.id)
        const aff = JSON.parse(data)
        // console.log(aff)
        let affEmail = ''
        if (aff.affiliate_export_response.success
            && aff.affiliate_export_response.affiliates
            && aff.affiliate_export_response.affiliates.affiliate
        ){
            affEmail = aff.affiliate_export_response.affiliates.affiliate.contacts.contact_info && aff.affiliate_export_response.affiliates.affiliate.contacts.contact_info.email_address || ''
        } else {
            console.log(`API err message:${aff.affiliate_export_response.message}` )
        }


        let obj ={}
        obj.id = item.id
        if (typeof affEmail === `object`){
            affEmail = ''
        }
        obj.email = affEmail
        console.log(obj)
        // console.log('affId-',item.id)
        // console.log('email-',affEmail)
        let res = await updateEmailAffiliates(obj)
        if (res && res.id === item.id) {
            console.log(`update email:{ ${obj.email} }  Id: { ${obj.id} }`)
            success++
        } else {
            errorsDetail.push(item.id)
            errors++
        }

    }
    console.log(`Total records: { ${total} }, added: { ${success} } , errors: { ${errors} }`)
    console.log(`Errors details:${JSON.stringify(errorsDetail)}`)

    return

    let listAff = []
    // aff.forEach(i => {
    //     i.forEach(b => {
    //         listAff.push({id: b.affiliate_id, email: b.contacts.contact_info.email_address})
    //     })
    // })

    return



    return data
})().then(v => {
    console.log('end')
})
