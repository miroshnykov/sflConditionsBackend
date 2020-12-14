let dbMysql = require('./mysqlDb').get()

const getSegments1 = async (status) => {

    try {

        console.time("getSegments")
        let result = await dbMysql.query(` 
            SELECT s.name                                      AS name, 
                   s.id                                        AS id, 
                   s.status, 
                   s.position                                  AS position, 
                   s.weight                                    AS weight, 
                   s.multiplier                                AS multiplier, 
                   u.name                                      AS userName, 
                   CASE 
                     WHEN (SELECT Count(*) COUNT 
                           FROM   sfl_segment_dimension sd 
                           WHERE  sd.sfl_segment_id = s.id) > 0 THEN 0 
                     ELSE 1 
                   end                                         AS existRecords, 
                   (SELECT Count(*) COUNT 
                    FROM   sfl_segment_dimension sd 
                    WHERE  sd.sfl_segment_id = s.id)          AS countConditions, 
                   (SELECT Count(*) COUNT 
                    FROM   sfl_sales_archive a 
                    WHERE  a.segment_id = s.id)                AS countSales, 
                   (SELECT Count(*) COUNT 
                    FROM   sfl_sales_archive a 
                    WHERE  a.segment_id = s.id 
                           AND a.transfer_moneybadger = 'Yes') AS 
                   countSalesTransferToMonebadger, 
                   (SELECT Count(*) COUNT 
                    FROM   sfl_sales_archive a 
                    WHERE  a.segment_id = s.id 
                           AND a.transfer_moneybadger = 'No')  AS countSalesToArhive 
            FROM   sfl_segment s, 
                   sfl_segment_history h, 
                   sfl_users u 
            WHERE  s.status = '${status}' 
                   AND s.id = h.sfl_segment_id 
                   AND h.events = 'inserted' 
                   AND u.email = h.user 
            ORDER  BY s.position DESC 
        `)
        await dbMysql.end()


        let segmentsHistory = []
        for (const item of result) {
            let history = await dbMysql.query(`
               select
                    u.name as userName,
                    h.name as segmentName,
                    h.sfl_segment_id as segmentId,
                    h.events,
                    h.weight,
                    h.multiplier,
                    h.date_added as dateAdded
                from sfl_segment_history h, sfl_users u
                where u.email = h.user and  h.sfl_segment_id = ${item.id}
                ORDER BY h.date_added DESC
            `)
            await dbMysql.end()

            let statsSales = await dbMysql.query(` 
                SELECT 
                    affiliate_id as affiliateId,
                    units as units,
                    cost_per_unit as costPerUnit,
                    program_id as programId,
                    campaign_id as campaignId, 
                    payment_id as paymentId, 
                    payout_id as payoutId,
                    date_added as dateAdded,
                    sfl_date_added as optiDateAdded,
                    multiplier as multiplier,
                    lid as lid,
                    segment_name as segmentName,
                    segment_id as segmentId,
                    segment_resolve_info as segmentResolveInfo,
                    transfer_moneybadger as transferMoneybadger
                FROM sfl_sales_archive
                WHERE segment_id = ${item.id}
             `)
            await dbMysql.end()

            let segmentConditions = await dbMysql.query(`
                SELECT d.id as dimensionId,
                       sd.sfl_segment_id as id,
                       d.name as dimensionName,
                       sd.value as value,
                       sd.filter_type_id as filterTypeId,
                       sd.match_type_id as matchTypeId,
                       sd.user as user,
                       sd.id as ruleId,
                       u.name as userName,
                       sd.position as position,
                       sd.segment_rule_index as segmentRuleIndex,
                       sd.date_added as dateAdded
                FROM   sfl_segment_dimension sd,
                       sfl_dimension d,
                       sfl_users u
                WHERE  sd.sfl_dimension_id = d.id AND
                       u.email = sd.user  AND
                       sd.sfl_segment_id = ?
                ORDER BY  sd.segment_rule_index ASC
            `, [item.id])
            await dbMysql.end()

            item.conditions = segmentConditions
            item.history = history
            item.history = history
            item.statsSales = statsSales
            segmentsHistory.push(item)

        }

        console.timeEnd("getSegments")
        console.log(`getSegments count:${segmentsHistory.length}\n`)
        return segmentsHistory
    } catch (e) {
        console.log(e)
    }
}

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

const updatePositionSegments = async (oldPosition, oldId, event) => {


    try {
        console.log('oldPosition', oldPosition)
        console.log('oldId', oldId)
        console.log('event', event)

        let getIdByNewPosition
        if (event === 'up') {
            getIdByNewPosition = await dbMysql.query(` 
                 SELECT id, position 
                 FROM   sfl_segment 
                 WHERE  position = (SELECT Min(position) 
                              FROM   sfl_segment 
                              WHERE  position > ${oldPosition}
                                     AND status = 'active') 
            `)
            await dbMysql.end()
        } else {
            getIdByNewPosition = await dbMysql.query(` 
                 SELECT id, position 
                 FROM   sfl_segment 
                 WHERE  position = (SELECT Max(position) 
                              FROM   sfl_segment 
                              WHERE  position < ${oldPosition}
                                     AND status = 'active') 
            `)
            await dbMysql.end()
        }


        let newId = getIdByNewPosition && getIdByNewPosition[0].id
        let newPosition = getIdByNewPosition && getIdByNewPosition[0].position
        console.log('newId:', newId)
        console.log('newPosition:', newPosition)
        if (!newId || !newPosition) {
            console.log('\n  *** Not able to find new Id and new position to updatePosition iin segments  ')
            return
        }

        let res = await dbMysql.transaction()
            .query(`
                UPDATE sfl_segment SET position = ${newPosition}  WHERE id = ${oldId}`)
            .query(`
                UPDATE sfl_segment SET position = ${oldPosition}  WHERE id = ${newId}`)
            .commit()

        // console.log(' updatePositionSegments New position  affectRows:', res[0])
        // console.log(' updatePositionSegments Old position  affectRows:', res[1])
        return res[0]

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
                SELECT s.name, s.status, s.date_added as dateUpdated
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

const updateSegment = async (segmentId, segmentName, weight, multiplier, user) => {

    try {
        let result = await dbMysql.query(` 
            UPDATE sfl_segment SET name= "${segmentName}", weight= ${weight}, multiplier=${multiplier} WHERE  id=?
        `, [segmentId])
        await dbMysql.end()

        let data = {}

        data.optiSegmentId = segmentId
        data.name = segmentName
        data.weight = weight
        data.multiplier = multiplier
        data.user = user
        data.events = 'updated'
        data.status = 'active'
        data.position = 0

        await addOptiSegmentHistory(data)

        console.log(`\nUpdateSegment:{ ${segmentId} } to name { ${segmentName} } with weight: { ${weight} },  multiplier: { ${multiplier} } affectRows:`, result.affectedRows)
        return result
    } catch (e) {
        console.log(e)
    }
}

const updateStatusSegment = async (segmentId, status) => {

    try {
        let result = await dbMysql.query(` 
            UPDATE sfl_segment SET status='${status}' WHERE id=?
        `, [segmentId])
        await dbMysql.end()


        console.log(`updateStatusSegment ${segmentId} to status ${status} affectRows:`, result.affectedRows)
        return result
    } catch (e) {
        console.log(e)
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

const createSegmentCondition = async (data) => {

    // console.log('createSegmentCondition:', data)
    let {
        segmentId,
        dimensionId,
        value,
        position,
        segmentRuleIndex,
        filterTypeId,
        matchTypeId,
        user,
        dateAdded
    } = data

    // dateAdded = new Date(dateAdded * 1000)
    try {
        let result = await dbMysql.query(` 
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
            user,
            filterTypeId,
            matchTypeId,
            dateAdded
        ])
        await dbMysql.end()

        let data = {}

        data.optSsegmentDimensionId = result.insertId || 0
        data.segmentId = segmentId
        data.dimensionId = dimensionId
        data.value = value
        data.position = position
        data.segmentRuleIndex = segmentRuleIndex
        data.user = user
        data.event = 'inserted'
        // await addOptiSegmentDimensionHistoryRecord(data)
        // console.log(' createSegmentCondition affectRows:', result.affectedRows)
        return result
    } catch (e) {
        console.log(e)
    }
}

// for api
const createRule = async (data) => {

    let {
        segmentId,
        dimensionId,
        value,
        user,
        orAndCondition,
        filterTypeId
    } = data


    if (orAndCondition === 'OR'
        || orAndCondition === 'AND'
        || orAndCondition === undefined
    ) {
    } else {
        throw new Error('Wrong OR And Condition ')
    }

    let segmentInfo = await dbMysql.query(` 
            SELECT  max(position) as position,
                    max(c.segment_rule_index) as segment_rule_index 
            FROM sfl_segment_dimension c 
            WHERE c.sfl_segment_id = ?
        `, [segmentId])
    await dbMysql.end()


    // console.log('segmentInfo:', segmentInfo)
    let segmentRuleIndex
    let position
    if (segmentInfo[0].position === null) {
        position = 0
        segmentRuleIndex = 0
    } else {
        position = Number(segmentInfo[0].position) + 1
        if (orAndCondition === 'OR') {
            segmentRuleIndex = Number(segmentInfo[0].segment_rule_index)
        } else
            segmentRuleIndex = Number(segmentInfo[0].segment_rule_index) + 1
    }

    let matchTypeId = 0
    try {
        let result = await dbMysql.query(` 
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
            VALUES (?, ?, ?, ?, ?, ?, ?, ?,UNIX_TIMESTAMP());
        `, [
            segmentId,
            dimensionId,
            value,
            position,
            segmentRuleIndex,
            user,
            filterTypeId,
            matchTypeId
        ])
        await dbMysql.end()

        let data = {}

        data.optSsegmentDimensionId = result.insertId || 0
        data.segmentId = segmentId
        data.dimensionId = dimensionId
        data.value = value
        data.position = position
        data.segmentRuleIndex = segmentRuleIndex
        data.user = user
        data.event = 'inserted'
        result.ruleId = result.insertId || 0
        await addOptiSegmentDimensionHistoryRecord(data)
        console.log(' createRule affectRows:', result.affectedRows)
        return result
    } catch (e) {
        console.log(e)
        return e
    }
}

// for api
const deleteRule = async (ruleId) => {

    try {
        let findSegmentinfo = await dbMysql.query(` 
            SELECT c.sfl_segment_id as segmentId, segment_rule_index as segmentRuleIndex FROM sfl_segment_dimension c WHERE c.id = ?
        `, [ruleId])
        await dbMysql.end()

        if (findSegmentinfo.length === 0) {
            throw new Error('No segmentId in DB')
        }
        let segmentId = findSegmentinfo[0].segmentId
        let segmentRuleIndex = findSegmentinfo[0].segmentRuleIndex

        // throw new Error('--stop--')
        let result = await dbMysql.query(`
            DELETE FROM sfl_segment_dimension WHERE id=?
        `, [ruleId])
        await dbMysql.end()

        console.log(` deleteRule ruleId:${ruleId},  affectRows:`, result.affectedRows)

        let conditionsBySegment = await dbMysql.query(` 
            SELECT id, segment_rule_index, value, position  
            FROM sfl_segment_dimension c 
            WHERE c.sfl_segment_id = ? 
            ORDER BY c.segment_rule_index ASC, c.position
        `, [segmentId])
        await dbMysql.end()

        let segmentRuleIndexFind = conditionsBySegment.filter(item => (item.segment_rule_index === segmentRuleIndex))

        if (segmentRuleIndexFind.length === 0) {
            conditionsBySegment.forEach(item => {
                if (item.segment_rule_index > segmentRuleIndex) {
                    item.segment_rule_index = item.segment_rule_index - 1
                }
            })
        }
        let positionNew = 0
        conditionsBySegment.forEach(item => {
            item.position = positionNew
            positionNew++
        })
        console.log('UPDATE POSITION AND Rule Index ', conditionsBySegment)
        // recalculate posititon and segment_rule_index
        for (const item of conditionsBySegment) {
            await dbMysql.transaction()
                .query(`
                    UPDATE sfl_segment_dimension 
                    SET position = ${positionNew},segment_rule_index = ${item.segment_rule_index} 
                    WHERE id=${item.id}`)
                .commit()
        }
        let res = {}
        res.ruleId = ruleId
        return ruleId
    } catch (e) {
        console.log(e)
        return e
    }
}

const deleteSegmentCondition = async (segmentId, position) => {

    try {
        let result = await dbMysql.query(` 
            DELETE FROM sfl_segment_dimension WHERE sfl_segment_id = ? and position = ?
        `, [segmentId, position])
        await dbMysql.end()

        console.log(' deleteSegmentCondition affectRows:', result.affectedRows)
        return result
    } catch (e) {
        console.log(e)
        return e
    }
}

const deleteSegmentConditions = async (segmentId) => {

    try {
        let result = await dbMysql.query(` 
            DELETE FROM sfl_segment_dimension WHERE sfl_segment_id = ? 
        `, [segmentId])
        await dbMysql.end()

        // console.log(' deleteSegmentConditions affectRows:', result.affectedRows)
        return result
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    getSegment,
    getSegments1,
    getSegmentStatus,
    updateSegmentStatus,
    updatePositionSegments,
    getSegmentCountFilters,
    createSegment,
    createSegmentCondition,
    createRule,
    deleteRule,
    deleteSegmentCondition,
    deleteSegmentConditions,
    deleteSegment,
    updateLandingPage,
    updateSegment,
    updateStatusSegment
}

