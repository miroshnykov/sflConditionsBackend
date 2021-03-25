let dbMysql = require('./mysqlDb').get()

const get = async () => {

    try {
        let result = await dbMysql.query(` 
            SELECT v.id, v.name FROM sfl_vertical v order by 1 ASC
        `)
        await dbMysql.end()

        console.log(`\ngetVerticals count:${result.length}`)
        return result
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    get
}