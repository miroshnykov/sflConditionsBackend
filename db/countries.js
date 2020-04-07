let dbMysql = require('./mysqlDb').get()

const getCountries = async () => {

    try {
        console.time('getCountries')
        let result = await dbMysql.query(` 
            SELECT c.code, 
                   c.name 
            FROM   countries_regions_associated c 
            UNION 
            SELECT c1.country_code AS code, 
                   c1.country_name AS name 
            FROM   qualified_countries c1 
            WHERE c1.country_code not in ('0','A1','A2')
            ORDER  BY 1 
        `)
        await dbMysql.end()


        console.timeEnd('getCountries')
        console.log(`getCountries count:${result.length}\n`)
        return result
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    getCountries
}