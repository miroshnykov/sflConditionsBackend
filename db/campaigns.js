let dbMysql = require('./mysqlDb').get()

const all = async () => {

    try {
        let result = await dbMysql.query(` 
            SELECT c.id, 
                   c.name, 
                   c.status, 
                   c.budget_total                           AS budgetTotal, 
                   c.budget_daily                           AS budgetDaily, 
                   c.cpc, 
                   u.name                                   AS userName, 
                   c.user                                   AS userEmail, 
                   c.landing_page                           AS landingPage, 
                   c.landing_page_valid                     AS landingPageValid, 
                   c.date_added                             AS dateAdded, 
                   c.date_updated                           AS dateUpdated, 
                   (SELECT t.count_click * c.cpc 
                    FROM   sfl_traffic_history t 
                    WHERE  t.sfl_advertiser_campaign_id = c.id 
                           AND t.date_by_days = Curdate())  AS spentDaily, 
                   (SELECT Sum(t.count_click) * c.cpc AS totalClick 
                    FROM   sfl_traffic_history t 
                    WHERE  t.sfl_advertiser_campaign_id = c.id 
                    GROUP  BY t.sfl_advertiser_campaign_id) AS spentTotal 
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