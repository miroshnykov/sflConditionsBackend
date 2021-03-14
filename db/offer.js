let dbMysql = require('./mysqlDb').get()
let dbTransaction = require('./mysqlTransaction').get()
const {sendMessageToQueue} = require('../helper/sqs')
const {getOffer} = require('./offers')

const create = async (data) => {

    let {name, email} = data

    let date = new Date()
    let dateAdd = ~~(date.getTime() / 1000)
    let findAdvId = await dbMysql.query(`SELECT * FROM sfl_advertisers limit 1`)
    await dbMysql.end()

    let findAdvManagerId = await dbMysql.query(`
           SELECT * FROM sfl_employees where role = 'Advertiser Manager' LIMIT 1`)
    await dbMysql.end()
    //
    let sflAdvertiserId = findAdvId.length !== 0 && findAdvId[0].id || 0
    let advertiserManagerId = findAdvManagerId.length !== 0 && findAdvManagerId[0].id || 0


    try {

        let result = await dbMysql.query(` 
            INSERT INTO sfl_offers (
                name, user,sfl_advertiser_id,advertiser_manager_id,date_added
            )VALUES (?,?,?,?,?)
        `, [name, email, sflAdvertiserId,advertiserManagerId, dateAdd])
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
                   c.clicks_redirect_offer_use_default AS clicksRedirectOfferUseDefault,
                   c.sales_day                AS salesDay, 
                   c.sales_week               AS salesWeek, 
                   c.sales_month              AS salesMonth, 
                   c.sales_redirect_status    AS salesRedirectStatus, 
                   c.sales_redirect_offer_id  AS salesRedirectOfferId,
                   c.sales_redirect_offer_use_default AS salesRedirectOfferUseDefault 
            FROM   sfl_offers_cap c 
            WHERE  c.sfl_offer_id = ?
        `, [offerId])
        await dbMysql.end()

        console.log(`\n get Cap per offer:${offerId}, result:${JSON.stringify(result)}`)

        return result.length !== 0 && result[0] || {}
    } catch (e) {
        console.log(e)
    }
}

const update = async (data) => {

    console.log(`\nupdate data:${JSON.stringify(data)}`)
    let date = new Date()
    let dateAdd = ~~(date.getTime() / 1000)

    const {
        id,
        name,
        status,
        advertiserId,
        advertiserName,
        advertiserManagerId,
        verticals,
        descriptions,
        email,
        conversionType,
        payoutPercent,
        isCpmOptionEnabled,
        payIn,
        payOut,
        geoRules,
        caps,
        lp,
        offerIdRedirect
    } = data

    let {defaultLp, defaultSiteName, customLPRules} = data

    let oldDefaultLp = defaultLp
    let result = []
    const db = dbTransaction()
    try {
        await db.beginTransaction()

        let changesData = {
            name: name,
            status: status,
            advertiserName: advertiserName,
            advertiserManagerId: advertiserManagerId,
            verticals: verticals,
            email: email,
            payoutPercent: payoutPercent,
            conversionType: conversionType,
            descriptions: descriptions,
            payIn: payIn,
            payOut: payOut,
            defaultSiteName: defaultSiteName,
            offerIdRedirect: offerIdRedirect,
        }

        const originOffer = await db.query(`
            SELECT
                   o.name            AS name, 
                   o.status          AS status, 
                   o.payin           AS payIn, 
                   o.payout          AS payOut, 
                   o.conversion_type AS conversionType, 
                   o.advertiser_manager_id AS advertiserManagerId,
                   a.id              AS advertiserId,
                   a.name            AS advertiserName,
                   o.descriptions    AS descriptions, 
                   o.user            AS email,
                   o.verticals       AS verticals, 
                   o.date_added      AS dateAdded,
                   o.is_cpm_option_enabled     AS isCpmOptionEnabled,
                   o.payout_percent            AS payoutPercent,                    
                   --o.sfl_offer_landing_page_id AS defaultLp,
                   (SELECT  name FROM sfl_offer_landing_pages WHERE id = o.sfl_offer_landing_page_id) AS defaultSiteName,
                   o.offer_id_redirect AS offerIdRedirect
            FROM   sfl_offers o 
                   left join sfl_advertisers a 
                          ON a.id = o.sfl_advertiser_id               
            WHERE  o.id = ?`, [id])

        // console.log('originOffer:', originOffer)

        let originData = {
            name: originOffer[0].name,
            status: originOffer[0].status,
            advertiserName: originOffer[0].advertiserName,
            advertiserManagerId: originOffer[0].advertiserManagerId,
            verticals: originOffer[0].verticals,
            descriptions: originOffer[0].descriptions,
            email: originOffer[0].email,
            payoutPercent: originOffer[0].payoutPercent,
            conversionType: originOffer[0].conversionType,
            payIn: originOffer[0].payIn,
            payOut: originOffer[0].payOut,
            defaultSiteName: originOffer[0].defaultSiteName,
            offerIdRedirect: originOffer[0].offerIdRedirect,
        }
        console.log('\n changesData:', changesData)
        console.log('\n originData:', originData)

        let objKeys = Object.keys(changesData)
        let diff = []
        objKeys.forEach(key => {
            if (changesData[key] !== originData[key]) {
                diff.push({field: key, newValue: changesData[key], oldValue: originData[key]})
            }
        })

        let checkActionName = diff.filter(item => (item.oldValue === '' && item.field !== 'descriptions'))
        let action = 'update'
        // console.log('checkActionName:',checkActionName)
        if (checkActionName.length !== 0) {
            action = 'create'
        }
        console.log('\n DIFF:', diff)
        if (diff.length !== 0) {
            const insertHistory = await db.query(`
                INSERT INTO sfl_offers_history (sfl_offer_id, user, action,  date_added, logs) 
                VALUES (?, ?, ?, ?, ?)`,
                [
                    id,
                    email,
                    action,
                    dateAdd,
                    JSON.stringify(diff)
                ])

            console.log(`\ninsertHistory:${JSON.stringify(insertHistory)}`)

        }


        // landing pages
        let lpData = JSON.parse(lp)

        console.log('\nlpData:', JSON.stringify(lpData))
        if (lpData.length !== 0) {

            const defaultLpInfo = lpData.filter(item => (item.id === defaultLp))
            // console.log('defaultLpInfo:', JSON.stringify(defaultLpInfo))


            const deleteLP = await db.query(`DELETE FROM sfl_offer_landing_pages WHERE sfl_offer_id = ?`, [id])
            // console.log(`\ndeleteLp:${JSON.stringify(deleteLP)}`)

            let newLpId = []
            for (const item of lpData) {
                console.log(`\nItem LP:${JSON.stringify(item)}`)

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

                // console.log(`\ninsertLP:${JSON.stringify(insertLP)}`)
                let newId = insertLP.insertId
                newLpId.push({id: newId, name: name, url: url})
            }

            let customLPRules_ = JSON.parse(customLPRules)
            // console.log('\n customLPRules:', customLPRules_.customLPRules)
            let newCustomLPRules = []
            customLPRules_.customLPRules.forEach(item => {
                let found = newLpId.filter(i => (i.name === item.lpName && i.url === item.lpUrl))

                if (found.length !== 0) {
                    let obj = {}
                    obj.id = found && found[0].id
                    obj.pos = item.pos
                    obj.country = item.country
                    obj.lpName = item.lpName
                    obj.lpUrl = item.lpUrl
                    newCustomLPRules.push(obj)
                }


            })
            console.log('\n NewLpId:', newLpId)

            console.log('\n newCustomLPRules:', newCustomLPRules)
            const newDefaultLpInfo = await db.query(`
                select id 
                FROM sfl_offer_landing_pages 
                WHERE url = '${defaultLpInfo[0].url}'  AND name ='${defaultLpInfo[0].name}' AND sfl_offer_id =${id} `)


            const customLPRulesFormat = (customLPRules) => {
                let customLp = {}
                customLp.customLPRules = customLPRules
                return JSON.stringify(customLp)
            }

            customLPRules = customLPRulesFormat(newCustomLPRules)

            if (newDefaultLpInfo) {
                defaultLp = newDefaultLpInfo[0].id
                console.log(`\ndefaultLp UPDATE to ${defaultLpInfo[0].url} ID ${defaultLp} was ID:${oldDefaultLp}`)
            }
        }


        // console.log(' \n\n DIMON is_cpm_option_enabled: ', isCpmOptionEnabled)
        const updateOffer = await db.query(`
            UPDATE sfl_offers 
            SET name = ?, 
                sfl_advertiser_id = ?, 
                advertiser_manager_id = ?,
                verticals = ?, 
                descriptions = ?, 
                status = ?, 
                conversion_type = ?, 
                payout_percent = ?, 
                is_cpm_option_enabled = ?, 
                payin = ?, 
                payout = ?, 
                user = ?, 
                sfl_offer_landing_page_id = ?, 
                offer_id_redirect = ?
            WHERE  id = ?`,
            [
                name,
                advertiserId,
                advertiserManagerId,
                verticals,
                descriptions,
                status,
                conversionType,
                payoutPercent,
                isCpmOptionEnabled,
                payIn,
                payOut,
                email,
                defaultLp,
                offerIdRedirect,
                id
            ]
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
            // console.log(`\n caps obj:${JSON.stringify(capsObj)}`)
            let {
                clickDay,
                clickWeek,
                clickMonth,
                clicksRedirectStatus,
                clicksRedirectOfferId,
                clicksRedirectOfferUseDefault,
                salesDay,
                salesWeek,
                salesMonth,
                salesRedirectStatus,
                salesRedirectOfferId,
                salesRedirectOfferUseDefault
            } = capsObj

            clicksRedirectOfferUseDefault = clicksRedirectOfferUseDefault === null ? 1 : clicksRedirectOfferUseDefault
            salesRedirectOfferUseDefault = salesRedirectOfferUseDefault === null ? 1 : salesRedirectOfferUseDefault
            // console.log('\nclicksRedirectOfferUseDefault:', clicksRedirectOfferUseDefault)
            // console.log('\nsalesRedirectOfferUseDefault:', salesRedirectOfferUseDefault)

            if (checkCaps[0].countCap === 0) {
                const insertCaps = await db.query(`
                    INSERT INTO sfl_offers_cap (
                        sfl_offer_id,
                        clicks_day, 
                        clicks_week, 
                        clicks_month, 
                        clicks_redirect_status,
                        clicks_redirect_offer_id, 
                        clicks_redirect_offer_use_default,
                        sales_day, 
                        sales_week, 
                        sales_month, 
                        sales_redirect_status, 
                        sales_redirect_offer_id,
                        sales_redirect_offer_use_default
                        ) 
                    VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                    [
                        id,
                        clickDay || 0,
                        clickWeek || 0,
                        clickMonth || 0,
                        clicksRedirectStatus || 'default',
                        clicksRedirectOfferId || 0,
                        clicksRedirectOfferUseDefault,
                        salesDay || 0,
                        salesWeek || 0,
                        salesMonth || 0,
                        salesRedirectStatus || 'default',
                        salesRedirectOfferId || 0,
                        salesRedirectOfferUseDefault
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
                        clicks_redirect_offer_use_default=?,
                        sales_day=?,                        
                        sales_week=?, 
                        sales_month=?, 
                        sales_redirect_status=?, 
                        sales_redirect_offer_id=?,
                        sales_redirect_offer_use_default=? 
                    WHERE sfl_offer_id=?`,
                    [
                        clickDay || 0,
                        clickWeek || 0,
                        clickMonth || 0,
                        clicksRedirectStatus || 'default',
                        clicksRedirectOfferId || 0,
                        clicksRedirectOfferUseDefault,
                        salesDay || 0,
                        salesWeek || 0,
                        salesMonth || 0,
                        salesRedirectStatus || 'default',
                        salesRedirectOfferId || 0,
                        salesRedirectOfferUseDefault,
                        id
                    ]
                )
                console.log(`\nupdateCaps:${JSON.stringify(updateCaps)}\n`)
            }

        }

        await db.commit()

        let offerSqs = await offerForSqs(id)
        let obj = {}
        obj._comments = 'offer handling insert'
        obj.type = 'offer'
        obj.id = id
        obj.action = 'insert'
        obj.body = `${JSON.stringify(offerSqs)}`

        // console.log(obj)
        // console.log(offerSqs)
        console.log(`Added update to redis Body:${JSON.stringify(obj)}`)
        let sqsData = await sendMessageToQueue(obj)
        console.log(`Added update to redis sqs:${JSON.stringify(sqsData)}`)

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

        let offerhistoryDel = await dbMysql.query(`DELETE FROM sfl_offers_history WHERE sfl_offer_id = ?`, [id])
        console.log(`\ndelete offer history  ID:${id}, result:${JSON.stringify(offerhistoryDel)} `)

        let offerDel = await dbMysql.query(`DELETE FROM sfl_offers WHERE id = ?`, [id])
        console.log(`\ndelete offer ID:${id}, result:${JSON.stringify(offerDel)} `)


        await db.commit()

        let objSqs = {}
        objSqs._comments = 'offer handling delete'
        objSqs.type = 'offer'
        objSqs.id = id
        objSqs.action = 'delete'
        objSqs.body = ''
        let sqsData = await sendMessageToQueue(objSqs)
        console.log(`Added delete from Recipe to sqs:${JSON.stringify(sqsData)}`)

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

const offerForSqs = async (offerId) => {

    try {
        let offerResult = await dbMysql.query(` 
            SELECT o.id                            AS offerId, 
                   o.name                          AS name, 
                   a.name                          AS advertiserName,
                   o.verticals                     AS verticals,   
                   o.advertiser_manager_id         AS advertiserManagerId,                
                   o.conversion_type               AS conversionType,                     
                   o.status                        AS status, 
                   o.payin                         AS payin, 
                   o.payout                        AS payout, 
                   o.payout_percent                AS payoutPercent,
                   o.is_cpm_option_enabled         AS isCpmOptionEnabled,                     
                   lp.id                           AS landingPageId, 
                   lp.url                          AS landingPageUrl, 
                   o.sfl_offer_geo_id              AS sflOfferGeoId, 
                   g.rules                         AS geoRules, 
                   g.sfl_offer_id                  AS geoOfferId, 
                   lps.rules                       AS customLpRules,
--                   (SELECT c.clicks_day FROM   sfl_offers_cap_current_data c WHERE  c.sfl_offer_id = o.id) AS capDayCurrentData,
                   (SELECT c1.clicks_day FROM   sfl_offers_cap c1 WHERE  c1.sfl_offer_id = o.id AND c1.clicks_day !=0) AS capDaySetup, 
                   (SELECT c.clicks_day FROM   sfl_offers_cap_current_data c WHERE  c.sfl_offer_id = o.id)- 
                   (SELECT c1.clicks_day FROM   sfl_offers_cap c1 WHERE  c1.sfl_offer_id = o.id)                    
                        AS capDayCalculate,

--                   (SELECT c.clicks_week FROM   sfl_offers_cap_current_data c WHERE  c.sfl_offer_id = o.id) AS capWeekCurrentData,
                   (SELECT c1.clicks_week FROM   sfl_offers_cap c1 WHERE  c1.sfl_offer_id = o.id AND c1.clicks_week !=0) AS capWeekSetup, 
                                      (SELECT c.clicks_week FROM   sfl_offers_cap_current_data c WHERE  c.sfl_offer_id = o.id) -
                   (SELECT c1.clicks_week FROM   sfl_offers_cap c1 WHERE  c1.sfl_offer_id = o.id) 
                        AS capWeekCalculate,                    
                   
--                   (SELECT c.clicks_month FROM   sfl_offers_cap_current_data c WHERE  c.sfl_offer_id = o.id) AS capMonthCurrentData,
                   (SELECT c1.clicks_month FROM   sfl_offers_cap c1 WHERE  c1.sfl_offer_id = o.id AND c1.clicks_month !=0) AS capMonthSetup, 
                   (SELECT c.clicks_month FROM   sfl_offers_cap_current_data c WHERE  c.sfl_offer_id = o.id) -                   
                   (SELECT c1.clicks_month FROM   sfl_offers_cap c1 WHERE  c1.sfl_offer_id = o.id) 

                        AS capMonthCalculate,
                                        
                   (SELECT c1.clicks_redirect_offer_id  FROM   sfl_offers_cap c1 WHERE  c1.sfl_offer_id = o.id) AS capRedirect                
            FROM   sfl_offers o 
                   left join sfl_offer_landing_pages lp 
                          ON lp.id = o.sfl_offer_landing_page_id 
                   left join sfl_offer_geo g 
                          ON g.sfl_offer_id = o.id  
                   left join sfl_offer_custom_landing_pages lps
                          ON o.id = lps.sfl_offer_id
                   left join sfl_advertisers a 
                          ON a.id = o.sfl_advertiser_id                              
            WHERE o.id = ${offerId}                                         
        `)
        await dbMysql.end()
        // console.log(`\nget offerInfo count: ${result.length}`)

        let offer = offerResult[0]

        let offerToSend = Object.assign({}, offer)
        const {capDaySetup, capWeekSetup, capMonthSetup, capDayCalculate, capWeekCalculate, capMonthCalculate, capRedirect} = offer
        if (
            capDaySetup
            || capWeekSetup
            || capMonthSetup) {

            if (capDayCalculate > 0 || capWeekCalculate > 0 || capMonthCalculate > 0) {
                let offerRedirectInfo = await getOffer(capRedirect)
                console.log(`\n *** Cap by offerId { ${offer.offerId} } redirectOffer { ${capRedirect} } offerInfo:${JSON.stringify(offer)}`)
                console.log(` *** offerRedirectInfo:${JSON.stringify(offerRedirectInfo)} \n`)
                if (offerRedirectInfo.length !== 0) {
                    offer.landingPageIdOrigin = offer.landingPageId
                    offer.landingPageUrlOrigin = offer.landingPageUrl
                    offer.landingPageId = offerRedirectInfo[0].landingPageId
                    offer.landingPageUrl = offerRedirectInfo[0].landingPageUrl
                    offer.capOverrideOfferId = capRedirect
                } else {
                    console.log(`\n *** No cap redirect offer  { ${capRedirect} } offer:${JSON.stringify(offer)}`)
                }
            }

        }
        console.log('offerToSend:', JSON.stringify(offerToSend))

        return offerToSend
    } catch (e) {
        console.log(e)
    }
}


module.exports = {
    create,
    update,
    cap,
    del
}