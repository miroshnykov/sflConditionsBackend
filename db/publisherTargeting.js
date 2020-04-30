let dbMysql = require('./mysqlDb').get()

const get = async () => {

    try {
        let result = await dbMysql.query(` 
            SELECT 
                   t.id,
                   t.geo, 
                   t.platform_android AS platformAndroid, 
                   t.platform_ios AS platformIos, 
                   t.platform_windows AS platformWindows, 
                   t.source_type_sweepstakes AS sourceTypeSweepstakes, 
                   t.source_type_vod AS sourceTypeVod, 
                   t.cpc 
            FROM   sfl_publisher_targeting t 
        `)
        await dbMysql.end()

        console.log(`\ngetPublisherTargeting by id  ${JSON.stringify(result)} `)
        return result
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    get
}