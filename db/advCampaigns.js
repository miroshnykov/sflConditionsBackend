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
                   c.no_limit                               AS noLimit, 
                   c.date_added                             AS dateAdded, 
                   c.date_updated                           AS dateUpdated, 
                   IFNULL((SELECT t.count_click  
                    FROM   sfl_traffic_history t 
                    WHERE  t.sfl_advertiser_campaign_id = c.id 
                           AND t.date_by_days = Curdate()),0 ) AS countClickDaily, 
                   IFNULL((SELECT Sum(t.count_click)  
                    FROM   sfl_traffic_history t 
                    WHERE  t.sfl_advertiser_campaign_id = c.id 
                    GROUP  BY t.sfl_advertiser_campaign_id),0) AS countClickTotal,                     
                   IFNULL((SELECT t.sum_spent 
                    FROM   sfl_traffic_history t 
                    WHERE  t.sfl_advertiser_campaign_id = c.id 
                           AND t.date_by_days = Curdate()),0 ) AS spentDaily, 
                   IFNULL((SELECT Sum(t.sum_spent)  
                    FROM   sfl_traffic_history t 
                    WHERE  t.sfl_advertiser_campaign_id = c.id 
                    GROUP  BY t.sfl_advertiser_campaign_id),0) AS spentTotal  
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