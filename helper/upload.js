const {
    parserDataAM,
    parserDataAdvertisers,
    parserDataAffiliates,
    parserDataOffers
} = require('./parcerCsv')

const {
    uploadManagers,
    uploadAdvertisers,
    uploadOffers,
    uploadAffiliates
} = require('../db/uploads')

const uploadProcessing = async (req, res) => {
    let result={}
    try {
        let typeFile = [
            'First Name',
            'Advertiser ID',
            'Offer ID',
            'Affiliate ID'
        ]
        let typeFile_ = [
            'managers',
            'advertisers',
            'offers',
            'affiliates'
        ]

        // console.log('req.body.dataFile:', req.body.dataFile.substr(0, 15))
        let fileDataStr = req.body.dataFile.substr(0, 15)
        let findType = []
        typeFile.forEach((item, index) => {
            if (fileDataStr.includes(item)) {
                findType.push(typeFile_[index])
            }
        })

        if (findType.length !== 0) {
            console.log('findType:', findType[0])
            switch (findType[0]) {
                case `managers`:
                    // console.log('managers')
                    let managers_ = await parserDataAM(req.body.dataFile)
                    // managers_ = managers_.shift()
                    // console.log('managers:', managers_)
                    let inserted = []
                    let managerOrigin = []
                    if (managers_.length !== 0) {
                        let count = 0

                        for (const i of managers_) {
                            if (count !== 0) {
                                managerOrigin.push(i)
                                let res = await uploadManagers(i)
                                if (res && res.id) {
                                    inserted.push(i)
                                }
                            }
                            count++
                        }

                    }
                    result.type = 'managers'
                    result.insertRecords = JSON.stringify(inserted)
                    result.insertRecordsCount = inserted.length
                    result.totalRecords = managerOrigin.length
                    result.success = true
                    break

                case `advertisers`:
                    // console.log(' advertisers')
                    let advertisers_ = await parserDataAdvertisers(req.body.dataFile)
                    // console.log(advertisers_.length)
                    let insertedAdv = []
                    let advOrigin = []
                    let errors = []
                    if (advertisers_.length !== 0) {
                        let count = 0
                        for (const i of advertisers_) {
                            if (count !== 0) {
                                advOrigin.push(i)
                                let res = await uploadAdvertisers(i)
                                if (res && res.id) {
                                    insertedAdv.push(i)
                                } else if (res && res.error) {
                                    errors.push(res.error)
                                }
                                // console.log('advertisers_:', i)
                            }
                            count++
                        }

                    }
                    result.type = 'advertisers'
                    result.insertRecords = JSON.stringify(insertedAdv)
                    result.insertRecordsCount = insertedAdv.length
                    result.errors = JSON.stringify(errors)
                    result.totalRecords = advOrigin.length
                    result.success = true
                    break
                case `offers`:
                    console.log('offers')
                    let offers = await parserDataOffers(req.body.dataFile)
                    // console.log(offers)
                    let insertedOffers = []
                    let originOffers = []
                    let errorsOffers = []
                    if (offers.length !== 0) {
                        let count = 0
                        for (const i of offers) {
                            if (count !== 0) {
                                originOffers.push(i)
                                i.email = req.email
                                let res = await uploadOffers(i)
                                if (res && res.id) {
                                    insertedOffers.push(i)
                                } else if (res && res.error) {
                                    errorsOffers.push(res.error)
                                }
                                // console.log('advertisers_:', i)
                            }
                            count++
                        }

                    }
                    result.type = 'offers'
                    result.insertRecords = JSON.stringify(insertedOffers)
                    result.insertRecordsCount = insertedOffers.length
                    result.errors = JSON.stringify(errorsOffers)
                    result.totalRecords = originOffers.length
                    result.success = true

                    break
                case `affiliates`:
                    console.log('affiliates')
                    let affiliates = await parserDataAffiliates(req.body.dataFile)
                    // console.log(offers)
                    let insertedAffiliates = []
                    let originAffiliates = []
                    let errorsAffiliates = []
                    if (affiliates.length !== 0) {
                        let count = 0
                        for (const i of affiliates) {
                            if (count !== 0) {
                                originAffiliates.push(i)
                                i.email = req.email
                                let res = await uploadAffiliates(i)
                                if (res && res.id) {
                                    insertedAffiliates.push(i)
                                } else if (res && res.error) {
                                    errorsAffiliates.push(res.error)
                                }
                                // console.log('advertisers_:', i)
                            }
                            count++
                        }

                    }
                    result.type = 'affiliates'
                    result.insertRecords = JSON.stringify(insertedAffiliates)
                    result.insertRecordsCount = insertedAffiliates.length
                    result.errors = JSON.stringify(errorsAffiliates)
                    result.totalRecords = originAffiliates.length
                    result.success = true

                    break

                default:

            }
        }

        console.log(`Result:`, result)
        res.send(result)

    } catch (e) {
        result.success = false
        result.error = JSON.stringify(e)
        res.send(result)
    }

}

module.exports = {
    uploadProcessing
}
