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

const cap = async (offerId) => {

    try {

        let result = await dbMysql.query(` 
            SELECT c.sfl_offer_id             AS offerId, 
                   c.clicks_day               AS clickDay, 
                   c.clicks_week              AS clickWeek, 
                   c.clicks_month             AS clickMonth, 
                   c.clicks_redirect_status   AS clicksRedirectStatus, 
                   c.clicks_redirect_offer_id AS clicksRedirectOfferId, 
                   c.sales_day                AS salesDay, 
                   c.sales_week               AS salesWeek, 
                   c.sales_month              AS salesMonth, 
                   c.sales_redirect_status    AS salesRedirectStatus, 
                   c.sales_redirect_offer_id  AS salesRedirectOfferId 
            FROM   sfl_offers_cap c 
            WHERE  c.sfl_offer_id = ?
        `, [offerId])
        await dbMysql.end()

        console.log(`\n get Cap per offer:${offerId}, result:${JSON.stringify(result)}`)
        return result
    } catch (e) {
        console.log(e)
    }
}

const update = async (data) => {

    console.log(`\nupdate data:${JSON.stringify(data)}`)

    const {
        id,
        name,
        status,
        advertiser,
        email,
        conversionType,
        payIn,
        payOut,
        geoRules,
        caps,
        lp,
        offerIdRedirect
    } = data

    let {defaultLp, customLPRules} = data
    let result = []
    const db = dbTransaction()
    try {
        await db.beginTransaction()

        // landing pages
        let lpData = JSON.parse(lp)

        console.log('lpData:', lpData)
        if (lpData.length !== 0) {

            const defaultLpInfo = lpData.filter(item => (item.id === defaultLp))
            console.log('defaultLpInfo:', defaultLpInfo)

            const deleteLP = await db.query(`DELETE FROM sfl_offer_landing_pages WHERE sfl_offer_id = ?`, [id])
            console.log(`\ndeleteLp:${JSON.stringify(deleteLP)}`)

            let newLpId = []
            for (const item of lpData) {
                console.log(`Item LP:${JSON.stringify(item)}`)

                const {name, url} = item
                let date = new Date()
                let dateAdded = ~~(date.getTime() / 1000)

                const insertLP = await db.query(`
                    INSERT INTO sfl_offer_landing_pages (sfl_offer_id, name, url, user, date_added)
                    VALUES (?, ?, ?, ?, ?)`,
                    [
                        id,
                        name,
                        url,
                        email,
                        dateAdded
                    ])

                console.log(`\ninsertLP:${JSON.stringify(insertLP)}`)
                let newId = insertLP.insertId
                newLpId.push({id: newId, name: name, url: url})
            }

            let customLPRules_ = JSON.parse(customLPRules)
            console.log('\n customLPRules:', customLPRules_.customLPRules)
            let newCustomLPRules = []
            customLPRules_.customLPRules.forEach(item => {
                let found = newLpId.filter(i => (i.name === item.lpName && i.url === item.lpUrl))

                let obj = {}
                obj.id = found && found[0].id
                obj.pos = item.pos
                obj.country = item.country
                obj.lpName = item.lpName
                obj.lpUrl = item.lpUrl
                newCustomLPRules.push(obj)

            })
            console.log('\n NewLpId:', newLpId)

            console.log('\n newCustomLPRules:', newCustomLPRules)
            const newDefaultLpInfo = await db.query(`
                select id 
                FROM sfl_offer_landing_pages 
                WHERE url = '${defaultLpInfo[0].url}'  AND name ='${defaultLpInfo[0].name}'`)


            const customLPRulesFormat = (customLPRules) => {
                let customLp = {}
                customLp.customLPRules = customLPRules
                return JSON.stringify(customLp)
            }

            customLPRules = customLPRulesFormat(newCustomLPRules)

            if (newDefaultLpInfo) {
                defaultLp = newDefaultLpInfo[0].id
            }
        }

        const updateOffer = await db.query(`
            UPDATE sfl_offers 
            SET name=?, 
                advertiser=?, 
                status=?, 
                conversion_type=?, 
                payin=?, 
                payout=?, 
                user=?, 
                sfl_offer_landing_page_id=?, 
                offer_id_redirect=?
            WHERE  id=?`,
            [name, advertiser, status, conversionType, payIn, payOut, email, defaultLp, offerIdRedirect, id]
        )

        console.log(`\nupdateOffer:${JSON.stringify(updateOffer)}`)

        const checkGeoRules = await db.query(`
            select count(*) as countRules from sfl_offer_geo WHERE sfl_offer_id=?`, [id]
        )
        if (checkGeoRules[0].countRules === 0) {
            const insertGeoRules = await db.query(`
                INSERT INTO sfl_offer_geo (rules, sfl_offer_id) VALUES (?, ?)`, [geoRules, id]
            )
            console.log(`\ninsertGeoRules:${JSON.stringify(insertGeoRules)}`)
        } else {
            const updateGeoRules = await db.query(`
                UPDATE sfl_offer_geo SET rules=? WHERE  sfl_offer_id=?`, [geoRules, id]
            )
            console.log(`\nupdateGeoRules:${JSON.stringify(updateGeoRules)}`)
        }

        const checkCustomLPRules = await db.query(`
            select count(*) as countRules from sfl_offer_custom_landing_pages WHERE sfl_offer_id=?`, [id]
        )
        if (checkCustomLPRules[0].countRules === 0) {
            const insertCustomLpRules = await db.query(`
                INSERT INTO sfl_offer_custom_landing_pages (rules, sfl_offer_id) VALUES (?, ?)`, [customLPRules, id]
            )
            console.log(`\nInsert checkCustomLPRules:${JSON.stringify(insertCustomLpRules)}`)
        } else {
            const updateCustomLpRules = await db.query(`
                UPDATE sfl_offer_custom_landing_pages SET rules=? WHERE  sfl_offer_id=?`, [customLPRules, id]
            )
            console.log(`\nupdateCustomLpRules:${JSON.stringify(updateCustomLpRules)}`)
        }

        if (caps) {
            const checkCaps = await db.query(`
                SELECT COUNT(*) as countCap  FROM sfl_offers_cap c WHERE c.sfl_offer_id = ?`, [id]
            )

            let capsObj = JSON.parse(caps)
            const {
                clickDay,
                clickWeek,
                clickMonth,
                clicksRedirectStatus,
                clicksRedirectOfferId,
                salesDay,
                salesWeek,
                salesMonth,
                salesRedirectStatus,
                salesRedirectOfferId
            } = capsObj


            if (checkCaps[0].countCap === 0) {
                const insertCaps = await db.query(`
                    INSERT INTO sfl_offers_cap (
                        sfl_offer_id,
                        clicks_day, 
                        clicks_week, 
                        clicks_month, 
                        clicks_redirect_status,
                        clicks_redirect_offer_id, 
                        sales_day, 
                        sales_week, 
                        sales_month, 
                        sales_redirect_status, 
                        sales_redirect_offer_id
                        ) 
                    VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?,?);`,
                    [
                        id,
                        clickDay || 0,
                        clickWeek || 0,
                        clickMonth || 0,
                        clicksRedirectStatus || 'default',
                        clicksRedirectOfferId,
                        salesDay || 0,
                        salesWeek || 0,
                        salesMonth || 0,
                        salesRedirectStatus || 'default',
                        salesRedirectOfferId
                    ]
                )
                console.log(`\n insertCaps:${JSON.stringify(insertCaps)}`)
            } else {
                const updateCaps = await db.query(`
                    UPDATE sfl_offers_cap 
                    SET 
                        clicks_day=?, 
                        clicks_week=?, 
                        clicks_month=?,
                        clicks_redirect_status=?,
                        clicks_redirect_offer_id=?,
                        sales_day=?,                        
                        sales_week=?, 
                        sales_month=?, 
                        sales_redirect_status=?, 
                        sales_redirect_offer_id=? 
                    WHERE sfl_offer_id=?`,
                    [
                        clickDay || 0,
                        clickWeek || 0,
                        clickMonth || 0,
                        clicksRedirectStatus || 'default',
                        clicksRedirectOfferId,
                        salesDay || 0,
                        salesWeek || 0,
                        salesMonth || 0,
                        salesRedirectStatus || 'default',
                        salesRedirectOfferId,
                        id
                    ]
                )
                console.log(`\nupdateCaps:${JSON.stringify(updateCaps)}`)
            }

        }

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

    const db = dbTransaction()
    try {

        await db.beginTransaction()

        let lpDel = await dbMysql.query(`DELETE FROM sfl_offer_landing_pages WHERE sfl_offer_id = ?`, [id])
        console.log(`\ndelete lp ID:${id}, result:${JSON.stringify(lpDel)} `)


        let geoDel = await dbMysql.query(`DELETE FROM sfl_offer_geo WHERE sfl_offer_id = ?`, [id])
        console.log(`\ndelete GEO ID:${id}, result:${JSON.stringify(geoDel)} `)

        let customLpDel = await dbMysql.query(`DELETE FROM sfl_offer_custom_landing_pages WHERE sfl_offer_id = ?`, [id])
        console.log(`\ndelete customLpDel ID:${id}, result:${JSON.stringify(customLpDel)} `)


        let capCurrentDataDel = await dbMysql.query(`DELETE FROM sfl_offers_cap_current_data WHERE sfl_offer_id = ?`, [id])
        console.log(`\ndelete capCurrentDataDel ID:${id}, result:${JSON.stringify(capCurrentDataDel)} `)

        let capDel = await dbMysql.query(`DELETE FROM sfl_offers_cap WHERE sfl_offer_id = ?`, [id])
        console.log(`\ndelete capDel ID:${id}, result:${JSON.stringify(capDel)} `)

        let offerDel = await dbMysql.query(`DELETE FROM sfl_offers WHERE id = ?`, [id])
        console.log(`\ndelete offer ID:${id}, result:${JSON.stringify(offerDel)} `)


        await db.commit()

        let res = {}
        res.id = id
        return res
    } catch (e) {
        console.log('Delete offer Rollback err:', e)
        await db.rollback()
    } finally {
        await db.close()
    }
}


module.exports = {
    create,
    update,
    cap,
    del
}