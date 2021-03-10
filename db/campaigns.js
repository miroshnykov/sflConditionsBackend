let dbMysql = require('./mysqlDb').get()

const getCampaign = async (affiliateId) => {

    try {
        let result = await dbMysql.query(` 
            SELECT id, name, affiliate_id as affiliateId FROM campaigns WHERE affiliate_id ="${affiliateId}"
        `)
        await dbMysql.end()

        console.log('getCampaign count :', result.length, ' by affiliateId:', affiliateId)
        return result
    } catch (e) {
        console.log(e)
    }
}

// const getCampaigns = async () => {
//
//     try {
//         console.time('getCampaigns')
//         let result = await dbMysql.query(`
//             SELECT c.id           AS id,
//                    c.NAME         AS name,
//                    c.affiliate_id AS affiliateId
//             FROM   campaigns c,
//                    affiliates a
//             WHERE  a.id = c.affiliate_id
//                    AND c.status = 'active'
//                    AND a.status = 'active'
//                    AND a.salesforce_id <> 0
//         `)
//         await dbMysql.end()
//
//         console.timeEnd('getCampaigns')
//         console.log(`getCampaigns count:${result.length}\n`)
//         return result
//     } catch (e) {
//         console.log(e)
//     }
// }

const getCampaigns = async (segmentId) => {

    console.log('here ')
    try {
        console.time('getCampaignsBySegment')
        let result = await dbMysql.query(` 
            SELECT c.id           AS id,
                c.name         AS name,
                c.affiliate_id AS affiliateId
            FROM   campaigns c
            WHERE  c.affiliate_id IN (
                SELECT Substr(value, 1, Position("/" IN value) - 1) AS affId
                FROM   sfl_segment_dimension d
                WHERE  d.sfl_segment_id IN ( ${segmentId} )
                AND d.sfl_dimension_id = 5
            )       
        `)
        await dbMysql.end()

        console.timeEnd('getCampaignsBySegment')
        console.log(`getCampaignsBySegment count:${result.length}\n`)
        return result
    } catch (e) {
        console.log(e)
    }
}




module.exports = {
    getCampaign,
    getCampaigns
}