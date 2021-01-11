let dbMysql = require('./mysqlDb').get()
let dbTransaction = require('./mysqlTransaction').get()

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

const update = async (data) => {

    console.log(`\nupdate data:${JSON.stringify(data)}`)

    const {id, name, status, advertiser, email, conversionType, payIn, payOut, geoRules} = data
    let result = []
    const db = dbTransaction()
    try {
        await db.beginTransaction()


        const updateOffer = await db.query(`
            UPDATE sfl_offers 
            SET name=?, advertiser=?, status=?, conversion_type=?, payin=?, payout=? , user=?
            WHERE  id=?`,
            [name, advertiser, status, conversionType, payIn, payOut, email, id]
        )

        console.log(`\nupdateOffer:${JSON.stringify(updateOffer)}`)

        const updateGeoRules = await db.query(`
            UPDATE sfl_offer_geo 
            SET rules=? WHERE  sfl_offer_id=?`,
            [geoRules, id]
        )

        console.log(`\nupdateGeoRules:${JSON.stringify(updateGeoRules)}`)
        await db.commit()

        result.id = id
        return result

    } catch (err) {
        console.log('Updae offer Rollback err:', err)
        await db.rollback()
        return result
    } finally {
        await db.close()
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
    update,
    del
}