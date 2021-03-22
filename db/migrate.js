let dbGotchaMysql = require('./mysqlGotcha').get()

let dbTransaction = require('./mysqlTransaction').get()


const getOffer = async () => {

    try {
        let result = await dbGotchaMysql.query(` 
           SELECT o.Offer_id AS offerId,
                   o.name AS offerName,
                   Unix_timestamp(o.created) AS dateCreated,
                   o.Advertiser_id AS advertiserId,
                   o.OfferStatus_id AS offerStatusId,
                   o.Vertical_id AS verticalId,
                   -- o.OfferType_id AS offerTypeId,
                   -- o.Currency_id AS currencyId,
                   -- (SELECT c1.abbr
--                       FROM Currency c1
--                        WHERE c1.Currency_id =o.Currency_id ) AS convertionType,
                   -- o.OfferStatus_id,
                   (SELECT p.amount FROM OfferContract c ,Payout p WHERE p.Payout_id = c.CurrentPayout_id  AND c.Offer_id = o.Offer_id limit 1) AS payOut,
                   (SELECT p.amount FROM OfferContract c ,Payout p WHERE p.Payout_id = c.CurrentReceived_id  AND c.Offer_id = o.Offer_id limit 1) AS payIn,
                   (SELECT LOWER(s.name) FROM OfferStatus s WHERE s.OfferStatus_id = o.OfferStatus_id) AS offerStatus,
                   (SELECT c.offerLink FROM OfferContract c WHERE c.Offer_id = o.Offer_id LIMIT 1) AS offerLandingPageUrl,
                   (SELECT LOWER(p.name)  FROM PriceFormat p   WHERE p.PriceFormat_id IN (SELECT c.PriceFormat_id FROM OfferContract c WHERE c.Offer_id = o.Offer_id ) ) AS convertionType   
            FROM Offer o
            WHERE o.OfferStatus_id <>4  
            ORDER BY o.Offer_id DESC
            LIMIT 200
        `)
        await dbGotchaMysql.end()

        console.log(`\ngetVerticals count:${result.length}`)
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
            offerStatus,
            offerLandingPageUrl,
            conversionType ,
        } = data
        email = 'miroshnykov@gmail.com'
        offerStatus = offerStatus === 'apply to run' ? 'apply_to_run' : offerStatus
        conversionType = conversionType ? conversionType : 'cpi'
        offerLandingPageUrl = offerLandingPageUrl ? offerLandingPageUrl : 'google.com'

        let date = new Date()
        let dateAdd = ~~(date.getTime() / 1000)
        let result = await db.query(`
            INSERT INTO sfl_offers (
                id, name, user,payin, payout, conversion_type, sfl_advertiser_id, sfl_vertical_id, status,date_added)
            VALUES (?,?,?,?,?,?,?,?,?,?);
        `, [offerId, offerName, email,payIn,payOut,conversionType, advertiserId, verticalId, offerStatus, dateCreated])

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
        // console.log('uploadManagersError:', e)
        let res = {}
        res.error = e.sqlMessage
        await db.rollback()
        return res
    } finally {
        await db.close()
    }

}

module.exports = {
    getOffer,
    uploadOffers
}