let dbMysql = require('./mysqlDb').get()

const getUser = async (email) => {

    try {
        let result = await dbMysql.query(` 
            select 
                u.google_id as googleId,
                u.name as name,
                u.email as email,
                u.given_name as givenName,
                u.family_name as familyName,
                u.picture as picture,
                u.link as link,
                u.hd as hd 
            from sfl_users u 
            where u.email = '${email}'
        `)
        await dbMysql.end()

        console.log(`\ngetUser by email:${email}`)
        return result
    } catch (e) {
        console.log(e)
    }
}

const setUser = async (data) => {

    const {id, email, name, given_name, family_name, picture, link, hd} = data

    try {
        let result = await dbMysql.query(` 
            INSERT IGNORE INTO sfl_users (email, google_id, name, given_name, family_name, picture, link, hd) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [email, id,name, given_name, family_name, picture, link, hd])
        await dbMysql.end()

        console.log(`\nsetUser:${JSON.stringify(data)}`)
        return result
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    getUser,
    setUser
}