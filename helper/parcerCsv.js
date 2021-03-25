const parserCsv = require('csv-parse')

const parserData = (data) => {
    return new Promise(async (resolve, reject) =>
        parserCsv(
            data,
            {},
            (err, output) => err ? reject(err) : resolve(output.map(record => ({
                firstName: record[0].trim(),
                lastName: record[1].trim(),
                email: record[2].trim(),
                role: record[3].trim(),
            })))
        )
    )
};

const parserDataAM = (data) => {
    return new Promise(async (resolve, reject) =>
        parserCsv(
            data,
            {},
            (err, output) => err ? reject(err) : resolve(output.map(record => ({
                firstName: record[0].trim(),
                lastName: record[1].trim(),
                email: record[2].trim(),
                role: record[3].trim(),
            })))
        )
    )
}

const parserDataAdvertisers = (data) => {
    return new Promise(async (resolve, reject) =>
        parserCsv(
            data,
            {},
            (err, output) => err ? reject(err) : resolve(output.map(record => ({
                advertiserId: record[0].trim(),
                advertiserName: record[1].trim(),
                status: record[2].trim(),
                accountManagerId: record[3].trim(),
                advertiserManager: record[4].trim(),
                website: record[5].trim(),
                tags: record[6].trim(),
                dateAdded: record[7].trim(),
                descriptions: record[8].trim(),
            })))
        )
    )
}

const parserDataOffers = (data) => {
    return new Promise(async (resolve, reject) =>
        parserCsv(
            data,
            {},
            (err, output) => err ? reject(err) : resolve(output.map(record => ({
                offerIdOrigin: record[0].trim(),
                offerName: record[1].trim(),
                verticals: record[2].trim(),
                advertiserId: record[3].trim(),
                advertiserName: record[4].trim(),
                conversionType: record[5].trim(),
                offerType: record[6].trim(),
                payOut: record[7].trim(),
                payIn: record[8].trim(),
                contracts: record[9].trim(),
                lpUrl: record[10].trim(),
                tags: record[11].trim(),
                expirationDate: record[12].trim(),
                hidden: record[13].trim(),
                offerStatus: record[14].trim(),
                clickCap: record[15].trim(),
                clickCapInterval: record[16].trim(),
                clickCapCustomStartDate: record[17].trim(),
                conversionCap: record[18].trim(),
                conversionCapInterval: record[19].trim(),
                conversionCapCustomStartDate: record[20].trim(),
                redirectOffer: record[21].trim(),
                redirect404: record[22].trim(),
                created: record[23].trim(),
                notes: record[24].trim(),
                description: record[25].trim(),
                currency: record[26].trim(),
            })))
        )
    )
}

const parserDataAffiliates = (data) => {
    return new Promise(async (resolve, reject) =>
        parserCsv(
            data,
            {},
            (err, output) => err ? reject(err) : resolve(output.map(record => ({
                affiliateIdOrigin: record[0].trim(),
                affiliateName: record[1].trim(),
                accountManagerName: record[2].trim(),
                status: record[3].trim(),
                billingCycle: record[4].trim(),
                minimumPaymentThreshold: record[5].trim(),
                currency: record[6].trim(),
                created: record[7].trim(),
                lastTrafficData: record[8].trim(),
                notes: record[9].trim(),
                postbackURL: record[10].trim(),
                email: record[11].trim()
            })))
        )
    )
}


module.exports = {
    parserDataAffiliates,
    parserDataAM,
    parserDataAdvertisers,
    parserDataOffers
}
