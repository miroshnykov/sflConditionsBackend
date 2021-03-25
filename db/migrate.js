let dbGotchaMysql = require('./mysqlGotcha').get()

let dbTransaction = require('./mysqlTransaction').get()
let dbMysql = require('./mysqlDb').get()

const getCotchaAffiliates = async () => {
    try {
        let result = await dbGotchaMysql.query(` 
            SELECT a.Affiliate_id AS affiliateId,
                   a.name AS affiliateName,
                   a.accountManagerContactId AS accountManagerContactId,
                   (SELECT LOWER(s.name) FROM AccountStatus s WHERE s.AccountStatus_id = a.AccountStatus_id) AS statusName,
                   Unix_timestamp(a.created) AS dateAdded
            FROM Affiliate a
            ORDER BY 1 ASC
            LIMIT 7000
        `)
        await dbGotchaMysql.end()

        console.log(`\ngetCotchaAffiliates count:${result.length}`)
        return result
    } catch (e) {
        console.log(e)
    }
}

const getOffer = async () => {

    try {
        let result = await dbGotchaMysql.query(` 
            SELECT o.Offer_id AS offerId,
                    o.name AS offerName,
                    Unix_timestamp(o.created) AS dateCreated,
                    o.Advertiser_id AS advertiserId,
                    o.OfferStatus_id AS offerStatusId,
                    o.Vertical_id AS verticalId,
                    o.Currency_id AS currencyId,
                    (SELECT p.amount FROM OfferContract c ,Payout p WHERE p.Payout_id = c.CurrentPayout_id  AND c.Offer_id = o.Offer_id limit 1) AS payOut,
                    (SELECT p.amount FROM OfferContract c ,Payout p WHERE p.Payout_id = c.CurrentReceived_id  AND c.Offer_id = o.Offer_id limit 1) AS payIn,
                    (SELECT LOWER(s.name) FROM OfferStatus s WHERE s.OfferStatus_id = o.OfferStatus_id) AS offerStatus,
                    (SELECT c.offerLink FROM OfferContract c WHERE c.Offer_id = o.Offer_id LIMIT 1) AS offerLandingPageUrl,
                    (SELECT LOWER(p.name)  FROM PriceFormat p   WHERE p.PriceFormat_id IN (SELECT c.PriceFormat_id FROM OfferContract c WHERE c.Offer_id = o.Offer_id ) ) AS convertionType   
            FROM Offer o
            WHERE o.OfferStatus_id <>4 
            ORDER BY o.Offer_id ASC
            LIMIT 200
        `)
        await dbGotchaMysql.end()

        console.log(`\ngetOffer count:${result.length}`)
        return result
    } catch (e) {
        console.log(e)
    }
}

const uploadOffers = async (data) => {

    // console.log('Data:', data)
    let res = {}

    const db = dbTransaction()
    try {
        await db.beginTransaction()
        let {
            offerId,
            email,
            offerName,
            dateCreated,
            advertiserId,
            verticalId,
            payOut,
            payIn,
            currencyId,
            offerStatus,
            offerLandingPageUrl,
            conversionType,
        } = data
        email = 'miroshnykov@gmail.com'
        offerStatus = offerStatus === 'apply to run' ? 'apply_to_run' : offerStatus
        conversionType = conversionType ? conversionType : 'cpi'
        offerLandingPageUrl = offerLandingPageUrl ? offerLandingPageUrl : 'google.com'
        payIn = payIn && payIn || 0
        payOut = payOut && payOut || 0
        currencyId = currencyId && currencyId || 1
        let date = new Date()
        let dateAdd = ~~(date.getTime() / 1000)
        let result = await db.query(`
            INSERT INTO sfl_offers (
                id, name, user,payin, payout, conversion_type,currency_id,sfl_advertiser_id, sfl_vertical_id, status,date_added)
            VALUES (?,?,?,?,?,?,?,?,?,?,?);
        `, [offerId, offerName, email, payIn, payOut, conversionType, currencyId, advertiserId, verticalId, offerStatus, dateCreated])

        // console.log(`Create Offer affectRows:${result.affectedRows}, result:${JSON.stringify(data)}`)
        let insertLp = await db.query(`
            INSERT INTO sfl_offer_landing_pages (sfl_offer_id, name, url, user, date_added )
            VALUES (?,?,?,?,?)`, [offerId, offerLandingPageUrl, offerLandingPageUrl, email, dateAdd])
        //
        let lpId = insertLp.insertId

        let updateLpIdOffer = await db.query(`
            UPDATE sfl_offers SET sfl_offer_landing_page_id=${lpId} WHERE id=${offerId}`)

        // console.log(`updateLpIdOffer result:${JSON.stringify(updateLpIdOffer)}`)

        await db.commit()
        res.id = offerId
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

    // console.log('Data:', data)
    let res = {}
    const db = dbTransaction()
    try {
        await db.beginTransaction()
        let {
            affiliateId,
            affiliateName,
            accountManagerContactId,
            statusName,
            dateAdded
        } = data
        let defaultAffiliateManagerId = 9999
        accountManagerContactId = accountManagerContactId && accountManagerContactId || defaultAffiliateManagerId
        let date = new Date()
        let dateAdd = ~~(date.getTime() / 1000)
        let result = await db.query(`
            INSERT INTO sfl_affiliates (id, name, status, affiliate_manager_id, date_added) VALUES (?,?,?,?,?)            
        `, [affiliateId, affiliateName, statusName, accountManagerContactId, dateAdded])


        await db.commit()
        res.id = affiliateId
        // console.log(`\nCreate advertiser:{ ${JSON.stringify(data)} },  affectRows:${result.affectedRows}`)
        return res

    } catch (e) {
        // console.log('uploadAffiliatesError:', e)
        let res = {}
        res.error = e.sqlMessage
        await db.rollback()
        return res
    } finally {
        await db.close()
    }

}

const getCampaigns = async () => {

    try {
        let result = await dbGotchaMysql.query(` 
            SELECT c.Campaign_id AS campaignId,
                   CONCAT('Campaign-', c.Campaign_id, '-aff-', c.Affiliate_id) AS campaignName,
                   c.Offer_id AS offerId,
                   c.Affiliate_id AS affiliateId,
                   c.Currency_id AS currencyId,           
                   (SELECT p.amount FROM OfferContract o, Payout p WHERE p.Payout_id = o.CurrentPayout_id AND c.Offer_id = o.Offer_id
               LIMIT 1) AS payOut,
                   c.OfferContract_id AS offerContractId,
                   c.AccountStatus_id AS campaignStatus,            
                   (SELECT LOWER(a.name) FROM AccountStatus a WHERE a.AccountStatus_id = c.AccountStatus_id) AS campaignStatus,            
                   (SELECT p.name FROM PriceFormat p WHERE p.PriceFormat_id =c.PriceFormat_id ) AS convertionType,
                   Unix_timestamp(c.created) AS dateAdded
            FROM Campaign c
            WHERE c.AccountStatus_id = 1 AND c.Offer_id in (2,144,147,148,149,150,436,440,613,841,952,956,1050,1156,1186,1187,1239,1434,1441,1445,1509,1549,1568,1606,1664)
            ORDER BY c.Campaign_id ASC
            LIMIT 200
        `)
        await dbGotchaMysql.end()

        console.log(`\ngetCampaigns count:${result.length}`)
        return result
    } catch (e) {
        console.log(e)
    }
}

const uploadCampaigns = async (data) => {

    // console.log('Data:', data)

    // campaignId: 107,
    //     campaignName: 'Campaign-107-aff-124',
    //     offerId: 6,
    //     affiliateId: 124,
    //     currencyId: 1,
    //     payOut: 23,
    //     offerContractId: 9,
    //     campaignStatus: 'active',
    //     convertionType: 'CPA',
    //     dateAdded: 1460137305


    let res = {}
    const db = dbTransaction()
    try {
        await db.beginTransaction()
        let {
            campaignId,
            campaignName,
            offerId,
            currencyId,
            payOut,
            campaignStatus,
            affiliateId,
            dateAdded
        } = data
        let date = new Date()
        let dateAdd = ~~(date.getTime() / 1000)
        let result = await db.query(`
           INSERT INTO sfl_offer_campaigns (id, name, sfl_offer_id, affiliate_id, payout, currency_id,status, date_added)
           VALUES (?,?,?,?,?,?,?,?);            
        `, [campaignId, campaignName, offerId, affiliateId, payOut, currencyId, campaignStatus, dateAdded])


        await db.commit()
        res.id = campaignId
        // console.log(`\nCreate advertiser:{ ${JSON.stringify(data)} },  affectRows:${result.affectedRows}`)
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

const updateEmailAffiliates = async (data) => {

    let res = {}
    const db = dbTransaction()
    try {
        await db.beginTransaction()
        let {
            email,
            id
        } = data
        let date = new Date()
        let dateAdd = ~~(date.getTime() / 1000)
        let result = await db.query(`
           UPDATE sfl_affiliates SET email=? WHERE  id=?            
        `, [email, id])

        await db.commit()
        res.id = id
        return res

    } catch (e) {
        console.log('updateEmailAffiliatesError:', e)
        let res = {}
        res.error = e.sqlMessage
        await db.rollback()
        return res
    } finally {
        await db.close()
    }

}

const updateEmailAffiliates2 = async (data) => {

    let res = {}
    try {
        let {
            email,
            id
        } = data

        let result = await dbMysql.query(` 
            UPDATE sfl_affiliates SET email=${email} WHERE  id=${id}
        `)
        await dbMysql.end()

        res.id = id
        return res

    } catch (e) {
        console.log('updateEmailAffiliatesError:', e)
        let res = {}
        res.error = e.sqlMessage

        return res
    }
}


module.exports = {
    getOffer,
    uploadOffers,
    getCotchaAffiliates,
    uploadAffiliates,
    getCampaigns,
    uploadCampaigns,
    updateEmailAffiliates,
    updateEmailAffiliates2
}