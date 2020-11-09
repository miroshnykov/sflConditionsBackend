let dbMysql = require('./mysqlDb').get()

const all = async () => {

    try {
        console.time('getLp')
        let result = await dbMysql.query(` 
            SELECT  
                id, 
                NAME as name, 
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

module.exports = {
    all
}