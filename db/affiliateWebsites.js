let dbMysql = require('./mysqlDb').get()

const getAffiliateWebsites = async () => {

    try {
        let result = await dbMysql.query(` 
            SELECT w.id AS id, 
                   w.link AS link, 
                   w.status AS status, 
                   w.affiliate_id AS affiliateId
            FROM   affiliate_websites w, 
                   affiliates a 
            WHERE  a.id = w.affiliate_id 
                   AND w.status IN ( 'active', 'pending' ) 
                   AND a.status = 'active' 
                   AND a.salesforce_id <> 0                   
        `)
        await dbMysql.end()
        console.log(`\ngetAffiliateWebsites count: ${result.length}`)
        return result
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    getAffiliateWebsites,
}