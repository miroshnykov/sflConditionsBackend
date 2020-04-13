let dbMysql = require('./mysqlDb').get()

const get = async (id) => {

    try {
        let result = await dbMysql.query(` 
            SELECT c.id, 
                   c.name, 
                   c.status, 
                   c.budget_total as budgetTotal, 
                   c.budget_daily as budgetDaily, 
                   c.cpc, 
                   c.user,
                   c.landing_page as landingPage,
                   c.landing_page_valid as landingPageValid 
            FROM   sfl_advertiser_campaigns c
            WHERE c.id = ? 
            ORDER  BY c.date_added 
        `, [id])
        await dbMysql.end()

        console.log(`\ngetCampaign:${JSON.stringify(result)}`)
        return result
    } catch (e) {
        console.log(e)
    }
}

const add = async (data) => {

    try {
        const {name, budgetTotal, budgetDaily, cpc, landingPage, user, landingPageValid} = data

        let date = new Date()
        let dateAdd = ~~(date.getTime() / 1000)

        let result = await dbMysql.query(`INSERT INTO sfl_advertiser_campaigns (
            name,
            budget_total,
            budget_daily, 
            cpc, 
            landing_page,
            landing_page_valid,
            user, 
            date_added
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
            name, budgetTotal, budgetDaily, cpc, landingPage, landingPageValid, user, dateAdd])
        await dbMysql.end()

        result.id = result.insertId
        console.log(`\naddCampaign:${JSON.stringify(data)}`)
        return result
    } catch (e) {
        console.log(e)
    }
}

const update = async (data) => {

    try {
        const {id, name, budgetTotal, budgetDaily, cpc, landingPage, user, landingPageValid} = data

        let result = await dbMysql.query(`
            UPDATE sfl_advertiser_campaigns SET
                name = ?,
                budget_total = ?,
                budget_daily= ?, 
                cpc = ?, 
                landing_page=?,
                landing_page_valid=?,
                user = ?
            WHERE id = ?        
        `, [name, budgetTotal, budgetDaily, cpc, landingPage, landingPageValid, user, id])
        await dbMysql.end()
        console.log(`\nupdated Campaign:${JSON.stringify(data)}`)
        result.id = id
        return result
    } catch (e) {
        console.log(e)
    }
}

const updateName = async (data) => {

    try {
        const {id, name, user} = data

        let result = await dbMysql.query(`
            UPDATE sfl_advertiser_campaigns SET
                name = ?,                
                user = ?
            WHERE id = ?        
        `, [name, user, id])
        await dbMysql.end()
        console.log(`\nupdated Campaign name to :${JSON.stringify(data)}`)
        result.id = id
        return result
    } catch (e) {
        console.log(e)
    }
}

const del = async (id) => {

    try {
        let result = await dbMysql.transaction()
            .query(`DELETE FROM sfl_advertiser_targeting WHERE sfl_advertiser_campaign_id=${id}`)
            .query(`DELETE FROM sfl_advertiser_campaigns WHERE id=${id}`)
            .commit()
        console.log(`\ndelete Campaign:${id}`)
        result.id = id
        return result
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    add,
    update,
    updateName,
    get,
    del
}