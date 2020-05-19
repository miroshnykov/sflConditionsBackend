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
                   c.landing_page_valid as landingPageValid,
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
            FROM   sfl_advertiser_campaigns c
            WHERE c.id = ? 
                  and c.soft_delete = false
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
        const {
            name,
            budgetTotal,
            budgetDaily,
            cpc,
            landingPage,
            user,
            landingPageValid,
            status
        } = data

        let date = new Date()
        let dateAdd = ~~(date.getTime() / 1000)

        let result = await dbMysql.query(`INSERT INTO sfl_advertiser_campaigns (
            name,
            budget_total,
            budget_daily, 
            cpc, 
            status,
            landing_page,
            landing_page_valid,
            user, 
            date_added
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
            name,
            budgetTotal,
            budgetDaily,
            cpc,
            status || 'inactive',
            landingPage,
            landingPageValid,
            user,
            dateAdd])
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
        const {
            id,
            name,
            budgetTotal,
            budgetDaily,
            cpc,
            landingPage,
            landingPageValid,
            status
        } = data

        let result = await dbMysql.query(`
            UPDATE sfl_advertiser_campaigns SET
                name = ?,
                budget_total = ?,
                budget_daily= ?, 
                cpc = ?, 
                status = ?,
                landing_page = ?,
                landing_page_valid = ?
            WHERE id = ?        
        `, [
            name,
            budgetTotal,
            budgetDaily,
            cpc,
            status,
            landingPage,
            landingPageValid,
            id])
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
        const {id, name} = data

        let result = await dbMysql.query(`
            UPDATE sfl_advertiser_campaigns SET
                name = ?                
            WHERE id = ?        
        `, [name, id])
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

const softDel = async (id) => {

    try {

        let result = await dbMysql.query(` 
            UPDATE sfl_advertiser_campaigns SET soft_delete=true WHERE  id=?; 
        `, [id])
        await dbMysql.end()
        console.log(`\nsoft delete Campaign:${id}`)
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
    del,
    softDel
}