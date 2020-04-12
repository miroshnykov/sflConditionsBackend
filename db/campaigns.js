let dbMysql = require('./mysqlDb').get()

const all = async () => {

    try {
        let result = await dbMysql.query(` 
            SELECT c.id, 
                   c.name, 
                   c.status, 
                   c.budget_total as budgetTotal, 
                   c.budget_daily as budgetDaily, 
                   c.cpc, 
                   c.user,
                   c.landing_page as landingPage 
            FROM   sfl_advertiser_campaigns c 
            ORDER  BY c.date_added DESC
        `)
        await dbMysql.end()

        console.log(`\nget all Campaigns count: ${result.length}`)
        return result
    } catch (e) {
        console.log(e)
    }
}


module.exports = {
    all,
}