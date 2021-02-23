let dbMysql = require('./mysqlDb').get()
let dbTransaction = require('./mysqlTransaction').get()

const updateLandingPage = async (segmentId, landingPageId) => {

    try {
        let result = await dbMysql.query(`
            INSERT INTO sfl_segment_landing_page (sfl_segment_id, landing_pages_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE landing_pages_id = ?
        `, [segmentId, landingPageId, landingPageId])
        await dbMysql.end()
        result.id = segmentId || 0

        console.log(`updateLandingPage ${segmentId} to landingPageId ${landingPageId} affectRows:`, result.affectedRows)
        return result
    } catch (e) {
        console.log(e)
    }
}

const getSegmentCountFilters = async (id) => {

    try {
        let result = await dbMysql.query(` 
            SELECT Count(*) AS segmentRuleCount 
            FROM   (SELECT sd.segment_rule_index AS segmentRuleIndex 
                    FROM   sfl_segment_dimension sd, 
                           sfl_dimension d 
                    WHERE  sd.sfl_dimension_id = d.id 
                           AND sd.sfl_segment_id = ?
                    GROUP  BY sd.segment_rule_index 
                    ORDER  BY sd.position ASC) t1 
        `, [id])
        await dbMysql.end()

        // console.log('getSegmentCountFilters:', result)
        return result
    } catch (e) {
        console.log(e)
    }
}

const getSegment = async (id) => {

    try {
        console.time('getSegment')
        let result = await dbMysql.query(` 
            SELECT d.id as dimensionId,
                   sd.sfl_segment_id as id,
                   d.name as dimensionName,
                   sd.value as value,
                   sd.filter_type_id as filterTypeId,
                   sd.match_type_id as matchTypeId,
                   sd.user as user,
                   sd.position as position,  
                   sd.segment_rule_index as segmentRuleIndex,
                   sd.date_added as dateAdded
            FROM   sfl_segment_dimension sd, 
                   sfl_dimension d
            WHERE  sd.sfl_dimension_id = d.id AND
                   sd.sfl_segment_id = ?
            ORDER BY  sd.segment_rule_index ASC
        `, [id])
        await dbMysql.end()

        console.timeEnd('getSegment')
        console.log(`getSegment count:${result.length}`)
        // console.log('getSegment :', result)
        return result
    } catch (e) {
        console.log(e)
        return e
    }
}

const getSegmentStatus = async (id) => {

    try {
        let result = await dbMysql.query(` 
                SELECT 
                    s.name, 
                    s.status, 
                    s.is_override_product as isOverrideProduct,
                    s.date_added as dateAdded,
                    s.date_updated as dateUpdated
                FROM sfl_segment s 
                WHERE s.id = ?
        `, [id])
        await dbMysql.end()

        console.log(`getSegmentStatus :${JSON.stringify(result)}`)
        return result
    } catch (e) {
        console.log(e)
        return e
    }
}

const updateSegmentStatus = async (data) => {

    const {segmentId, name, status} = data
    try {
        let result = await dbMysql.query(` 
            UPDATE sfl_segment SET name= "${name}", status= "${status}" WHERE id=?
        `, [segmentId])
        await dbMysql.end()

        let res = {}
        res.segmentId = segmentId
        console.log(`updateSegmentStatus:${JSON.stringify(result)}`)
        return res
    } catch (e) {
        console.log('updateSegmentStatusError:', e)
    }
}

const createSegment = async (segmentName, weight, multiplier, user, status = 'inactive') => {

    try {

        let getLastPosition = await dbMysql.query(` 
            SELECT max(position) as position FROM sfl_segment
            `)
        await dbMysql.end()

        // console.log(` **** by segmentName${segmentName}, getLastPosition:`, getLastPosition)
        let newPosition = getLastPosition[0].position + 1
        // console.log(` **** by segmentName${segmentName}, newPosition ,  `, newPosition)
        let date = new Date()
        let dateAdd = ~~(date.getTime() / 1000)
        let result = await dbMysql.query(` 
                INSERT INTO sfl_segment (name, status, weight, multiplier, position, date_added) 
                VALUES (?, ?, ?, ?, ?, ?);
        `, [segmentName, status, weight, multiplier, newPosition, dateAdd])
        await dbMysql.end()

        let data = {}
        data.optiSegmentId = result.insertId || 0
        data.name = segmentName
        data.status = status
        data.weight = weight
        data.multiplier = multiplier
        data.position = newPosition
        data.events = 'inserted'
        data.user = user
        await addOptiSegmentHistory(data)

        let getSegmentIdByName = await dbMysql.query(` 
             SELECT id FROM sfl_segment o WHERE o.name = '${segmentName}'
            `)
        await dbMysql.end()
        let res = {}
        res.id = getSegmentIdByName[0].id

        console.log(`\nCreateSegment, name:{ ${segmentName} },  affectRows:${result.affectedRows}`)
        return res
    } catch (e) {
        console.log(e)
        return e
    }
}

const deleteSegment = async (segmentId, user) => {

    try {
        let segmentInfo = await dbMysql.query(` 
            select s.id, s.name,s.status, s.is_default, s.position, s.weight,s.multiplier, s.priority from sfl_segment s where s.id = ?
        `, [segmentId])
        await dbMysql.end()

        let result = await dbMysql.query(` 
            DELETE FROM sfl_segment WHERE  id=?
        `, [segmentId])
        await dbMysql.end()

        let data = {}

        data.optiSegmentId = segmentInfo[0].id
        data.name = segmentInfo[0].name
        data.weight = segmentInfo[0].weight
        data.multiplier = segmentInfo[0].multiplier
        data.user = user
        data.events = 'deleted'
        data.status = segmentInfo[0].status
        data.position = segmentInfo[0].position

        await addOptiSegmentHistory(data)

        console.log(`DeleteSegment, name:{ ${segmentInfo[0].name} }, affectRows:${result.affectedRows}`)
        let segments = await dbMysql.query(` 
            select s.position, s.id from sfl_segment s  order by s.position ASC
        `)
        await dbMysql.end()

        let count = 1
        for (const item of segments) {
            // console.log(`itemId:`,item )
            let res = await dbMysql.query(` 
                UPDATE sfl_segment SET position = ${count}  WHERE id = ${item.id}
            `)
            await dbMysql.end()

            // console.log(`Update position:${count} by id:${item.id}, affectedRows:`, res.affectedRows)
            count++
        }
        console.log(`Re-update position, last position:{ ${count} }  `)

        return result
    } catch (e) {
        console.log(e)
    }
}

const saveConditions = async (data) => {

    const {id, name, status, filters, email, isOverrideProduct} = data

    console.log(`\nsaveConditions data:${JSON.stringify(data)}`)
    let result = []
    const db = dbTransaction()
    try {
        await db.beginTransaction()


        const deleteSegmentsConditions = await db.query(`DELETE FROM sfl_segment_dimension WHERE sfl_segment_id = ?`, [id])

        console.log(`\ndeleteSegmentsConditions:${JSON.stringify(deleteSegmentsConditions)}`)
        const updateSegmentsNameStatus = await db.query(`UPDATE sfl_segment SET name= ?, status= ?, is_override_product=? WHERE id=?`, [name, status, isOverrideProduct, id])
        console.log(`\nupdateSegmentsNameStatus:${JSON.stringify(updateSegmentsNameStatus)}`)

        for (const item of filters) {
            // console.log(`Item:${JSON.stringify(item)}`)
            const {segmentId, dimensionId, value, position, segmentRuleIndex, user, filterTypeId, matchTypeId} = item
            let date = new Date()
            let dateAdded = ~~(date.getTime() / 1000)
            const filterItemResult = await db.query(`
                    INSERT INTO sfl_segment_dimension (
                        sfl_segment_id,
                        sfl_dimension_id,
                        value,
                        position,
                        segment_rule_index,
                        user,
                        filter_type_id,
                        match_type_id,
                        date_added)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
                    `, [
                segmentId,
                dimensionId,
                value,
                position,
                segmentRuleIndex,
                email,
                filterTypeId,
                matchTypeId,
                dateAdded
            ])
            console.log(`\nfilterItemResult:${JSON.stringify(filterItemResult)}`)
        }

        await db.commit()

        result.segmentId = id
        console.log(`\nSaveConditions result:`, result, `\n`)
        return result

    } catch (err) {
        console.log('saveConditionsError Rollback err:', err)
        await db.rollback()
        return result
    } finally {
        await db.close()
    }


}

module.exports = {
    getSegment,
    getSegmentStatus,
    updateSegmentStatus,
    getSegmentCountFilters,
    saveConditions,
    createSegment,
    deleteSegment,
    updateLandingPage,
}

