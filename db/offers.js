let dbMysql = require('./mysqlDb').get()

const getOffer = async (id) => {

    try {
        let result = await dbMysql.query(` 
             SELECT id, 
                   name AS name, 
                   status AS status, 
                   payin AS payIn, 
                   payout AS payOut, 
                   conversion_type AS conversionType,
                   advertiser AS advertiser, 
                   date_added AS dateAdded
            FROM   sfl_offers 
            WHERE id = ?

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