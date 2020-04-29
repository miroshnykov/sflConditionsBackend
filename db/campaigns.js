let dbMysql = require('./mysqlDb').get()

const all = async () => {

    try {
        let result = await dbMysql.query(` 
            SELECT c.id, 
                   c.name, 
                   c.status, 
                   c.budget_total       AS budgetTotal, 
                   c.budget_daily       AS budgetDaily, 
                   c.cpc, 
                   u.name as userName, 
                   c.user as userEmail, 
                   c.landing_page       AS landingPage, 
                   c.landing_page_valid AS landingPageValid 
            FROM   sfl_advertiser_campaigns c, 
                   sfl_users u 
            WHERE  u.email = c.USER 
                   AND c.soft_delete = false 
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