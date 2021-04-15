const config = require('plain-config')()
const {
    getSflAffiliatesInfo,
    updateAffiliateFromSF
} = require('../db/migrate')

// node migrate/subscribeSfAccounts.js

const waitFor = delay => new Promise(resolve => setTimeout(resolve, delay))

const run = async () => {
    // let data = await readJson()
    try {

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


            conn.streaming.topic("updateAccount").subscribe((message) =>{
                // console.log('Event Type : ' + message.event.type)
                // console.log('Event Created : ' + message.event.createdDate)
                // console.log('Object Id : ' + message.sobject.Id)
                console.log('message from SalesForce:', message)
                updateAffiliateFromSF(message).then(res =>{
                    console.log(`Done updated, result:${JSON.stringify(res)}`)
                })
            });

        })


        // await waitFor(5000)


        // console.log(`Total records: { ${total} }, added: { ${success} } , errors: { ${errors} }`)
        // console.log(`Errors details:${JSON.stringify(errorsDetail)}`)
        // console.log(`errorsAffiliates :${JSON.stringify(errorsAffiliates)}`)
    } catch (e) {
        console.log(e)
    }

}

(async () => {
    return await run()
})().then(v => {
    console.log('end')
})

// PushTopic pushTopic = new PushTopic();
// pushTopic.Name = 'updateAccount';
// pushTopic.Query = 'SELECT Id,Name,Phone,ADCenterID__c,GotzhaID__c,Website,Payment_Type__c,AdCenter_Account_Type__c,GotzhaCreatedDate__c,Payment_Blocked__c,TYPE,Status__c,Communication_email__c,Country__c,BillingCountry__c  FROM Account';
// pushTopic.ApiVersion = 51.0;
// pushTopic.NotifyForOperationCreate = true;
// pushTopic.NotifyForOperationUpdate = true;
// pushTopic.NotifyForOperationUndelete = true;
// pushTopic.NotifyForOperationDelete = true;
// pushTopic.NotifyForFields = 'Referenced';


// WHERE AdCenter_Account_Type__c = 'Gotzha'

// https://workbench.developerforce.com/streaming.php