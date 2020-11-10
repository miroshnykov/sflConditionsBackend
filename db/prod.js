let dbMysql = require('./mysqlDb').get()

const all = async () => {

    try {
        console.time(`prods`)
        let result = await dbMysql.query(` 
            SELECT p.id,p.name 
            FROM ac_products p 
            WHERE p.status = 'active' 
        `)
        await dbMysql.end()

        console.timeEnd(`prods`)
        console.log(`\nget all Prods count: ${result.length}`)
        return result
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    all,
}