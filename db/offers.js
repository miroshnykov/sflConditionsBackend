let dbMysql = require('./mysqlDb').get()

const getOffer = async (id) => {

    try {
        let result = await dbMysql.query(` 
            SELECT o.id, 
                   o.name            AS name, 
                   o.status          AS status, 
                   o.payin           AS payIn, 
                   o.payout          AS payOut, 
                   o.advertiser_manager_id AS advertiserManagerId,
                   o.conversion_type AS conversionType,
                   o.currency_id     AS currencyId,
                   a.name            AS advertiserName,
                   a.id              AS advertiserId,                   
                   v.id AS verticalId,
                   v.name AS verticalName,
                   o.descriptions    AS descriptions, 
                   o.date_added      AS dateAdded,
                   o.is_cpm_option_enabled     AS isCpmOptionEnabled,
                   o.payout_percent            AS payoutPercent,                    
                   o.sfl_offer_landing_page_id AS defaultLp,
                   lp.url                    AS defaultLpUrl,                 
                   o.offer_id_redirect AS offerIdRedirect,
                   g.rules           AS geoRules, 
                   clp.rules         AS customLPRules                    
            FROM   sfl_offers o 
                   left join sfl_offer_landing_pages lp 
                          ON lp.id = o.sfl_offer_landing_page_id             
                   LEFT JOIN sfl_offer_geo g 
                          ON g.sfl_offer_id = o.id 
                   LEFT JOIN sfl_offer_custom_landing_pages clp 
                          ON clp.sfl_offer_id = o.id 
                   left join sfl_advertisers a 
                          ON a.id = o.sfl_advertiser_id   
                   left join sfl_vertical v 
                          ON v.id = o.sfl_vertical_id                             
            WHERE  o.id = ?
        `, [id])
        await dbMysql.end()

        console.log('getOffer count :', result.length, ' by id:', id)
        return result.length !==0 && result[0] || {}
    } catch (e) {
        console.log(e)
    }
}

const getOfferHistory = async (id) => {

    try {
        let result = await dbMysql.query(` 
            SELECT h.id as id,
                   h.sfl_offer_id AS sflOfferId,
                   h.user AS user,
                   h.date_added AS dateAdded,
                   h.action AS action,
                   h.logs AS logs
            FROM sfl_offers_history h
            WHERE h.sfl_offer_id =?
            ORDER BY  h.date_added desc
            LIMIT 25
        `, [id])
        await dbMysql.end()

        console.log('getOffer history count :', result.length, ' by id:', id)
        return result
    } catch (e) {
        console.log(e)
    }
}

const getOffers = async () => {

    try {
        console.time('getOffers')
        let result = await dbMysql.query(` 
            SELECT o.id                        AS id, 
                   o.name                      AS name, 
                   o.status                    AS status, 
                   o.payin                     AS payIn, 
                   o.payout                    AS payOut, 
                   o.advertiser_manager_id     AS advertiserManagerId,
                   a.id                        AS advertiserId,
                   a.name                      AS advertiserName,  
                   v.id                        AS verticalId,
                   v.name                      AS verticalName,  
                   o.currency_id               AS currencyid,                
                   o.date_added                AS dateAdded, 
                   o.date_updated              AS dateUpdated, 
                   o.is_cpm_option_enabled     AS isCpmOptionEnabled,
                   o.payout_percent            AS payoutPercent,                   
                   o.sfl_offer_landing_page_id AS defaultLandingPageId, 
                   lp.name                     AS nameLandingPage,
                   lp.url                      AS urlLandingPage,
                   (SELECT COUNT(*) FROM sfl_offer_campaigns c WHERE c.sfl_offer_id = o.id) AS countOfCampaigns 
            FROM   sfl_offers o 
                   LEFT JOIN sfl_offer_landing_pages lp 
                          ON o.sfl_offer_landing_page_id = lp.id 
                   left join sfl_advertisers a 
                          ON a.id = o.sfl_advertiser_id     
                   left join sfl_vertical v 
                          ON v.id = o.sfl_vertical_id                          
            ORDER  BY o.date_updated  DESC     
        `)
        await dbMysql.end()

        console.timeEnd('getOffers')

        console.log(`getOffers count:${result.length}`)
        return result
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    getOffer,
    getOffers,
    getOfferHistory
}