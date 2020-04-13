let dbMysql = require('./mysqlDb').get()

const get = async (campaignId) => {

    try {
        let result = await dbMysql.query(` 
            SELECT c.name as name, 
                   t.sfl_advertiser_campaign_id as campaignId, 
                   t.geo as geo, 
                   t.platform_android as platformAndroid,                   
                   t.platform_ios as platformIos,                   
                   t.platform_windows as platformWindows,                   
                   t.source_type_sweepstakes as sourceTypeSweepstakes, 
                   t.source_type_vod as sourceTypeVod, 
                   t.cpc, 
                   t.filter_type_id as filterTypeId, 
                   t.position, 
                   t.date_added as dateAdded 
            FROM   sfl_advertiser_targeting t, 
                   sfl_advertiser_campaigns c 
            WHERE  c.id = t.sfl_advertiser_campaign_id 
                   AND t.sfl_advertiser_campaign_id = ?
                   AND t.soft_delete = false 
        `, [campaignId])
        await dbMysql.end()

        console.log(`\ngetTargeting by id ${campaignId}, ${JSON.stringify(result)} `)
        return result
    } catch (e) {
        console.log(e)
    }
}

const add = async (data) => {

    try {

        const {
            campaignId,
            position,
            geo,
            cpc,
            filterTypeId,
            user,
            platformAndroid,
            platformIos,
            platformWindows,
            sourceTypeSweepstakes,
            sourceTypeVod
        } = data

        let date = new Date()
        let dateAdd = ~~(date.getTime() / 1000)

        let result = await dbMysql.query(` 
            INSERT INTO sfl_advertiser_targeting (
                sfl_advertiser_campaign_id, 
                position, 
                geo, 
                platform_android,
                platform_ios,
                platform_windows,
                source_type_sweepstakes,
                source_type_vod,
                cpc, 
                user,
                filter_type_id, 
                date_added)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `, [
            campaignId,
            position,
            geo,
            platformAndroid,
            platformIos,
            platformWindows,
            sourceTypeSweepstakes,
            sourceTypeVod,
            cpc,
            user,
            filterTypeId,
            dateAdd
        ])
        await dbMysql.end()
        result.id = result.insertId || 0

        console.log(`addTargeting: ${JSON.stringify(data)} `)
        return result
    } catch (e) {
        console.log(e)
    }
}

const del = async (id, softDelete) => {

    try {
        let res
        if (softDelete) {
            res = await softDel(id)
        } else {
            res = await deleteCompletely(id)
        }

        return res
    } catch (e) {
        console.log(e)
    }
}


const deleteCompletely = async (id) => {

    try {

        let result = await dbMysql.query(` 
            DELETE FROM sfl_advertiser_targeting WHERE  sfl_advertiser_campaign_id=? and soft_delete = true
        `, [id])
        await dbMysql.end()

        console.log(`\ndeleteTargeting completely by id:${id} affectRows:${result.affectedRows}`)
        result.id = id
        return result
    } catch (e) {
        console.log(e)
    }
}

const softDel = async (id) => {

    try {

        let result = await dbMysql.query(` 
            UPDATE sfl_advertiser_targeting SET soft_delete=true WHERE  sfl_advertiser_campaign_id=?; 
        `, [id])
        await dbMysql.end()

        console.log(`\nsoft deleteTargeting by id:${id} affectRows:${result.affectedRows}`)
        result.id = id
        return result
    } catch (e) {
        console.log(e)
    }
}

const restoreSoftDelete = async (id) => {

    try {

        let result = await dbMysql.query(` 
            UPDATE sfl_advertiser_targeting SET soft_delete=false WHERE  sfl_advertiser_campaign_id=?; 
        `, [id])
        await dbMysql.end()

        console.log(`\nsoft deleteTargeting restore by id:${id} affectRows:${result.affectedRows}`)
        result.id = id
        return result
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    get,
    add,
    del,
    restoreSoftDelete
}