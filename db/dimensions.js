let dbMysql = require('./mysqlDb').get()

const getDimensions = async () => {

    try {
        let result = await dbMysql.query(` 
            select id, name, displayed_name as displayedName from sfl_dimension 
        `)
        await dbMysql.end()

        // console.log('getDimensions count:', result.length)
        return result
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    getDimensions
}