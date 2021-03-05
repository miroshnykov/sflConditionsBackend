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

module.exports = {
    getAffiliates
}
