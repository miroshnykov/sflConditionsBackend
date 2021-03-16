let dbMysql = require('./mysqlDb').get()

const getAdvertisers = async () => {

    try {
        console.time('getAdvertisers')
        let result = await dbMysql.query(` 
            SELECT a.id,
                   a.name,
                   a.description,
                   a.website
            FROM advertisers a
        `)
        await dbMysql.end()

        console.timeEnd('getAdvertisers')
        console.log(`getAdvertisers count:${result.length}\n`)
        return result
    } catch (e) {
        console.log(e)
    }
}

const getSflAdvertisers = async () => {

    try {
        console.time('getSflAdvertisers')
        let result = await dbMysql.query(` 
            SELECT a.id,
                   a.name,
                   a.descriptions,
                   a.website
            FROM sfl_advertisers a
        `)
        await dbMysql.end()

        console.timeEnd('getSflAdvertisers')
        console.log(`getSflAdvertisers count:${result.length}\n`)
        return result
    } catch (e) {
        console.log(e)
    }
}

const getAdvertisersProducts = async () => {

    try {
        console.time('getAdvertisersProducts')
        let result = await dbMysql.query(` 
            SELECT acp.id AS advertiserProductId,
                   acp.name AS advertiserProductName,
                   acp.advertiser_id AS advertiserId,
                   advs.name AS advertiserName,
                   acp.program_id AS advertiserProgramId,
                   pgm.name AS programName,
                   forward_offer_parameters AS forwardOfferParameters,
                   tracking_code AS trackingCode
            FROM ac_products AS acp
            INNER JOIN advertisers AS advs ON acp.advertiser_id = advs.id
            LEFT JOIN programs pgm ON pgm.id = acp.program_id
            WHERE acp.status = 'active'
        `)
        await dbMysql.end()

        console.timeEnd('getAdvertisersProducts')
        console.log(`getAdvertisersProducts count:${result.length}\n`)
        return result
    } catch (e) {
        console.log(e)
    }
}

const getSflAdvertisersManagers = async () => {

    try {
        console.time('getSflAdvertisersManagers')
        let result = await dbMysql.query(` 
            SELECT 
                e.id as id,
                e.first_name as firstName,
                e.last_name as lastName,
                e.email as email,
                e.role as role
            FROM sfl_employees e 
            WHERE e.role IN ('Advertiser Manager')
        `)
        await dbMysql.end()

        console.timeEnd('getSflAdvertisersManagers')
        console.log(`getSflAdvertisersManagers count:${result.length}\n`)
        return result
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    getAdvertisers,
    getAdvertisersProducts,
    getSflAdvertisers,
    getSflAdvertisersManagers
}