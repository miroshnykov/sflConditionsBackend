let dbMysql = require('./mysqlDb').get()

const create = async (data) => {

    let {name, email} = data

    let date = new Date()
    let dateAdd = ~~(date.getTime() / 1000)

    try {

        let result = await dbMysql.query(` 
            INSERT INTO sfl_offers (name, user,date_added) VALUES (?,?,?);

        `, [name, email, dateAdd])
        await dbMysql.end()
        result.id = result.insertId || 0

        console.log(`\ncreate offer ${JSON.stringify(data)}, result: ${JSON.stringify(result)} `)
        return result
    } catch (e) {
        console.log(e)
    }
}

const del = async (id) => {

    try {
        let result = await dbMysql.query(` 
            DELETE FROM sfl_offers WHERE  id=?

        `, [id])
        console.log(`\ndelete offer ID:${id}, result:${JSON.stringify(result)} `)
        result.id = id
        return result
    } catch (e) {
        console.log(e)
    }
}


module.exports = {
    create,
    del
}