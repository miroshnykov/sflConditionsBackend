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
                   o.date_added      AS dateAdded,
                   o.sfl_offer_landing_page_id AS defaultLp, 
                   o.offer_id_redirect AS offerIdRedirect,
                   g.rules           AS geoRules, 
                   clp.rules         AS customLPRules                    
            FROM   sfl_offers o 
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
            SELECT id as id, 
                   name as name,
                   status as status,
                   payin as payIn,
                   payout as payOut 
            FROM sfl_offers       
        `)
        await dbMysql.end()

        console.timeEnd('getOffers')

        console.log(`getOffers count:${result.length}\n`)
        return result
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    getOffer,
    getOffers
}