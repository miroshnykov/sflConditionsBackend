let dbMysql = require('./mysqlDb').get()


const getLpOffers = async (offerId) => {

    try {
        let result = await dbMysql.query(` 
            SELECT lp.id, 
                   lp.sfl_offer_id   AS offerId, 
                   lp.name           AS name, 
                   lp.url            AS url, 
                   lp.status as status, 
                   lp.date_added     AS dateAdded 
            FROM   sfl_offer_landing_pages lp  
            WHERE lp.sfl_offer_id = ?   
        `,[offerId])
        await dbMysql.end()


        console.log(`getLpOffers count:${result.length}\n`)
        return result
    } catch (e) {
        console.log(e)
    }
}

const create = async (data) => {

    const {offerId, name, url, email} = data

    let date = new Date()
    let dateAdd = ~~(date.getTime() / 1000)

    try {
        let result = await dbMysql.query(` 
            INSERT INTO sfl_offer_landing_pages (sfl_offer_id, name, url, user, date_added) 
            VALUES (?,?,?,?,?)  
        `, [offerId, name, url, email, dateAdd])
        await dbMysql.end()

        result.id = result.insertId || 0

        console.log(`create CustomOfferLP:${JSON.stringify(result)}\n`)
        return result
    } catch (e) {
        console.log(e)
    }
}

const update = async (data) => {

    const {id, offerId, name, url, email} = data

    try {

        let result = await dbMysql.query(` 
            UPDATE sfl_offer_landing_pages SET sfl_offer_id=?, name=?, url=?, user=? WHERE id=?
        `, [offerId, name, url, email, id])
        await dbMysql.end()

        result.id = id || 0

        console.log(`update CustomOfferLP:${JSON.stringify(data)}\n`)
        return result
    } catch (e) {
        console.log(e)
    }
}

const del = async (data) => {

    const {id} = data

    try {

        let result = await dbMysql.query(` 
            DELETE FROM sfl_offer_landing_pages WHERE id=?
        `, [id])
        await dbMysql.end()

        result.id = id || 0

        console.log(`update CustomOfferLP:${JSON.stringify(data)}\n`)
        return result
    } catch (e) {
        console.log(e)
    }
}


module.exports = {
    getLpOffers,
    create,
    update,
    del
}