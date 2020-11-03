let dbMysql = require('./mysqlDb').get()

const get = async (campaignId) => {

    try {
        let result = await dbMysql.query(` 
            SELECT 
                s.id,
                s.name AS name,
                s.\`status\` AS status,
                s.position AS position,
                s.date_added AS dateAddedUnixTime,
                FROM_UNIXTIME(s.date_added) AS dateAdded
            FROM sfl_segment s
            order by s.position ASC 
        `)
        await dbMysql.end()

        console.log(`\ngetSegments ${JSON.stringify(result)} `)
        return result
    } catch (e) {
        console.log(e)
    }
}

const reordering = async (data) => {

    try {

        for (const item of data.reordering) {
            let update = await dbMysql.query(`
            UPDATE sfl_segment SET position=${item.position} WHERE id=${item.id}
             
        `)
            await dbMysql.end()
            console.log(`Updated Id:${item.id} to position:${item.position} `)
        }

        let result = await dbMysql.query(` 
            SELECT 
                s.id,
                s.position AS position
            FROM sfl_segment s
            order by s.position ASC 
        `)
        await dbMysql.end()

        return result
    } catch (e) {
        console.log(e)
    }
}



module.exports = {
    get,
    reordering
}