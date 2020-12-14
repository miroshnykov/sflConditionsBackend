let dbMysql = require('./mysqlDb').get()

const all = async () => {

    try {
        let segments = await dbMysql.query(` 
            SELECT s.id, 
                   s.name                      AS name, 
                   s.\`status\` as            status, 
                   s.position                  AS position, 
                   s.date_added                AS dateAddedUnixTime,                    
                   From_unixtime(s.date_added) AS dateAdded 
            FROM   sfl_segment s 
            ORDER  BY s.position ASC 
        `)
        await dbMysql.end()

        let lp = []

        let ids = ''
        for (const segment of segments) {
            ids += segment.id + ','
            lp.push(segment)
        }
        let idsString = ids.slice(0, -1)

        let lpList = await dbMysql.query(`
            SELECT 
                sl.id as id,
                sl.sfl_segment_id as segmentId, 
                sl.landing_pages_id as lpId,
                l.name as name, 
                sl.weight as weight 
            from sfl_segment_landing_page sl , landing_pages l
            WHERE l.id = sl.landing_pages_id AND sl.sfl_segment_id IN (${idsString})
        `)
        await dbMysql.end()


        let segmentLp = []
        for (const segment of segments) {
            let sLp = lpList.filter(item => (item.segmentId === segment.id))
            segment.lp = sLp
            segmentLp.push(segment)
        }

        console.log(`\ngetSegments ${JSON.stringify(segmentLp)} `)
        return segmentLp
    } catch (e) {
        console.log(e)
    }
}

const create = async (data) => {

    let {name, user} = data

    let date = new Date()
    let dateAdd = ~~(date.getTime() / 1000)

    try {

        let maxPosition = await dbMysql.query(` 
        SELECT MAX(s.position) maxPosition FROM sfl_segment s
        `)
        await dbMysql.end()

        let position = maxPosition[0].maxPosition + 1

        let result = await dbMysql.query(` 
            INSERT INTO sfl_segment (name,user, position, date_added) VALUES (?,?,?,?);
        `, [name, user, position, dateAdd])
        await dbMysql.end()
        result.id = result.insertId || 0

        console.log(`\ncreate segment ${JSON.stringify(result)} `)
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

const deleteSegment = async (id) => {

    try {
        let result = await dbMysql.transaction()
            .query(`DELETE FROM sfl_segment_landing_page WHERE sfl_segment_id=${id} `)
            .query(`DELETE FROM sfl_segment WHERE id=${id}`)
            .commit()

        console.log(`deleteSegment id ${id} affectRows:${JSON.stringify(result)}`)

        let segments = await dbMysql.query(` 
            SELECT 
                s.id,
                s.position AS position
            FROM sfl_segment s
            order by s.position ASC 
        `)
        await dbMysql.end()
        let count = 0
        for (const item of segments) {
            // console.log(`new position:${count} item:`,item)

            let updPosition = await dbMysql.query(` 
                UPDATE sfl_segment SET position=${count} WHERE id=${item.id} 
            `)
            console.log(`update id ${item.id} to position ${count} affectRows:${updPosition.affectedRows}`)
            await dbMysql.end()
            count++
        }

        result.id = id
        return result
    } catch (e) {
        console.log(e)
        return e
    }
}


module.exports = {
    all,
    create,
    deleteSegment,
    reordering
}