let dbMysql = require('./mysqlDb').get()

const getAffiliates = async () => {

    try {
        console.time('getAffilates')
        let result = await dbMysql.query(` 
            SELECT a.id AS id,
                   CONCAT(first_name, ' ', last_name) AS name,
                   a.country_code AS countryCode
            FROM affiliates a
            WHERE a.status in ('active', 'suspended')
              AND a.salesforce_id <> 0
              AND country_code != ''
            UNION
            SELECT a.id AS id,
                   CONCAT(first_name, ' ', last_name) AS name,
                   a.country_code AS countryCode
            FROM affiliates a
            WHERE a.email LIKE ('%timothy%')
            ORDER BY ID ASC
        `)
        await dbMysql.end()

        console.timeEnd('getAffilates')
        console.log(`getAffilates count:${result.length}\n`)
        return result
    } catch (e) {
        console.log(e)
    }
}

const getAffiliatesByFilter = async (filter) => {

    try {
        console.time('getAffiliatesByFilter')
        let result = await dbMysql.query(` 
            SELECT a.id AS id,
                   CONCAT(first_name, ' ', last_name) AS name,
                   a.country_code AS countryCode
            FROM affiliates a
            WHERE a.status = 'active'
              AND (a.id LIKE'%${filter}%' OR a.first_name LIKE '%${filter}%' OR a.last_name LIKE '%${filter}%')
        `)
        await dbMysql.end()

        console.timeEnd('getAffiliatesByFilter')
        console.log(`getAffiliatesByFilter count:${result.length}\n`)
        return result
    } catch (e) {
        console.log(e)
    }
}

const getAffiliatesBySegmentId = async (segmentId) => {

    try {
        console.time('getAffiliatesBySegmentId')
        let result = await dbMysql.query(` 
            SELECT a.id                               AS id,
                   Concat(first_name, ' ', last_name) AS name,
                   a.country_code                     AS countryCode
            FROM   affiliates a
            WHERE  a.id IN (SELECT Substr(value, 1, Position("/" IN value) - 1) AS affId
                            FROM   sfl_segment_dimension d
                            WHERE  d.sfl_segment_id IN ( '${segmentId}' )
                                   AND d.sfl_dimension_id IN ( 3, 5 )
                            UNION
                            SELECT value AS affId
                            FROM   sfl_segment_dimension d
                            WHERE  d.sfl_segment_id IN ( '${segmentId}' )
                                   AND d.sfl_dimension_id IN ( 1 )) 
        `)
        await dbMysql.end()

        console.timeEnd('getAffiliatesBySegmentId')
        console.log(`getAffiliatesBySegmentId count:${result.length}\n`)
        return result
    } catch (e) {
        console.log(e)
    }
}




module.exports = {
    getAffiliates,
    getAffiliatesByFilter,
    getAffiliatesBySegmentId
}