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
            INSERT INTO sfl_advertiser (name, status, advertiser_manager_id, origin_id, website, tags,descriptions,date_added) 
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
        let findAdvMenager = await dbMysql.query(`
           SELECT * FROM sfl_advertisers WHERE name LIKE '%${advertiserName}%'

        `)
        await dbMysql.end()
        //
        let advManagerId = findAdvMenager.length !== 0 && findAdvMenager[0].id || 0
        let res = {}
        if (!advManagerId) {
            // console.log(`advertiser manager ${advertiserManager} doesnot exists in DB `)
            res.error = `advertiser manager ${advertiserName} doesnot exists in DB `
            return res
        }

        console.log(data)

        // let statusesOrigin = ['public','private','apply_to_run','inactive']
        let statusFormat = offerStatus.replace(/\s+/g, '_').toLowerCase();

        let payInFormat = Number(payIn.replace(/^\D+/g, ''))
        let payOutFormat = Number(payOut.replace(/^\D+/g, ''))
        let date = new Date()
        let dateAdd = ~~(date.getTime() / 1000)
        let result = await dbMysql.query(`
            INSERT INTO sfl_offers (
                id, name, sfl_advertiser_id, verticals, descriptions, status, conversion_type, sfl_offer_landing_page_id, 
                offer_id_redirect,  payin, payout, user, date_added)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?);
        `, [offerIdOrigin, offerName, advManagerId, verticals, descriptions || '', statusFormat, conversionType, 0,
            '777', payInFormat, payOutFormat, email, dateAdd])
        await dbMysql.end()

        console.log(`Create Offer affectRows:${result.affectedRows}, result:${JSON.stringify(data)}`)
        let insertLp = await dbMysql.query(`
            INSERT INTO sfl_offer_landing_pages (sfl_offer_id, name, url, user, date_added )
            VALUES (?,?,?,?,?)`, [offerIdOrigin, lpUrl, lpUrl, email, dateAdd])
        await dbMysql.end()
        //
        let lpId = insertLp.insertId

        let updateLpIdOffer = await dbMysql.query(`
            UPDATE sfl_offers SET sfl_offer_landing_page_id=${lpId} WHERE id=${offerIdOrigin}`)
        await dbMysql.end()

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
module.exports = {
    uploadManagers,
    uploadAdvertisers,
    uploadOffers
}