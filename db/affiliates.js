let dbMysql = require('./mysqlDb').get()

const getAffiliates = async () => {

    try {
        console.time('getAffilates')
        let result = await dbMysql.query(` 
            SELECT a.id as id, CONCAT(first_name, \' \', last_name) AS name, a.country_code as countryCode
            FROM affiliates a WHERE a.\`status\` = 'active'  AND a.salesforce_id <> 0 AND country_code != '' ORDER BY ID ASC LIMIT 8000
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