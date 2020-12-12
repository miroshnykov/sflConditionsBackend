let dbMysql = require('./mysqlDb').get()

const all = async () => {

    try {
        console.time('getLp')
        let result = await dbMysql.query(` 
            SELECT  
                id, 
                name as name, 
                product_id as productId,
                forced_landing_url as forcedLandingUrl,
                static_url as staticUrl
            FROM landing_pages l 
            WHERE l.status = 'active'
        `)
        await dbMysql.end()

        console.timeEnd('getLp')
        console.log(`getLp count:${result.length}\n`)
        return result
    } catch (e) {
        console.log(e)
    }
}

const create = async (data) => {

    try {
        const {segmentId, lpId, weight} = data
        console.log(data)
        let date = new Date()
        let dateAdd = ~~(date.getTime() / 1000)
        let result = await dbMysql.query(` 
                INSERT INTO sfl_segment_landing_page (sfl_segment_id, landing_pages_id, weight, date_added) VALUES (?,?,?,?);
        `, [segmentId, lpId, weight, dateAdd])
        await dbMysql.end()

        let res = {}
        res.segmentId = segmentId || 0

        console.log(`\nCreateLp, data:{ ${JSON.stringify(data)} },  affectRows:${result.affectedRows}`)
        return res
    }
    catch (e) {
        console.log('createLpError:',e)
    }

}

const del = async (data) => {

    try {
        const {segmentId, lpId} = data
        console.log(data)
        let result = await dbMysql.query(` 
            DELETE FROM sfl_segment_landing_page WHERE  sfl_segment_id=? AND landing_pages_id=?
        `, [segmentId, lpId])
        await dbMysql.end()

        let res = {}
        res.segmentId = segmentId || 0

        console.log(`\ndelLp, data:{ ${JSON.stringify(data)} },  affectRows:${result.affectedRows}`)
        return res
    }
    catch (e) {
        console.log('deleteLpError:',e)
    }

}

module.exports = {
    all,
    create,
    del
}