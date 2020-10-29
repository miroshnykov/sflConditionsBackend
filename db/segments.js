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

        // let result = await dbMysql.query(`
        //     SELECT
        //         s.id,
        //         s.name AS name,
        //         s.\`status\` AS status,
        //         s.position AS position,
        //         s.date_added AS dateAddedUnixTime,
        //         FROM_UNIXTIME(s.date_added) AS dateAdded
        //     FROM sfl_segment s
        //     order by s.position ASC
        // `)
        // await dbMysql.end()

        let result = await dbMysql.query(` 
            SELECT 
                s.id,
                s.position AS position
            FROM sfl_segment s
            order by s.position ASC 
        `)
        await dbMysql.end()

        // console.log(result)
        data.reordering.map(item=>{
            console.log(item)
        })
        // console.log(`\ngetSegments ${JSON.stringify(data)} `)
        // console.log(`\ngetSegments `, data.reordering)
        return result
    } catch (e) {
        console.log(e)
    }
}



module.exports = {
    get,
    reordering
}