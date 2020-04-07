let dbMysql = require('./mysqlDb').get()

const getTargeting = async (campaignId) => {

    try {
        let result = await dbMysql.query(` 
            SELECT c.name as name, 
                   t.sfl_advertiser_campaign_id as campaignId, 
                   t.geo as geo, 
                   t.platform, 
                   t.source_type as sourceType, 
                   t.cpc, 
                   t.filter_type_id as filterTypeId, 
                   t.position, 
                   t.date_added as dateAdded 
            FROM   sfl_advertiser_targeting t, 
                   sfl_advertiser_campaigns c 
            WHERE  c.id = t.sfl_advertiser_campaign_id 
                   AND t.sfl_advertiser_campaign_id = ${campaignId} 
        `)
        await dbMysql.end()

        console.log('getTargeting ', JSON.stringify(result))
        return result
    } catch (e) {
        console.log(e)
    }
}


module.exports = {
    getTargeting
}