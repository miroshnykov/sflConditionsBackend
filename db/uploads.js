let dbMysql = require('./mysqlDb').get()
let dbTransaction = require('./mysqlTransaction').get()
const parser = require('csv-parse')

const uploadManagers = async (data) => {

    try {
        const {firstName, lastName, email, role} = data
        console.log(data)
        let date = new Date()
        let dateAdd = ~~(date.getTime() / 1000)
        let result = await dbMysql.query(`
            INSERT INTO sfl_employees (first_name, last_name, email, role, date_added) 
            VALUES (?,?,?,?,?);

        `, [firstName, lastName, email, role, dateAdd])
        await dbMysql.end()

        let res = {}
        res.id = result.insertId

        console.log(`\nCreate manager:{ ${JSON.stringify(data)} },  affectRows:${result.affectedRows}`)
        return res
    } catch (e) {
        console.log('uploadManagersError:', e)
        let res = {}
        res.error = e.sqlMessage
        return res
    }

}

const uploadAdvertisers = async (data) => {


    try {
        const {advertiserName, status, advertiserManager, advertiserId, website, tags, descriptions} = data

        let advName = advertiserManager.split(' ')
        let firstName = advName[0]
        let lastName = advName[1]
        let findAdvMenager = await dbMysql.query(` 
           SELECT id FROM sfl_employees WHERE Lower(first_name) = LOWER('${firstName}') AND Lower(last_name) = LOWER('${lastName}')
        `)
        await dbMysql.end()

        let advManagerId = findAdvMenager.length !== 0 && findAdvMenager[0].id || 0
        let res = {}
        if (!advManagerId) {
            // console.log(`advertiser manager ${advertiserManager} doesnot exists in DB `)
            res.error = `advertiser manager ${advertiserManager} doesnot exists in DB `
            return res
        }
        console.log(data)
        let date = new Date()
        let dateAdd = ~~(date.getTime() / 1000)
        let result = await dbMysql.query(`
            INSERT INTO sfl_advertisers (name, status, advertiser_manager_id, origin_id, website, tags,descriptions,date_added) 
            VALUES (?,?,?,?,?,?,?,?) 

        `, [advertiserName, status, advManagerId, advertiserId, website, tags, descriptions, dateAdd])
        await dbMysql.end()


        res.id = result.insertId

        console.log(`\nCreate advertiser:{ ${JSON.stringify(data)} },  affectRows:${result.affectedRows}`)
        return res
    } catch (e) {
        console.log('uploadManagersError:', e)
        let res = {}
        res.error = e.sqlMessage
        return res
    }

}

const uploadOffers = async (data) => {

    console.log('Data:', data)
    const db = dbTransaction()
    try {
        await db.beginTransaction()
        const {
            offerIdOrigin,
            email,
            status,
            advertiserManager,
            offerName,
            verticals,
            advertiserName,
            advertiserId,
            conversionType,
            offerType,
            payOut,
            payIn,
            lpUrl,
            offerStatus,
            website,
            tags,
            descriptions
        } = data

        // let advName = advertiserManager.split(' ')
        // let firstName = advName[0]
        // let lastName = advName[1]
        let findAdvId = await db.query(`
           SELECT * FROM sfl_advertisers WHERE name LIKE '%${advertiserName}%'

        `)
        //
        let findAdvId_ = findAdvId.length !== 0 && findAdvId[0].id || 0
        let findAdvManagerId_ = findAdvId.length !== 0 && findAdvId[0].advertiser_manager_id || 0
        let res = {}
        if (!findAdvId_) {
            // console.log(`advertiser manager ${advertiserManager} doesnot exists in DB `)
            res.error = `advertiser  ${advertiserName} doesnot exists in DB `
            return res
        }

        // let findAdvMenager = await dbMysql.query(`
        //    SELECT * FROM sfl_advertisers WHERE name LIKE '%${advertiserName}%'
        //
        // `)
        // await dbMysql.end()
        // //
        // let advManagerId = findAdvMenager.length !== 0 && findAdvMenager[0].id || 0
        // if (!advManagerId) {
        //     // console.log(`advertiser manager ${advertiserManager} doesnot exists in DB `)
        //     res.error = `advertiser manager ${advertiserName} doesnot exists in DB `
        //     return res
        // }
        // advertiserManager

        console.log(data)

        // let statusesOrigin = ['public','private','apply_to_run','inactive']
        let statusFormat = offerStatus.replace(/\s+/g, '_').toLowerCase();

        let payInFormat = Number(payIn.replace(/^\D+/g, ''))
        let payOutFormat = Number(payOut.replace(/^\D+/g, ''))
        let date = new Date()
        let dateAdd = ~~(date.getTime() / 1000)
        let result = await db.query(`
            INSERT INTO sfl_offers (
                id, name, sfl_advertiser_id, advertiser_manager_id,verticals, descriptions, status, conversion_type, sfl_offer_landing_page_id, 
                offer_id_redirect,  payin, payout, user, date_added)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?);
        `, [offerIdOrigin, offerName, findAdvId_, findAdvManagerId_, verticals, descriptions || '', statusFormat, conversionType, 0,
            '777', payInFormat, payOutFormat, email, dateAdd])

        console.log(`Create Offer affectRows:${result.affectedRows}, result:${JSON.stringify(data)}`)
        let insertLp = await db.query(`
            INSERT INTO sfl_offer_landing_pages (sfl_offer_id, name, url, user, date_added )
            VALUES (?,?,?,?,?)`, [offerIdOrigin, lpUrl, lpUrl, email, dateAdd])
        //
        let lpId = insertLp.insertId

        let updateLpIdOffer = await db.query(`
            UPDATE sfl_offers SET sfl_offer_landing_page_id=${lpId} WHERE id=${offerIdOrigin}`)

        console.log(`updateLpIdOffer result:${JSON.stringify(updateLpIdOffer)}`)


        res.id = result.insertId
        await db.commit()
        // console.log(`\nCreate advertiser:{ ${JSON.stringify(data)} },  affectRows:${result.affectedRows}`)
        return res
        // } catch (e) {
        //     console.log('uploadManagersError:', e)
        //     let res = {}
        //     res.error = e.sqlMessage
        //     return res
        // }
    } catch (e) {
        console.log('uploadManagersError:', e)
        let res = {}
        res.error = e.sqlMessage
        await db.rollback()
        return res
    } finally {
        await db.close()
    }

}

const uploadAffiliates = async (data) => {
    const db = dbTransaction()
    let date = new Date()
    let dateAdd = ~~(date.getTime() / 1000)
    try {
        await db.beginTransaction()
        const {
            affiliateIdOrigin, affiliateName, accountManagerName, status, salesForceId, affFirstName, affLastName,
            billingCycle, minimumPaymentThreshold, currency, created, notes, postbackURL, email
        } = data

        //
        let affStatus = status.toLowerCase()
        // let affName = affiliateName.split(' ')
        // let affFirstName = affName[0]
        // let affLastName = affName[1]
        let affEmailTest = 'timothy.jahn@actionmediamtl.com'

        let amName = accountManagerName.split(' ')
        let amFirstName = amName[0]
        let amLastName = amName[1]
        let findAaffiliateMenager = await db.query(` 
           SELECT id FROM sfl_employees WHERE Lower(first_name) = LOWER('${amFirstName}') AND Lower(last_name) = LOWER('${amLastName}')
        `)

        console.log('findAaffiliateMenager:', findAaffiliateMenager)
        let affManagerId = findAaffiliateMenager.length !== 0 && findAaffiliateMenager[0].id || 0
        let res = {}
        if (!affManagerId) {
            // console.log(`advertiser manager ${advertiserManager} doesnot exists in DB `)
            res.error = `affiliate manager ${accountManagerName} doesnot exists in DB `
            return res
        }
        // let insertAff = await db.query(`
        //         INSERT INTO affiliates(
        //             email,
        //             first_name,
        //             last_name,
        //             payment_type,
        //             status,
        //             affiliate_type)
        //         VALUES (?,?,?,?,?,?)`, [
        //     affEmailTest, affFirstName, affLastName, 'paypal', affStatus, 'Trainee - Assistant'])
        // let affGeneratedId = insertAff.insertId
        //
        // console.log('affGeneratedId:', affGeneratedId)
        //
        let insertsflAff = await db.query(`
            INSERT INTO sfl_affiliates (
             first_name, last_name, status, affiliate_manager_id, origin_id,
             salesforce_id, payment_type, last_traffic_date, postback_url, date_added)
         VALUES (?,?,?,?,?,?,?,?,?,?)`, [
            affFirstName, affLastName, affStatus, affManagerId, affiliateIdOrigin,
            salesForceId, 'paymentType', 1615766852, 'postBackUrl', dateAdd])
        let affIdGenerated = insertsflAff.insertId
        //
        console.log('affIdGenerated:', affIdGenerated)
        console.log(`insertsflAff result:${JSON.stringify(insertsflAff)}`)
        res.id = affIdGenerated

        await db.commit()
        return res

    } catch (e) {
        console.log('uploadAffiliatesError:', e)
        let res = {}
        res.error = e.sqlMessage
        await db.rollback()
        return res
    } finally {
        await db.close()
    }


}
module.exports = {
    uploadManagers,
    uploadAdvertisers,
    uploadOffers,
    uploadAffiliates
}