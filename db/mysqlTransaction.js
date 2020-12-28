const util = require('util')
const mysql = require('mysql')
const config = require('plain-config')()
let instance

const dbTransaction = () => {

    let mysqlConfig = {
        host: config.mysql.host,
        database: config.mysql.database,
        user: config.mysql.user,
        password: config.mysql.password,
        port: config.mysql.port
    }
    // console.log(`\n \x1b[35m First init transaction  DB \x1b[0m`)
    // console.log(mysqlConfig)
    const connection = mysql.createConnection(mysqlConfig)
    return {
        query(sql, args) {
            return util.promisify(connection.query)
                .call(connection, sql, args)
        },
        close() {
            return util.promisify(connection.end).call(connection);
        },
        beginTransaction() {
            return util.promisify(connection.beginTransaction)
                .call(connection);
        },
        commit() {
            return util.promisify(connection.commit)
                .call(connection);
        },
        rollback() {
            return util.promisify(connection.rollback)
                .call(connection);
        }
    }
}

module.exports = {

    get: () => {
        if (!instance) {
            instance = dbTransaction
        }
        return instance
    }
}
