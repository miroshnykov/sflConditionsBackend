const jsforce = require('jsforce')
const config = require('plain-config')()

let conn = new jsforce.Connection({
    oauth2: {
        clientId: config.salesforce.client_id,
        clientSecret: config.salesforce.client_secret,
        loginUrl: config.salesforce.auth_url
    }
})

conn.login(config.salesforce.username, config.salesforce.password, (err, userInfo) => {
    if (err) return console.log(err)
    console.log(userInfo)
})

const createAccount = (affiliate) => {
    console.log('createAccount:', JSON.stringify(affiliate))
    const {affFirstName, affLastName, affiliateIdOrigin, status, notes, email} = affiliate
    return new Promise((resolve, reject) => {
        conn.sobject("Account").create({
            Name: `${affFirstName} ${affLastName}`,
            Phone: 666,
            ADCenterID__c: affiliateIdOrigin,
            Website: 'swsw',
            Description: notes,
            Payment_Type__c: 'paypal',
            AdCenter_Account_Type__c: 'Publisher Account',
            Registration_Date__c: 1615832271,
            Traffic_Blocked__c: false,
            Payment_Blocked__c: false,
            Type: 'gotcha',
            // RecordTypeId: 1111,
            Status__c: status,
            Communication_email__c: email,
            Country__c: 'CA',
            BillingCountry__c: 'CA',
        }, (err, res) => {
            if (err || !res.success) {
                console.log(err)
                return reject(err)
            }

            return resolve(res)
        })
    })
}

const findAccountsById = (affiliateId) => {
    return new Promise((resolve, reject) => {
        conn.sobject("Account").find({Communication_email__c: `${affiliateId}`}).execute((err, user) => {
            if (err) {
                console.error(err)
                return reject(err)
            }
            resolve(user)
        })
    })
}


module.exports = {
    createAccount,
    findAccountsById
}