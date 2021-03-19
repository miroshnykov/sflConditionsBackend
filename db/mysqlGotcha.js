require('dotenv').config()
const mysql = require('serverless-mysql')()
let mysqlDb
const config =  require('plain-config')()
module.exports = {

    get: () => {
        if (!mysqlDb) {
            console.log(`\n \x1b[35m First init DB mysqlGotcha \x1b[0m`)
            console.log(config.mysqlGotcha)
            let mysqlConfig = {
                host: config.mysqlGotcha.host,
                database: config.mysqlGotcha.database,
                user: config.mysqlGotcha.user,
                password: config.mysqlGotcha.password,
                port: config.mysqlGotcha.port
            }
            mysql.config(mysqlConfig)
            mysqlDb = mysql
        }
        // console.log(' << get singleton DB >>')
        return mysqlDb
    }
}
