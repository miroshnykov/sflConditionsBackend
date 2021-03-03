let dbMysql = require('./mysqlDb').get()

const getCampaign = async (affiliateId) => {

    try {
        let result = await dbMysql.query(` 
            SELECT id, name FROM campaigns WHERE affiliate_id ="${affiliateId}"
        `)
        await dbMysql.end()

        console.log('getCampaign count :', result.length, ' by affiliateId:', affiliateId)
        return result
    } catch (e) {
        console.log(e)
    }
}

const getCampaigns = async () => {

    try {
        console.time('getCampaigns')
        let result = await dbMysql.query(` 
            SELECT c.id           AS id, 
                   c.NAME         AS name, 
                   c.affiliate_id AS affiliateId 
            FROM   campaigns c, 
                   affiliates a 
            WHERE  a.id = c.affiliate_id 
                   AND c.status = 'active' 
                   AND a.status in ('active','suspended')
                   AND a.salesforce_id <> 0         
        `)
        await dbMysql.end()

        console.timeEnd('getCampaigns')
        console.log(`getCampaigns count:${result.length}\n`)
        return result
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    getCampaign,
    getCampaigns
}
