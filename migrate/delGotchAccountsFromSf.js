
// node migrate/delGotchAccountsFromSf.js

const waitFor = delay => new Promise(resolve => setTimeout(resolve, delay))

const delGotchAccounts = async () => {
    const salesForce = require('../helper/salesForce')

    await waitFor(5000)

    try {
        let delSFAccounts = 0
        let accounts = await salesForce.getGotchaAccounts()

        console.log('accounts.length:', accounts.totalSize)
        // console.log('accounts.length:', accounts.records)

        for (const item of accounts.records) {

            let res = await salesForce.deleteAccount(item.Id)
            if (res.id) {
                delSFAccounts++
            }
        }
        console.log('deleted sf accounts:', delSFAccounts)
    } catch (e) {
        console.log(e)
    }
}


(async () => {
    return await delGotchAccounts()
})().then(v => {
    console.log('end')
})