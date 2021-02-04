let dbMysql = require('./mysqlDb').get()

const getOffer = async (id) => {

    try {
        let result = await dbMysql.query(` 
            SELECT o.id, 
                   o.name            AS name, 
                   o.status          AS status, 
                   o.payin           AS payIn, 
                   o.payout          AS payOut, 
                   o.conversion_type AS conversionType, 
                   o.advertiser      AS advertiser, 
                   o.verticals       AS verticals, 
                   o.date_added      AS dateAdded,
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
            WHERE  o.id = ?

        `,[id])
        await dbMysql.end()

        console.log('getOffer count :', result.length, ' by id:', id)
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
                   o.date_added                AS dateAdded, 
                   o.date_updated              AS dateUpdated, 
                   o.sfl_offer_landing_page_id AS defaultLandingPageId, 
                   lp.name                     AS nameLandingPage,
                   lp.url                      AS urlLandingPage,
                   (SELECT COUNT(*) FROM sfl_offer_campaigns c WHERE c.sfl_offer_id = o.id) AS countOfCampaigns 
            FROM   sfl_offers o 
                   LEFT JOIN sfl_offer_landing_pages lp 
                          ON o.sfl_offer_landing_page_id = lp.id 
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
    getOffers
}