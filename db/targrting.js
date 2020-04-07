let dbMysql = require('./mysqlDb').get()

const get = async (campaignId) => {

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

const add = async (data) => {

    try {

        const {campaignId, position, geo, platform, sourceType, cpc, filterTypeId, user} = data
        let date = new Date()
        let dateAdd = ~~(date.getTime() / 1000)

        let result = await dbMysql.query(` 
            INSERT INTO sfl_advertiser_targeting (
                sfl_advertiser_campaign_id, 
                position, 
                geo, 
                platform, 
                source_type, 
                cpc, 
                user,
                filter_type_id, 
                date_added)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        `, [
            campaignId,
            position,
            geo,
            platform,
            sourceType,
            cpc,
            user,
            filterTypeId,
            dateAdd
        ])
        await dbMysql.end()
        result.id = result.insertId || 0

        console.log('addTargeting ', JSON.stringify(data))
        return result
    } catch (e) {
        console.log(e)
    }
}

const del = async (campaignId) => {

    try {
        let result = await dbMysql.query(` 
            DELETE FROM sfl_advertiser_targeting WHERE  sfl_advertiser_campaign_id=${campaignId} 
        `, [campaignId])
        await dbMysql.end()

        console.log(` deleteTargeting by id:${campaignId}  affectRows:`, result.affectedRows)
        result.id = campaignId
        return result
    } catch (e) {
        console.log(e)
    }
}


module.exports = {
    get,
    add,
    del
}