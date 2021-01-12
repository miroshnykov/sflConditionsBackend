let dbMysql = require('./mysqlDb').get()


const getLpOffers = async () => {

    try {
        let result = await dbMysql.query(` 
            SELECT lp.id, 
                   lp.sfl_offer_id   AS offerId, 
                   lp.name           AS name, 
                   lp.url            AS url, 
                   lp.status as status, 
                   lp.date_added     AS dateAdded 
            FROM   sfl_offer_landing_pages lp     
        `)
        await dbMysql.end()


        console.log(`getLpOffers count:${result.length}\n`)
        return result
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    getLpOffers,
}