// const {AuthenticationError} = require('apollo-server')
const {typeDefs} = require('./typeDefs')
const {resolvers} = require('./resolvers')
const jwt = require('jsonwebtoken')
const parser = require('ua-parser-js')

const getTime = (date) => (~~(date.getTime() / 1000))
const express = require('express');
const {ApolloServer, AuthenticationError} = require('apollo-server-express')
const {google} = require('googleapis')
let oAuth2 = google.auth.OAuth2
const config = require('plain-config')()
const clientId = config.googleAuth.clientId
const clientSecret = config.googleAuth.clientSecret
const oauthCallback = config.googleAuth.oauthCallback
const {v4} = require('uuid')
const base64 = require('base-64')
const utf8 = require('utf8')
const {setUser} = require('./db/user')
const {uploadManagers, uploadAdvertisers, uploadOffers} = require('./db/uploads')
const axios = require('axios')
const parserCsv = require('csv-parse')

const cors = require('cors')
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({req}) => {
        let secret = config.jwt_secret

        let result = {
            jwtAuthSecret: secret
        }
        const token = req.headers[Object.keys(req.headers).find(key => key.toLowerCase() === 'authorization'.toLowerCase())] || ''
        if (!token) {
            result.user = undefined
        } else {
            let agent = parser(req.headers['user-agent'])
            const splitToken = token.split(' ')[1]
            let tokenInfo
            try {

                tokenInfo = jwt.verify(splitToken, secret)
                // console.log('tokenInfo:',tokenInfo)
                // if (tokenInfo.email !== 'admin@admin.com') {
                //     let err = `this email ${tokenInfo.email} not have permitions to application`
                // console.log(err)
                // throw new AuthenticationError(err)
                // }
                // console.log(' << verify token success:', tokenInfo)
                // let t = getTime(new Date)
                // console.log( "time" , t)
            } catch (e) {
                // console.log(e)
                throw new AuthenticationError('Authentication token is invalid, please log in')
            }

            let user = []
            user.agent = agent
            user.email = tokenInfo && tokenInfo.email || ''
            user.id = tokenInfo && tokenInfo.id || ''
            result.user = user
        }
        return result
    },
    playground: true
})


const getOAuthClient = () => (new oAuth2(clientId, clientSecret, oauthCallback))

const getAuthUrl = () => {
    let oauth2Client = getOAuthClient()
    let scopes = [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
    ]

    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    })

}

const getTokenSaveSession = async (code, res) => {
    let oauth2Client = getOAuthClient()
    return oauth2Client.getToken(code, (err, tokens) => {

        if (!err) {
            oauth2Client.setCredentials(tokens)
            let sessionId = v4()
            getUserInfo(tokens).then((info) => {

                if (info.hd === 'actionmediamtl.com' ||
                    info.hd === 'grindstonecapital.ca' ||
                    info.hd === 'adsurge.com' ||
                    info.hd === 'hyuna.bb'
                ) {

                    res.redirect(`${config.googleAuth.redirectToOptiPlatformsuccess}id=${sessionId}&email=${info.email}`)
                } else {
                    let emailToSend = info.email.split('.').join("")
                    res.redirect(`${config.googleAuth.redirectToOptiPlatformerrorlogin}${emailToSend}`)
                }
            })

        } else {
            console.error('err:', err)
            res.redirect(`${config.googleAuth.redirectToOptiPlatformerrorlogin}/error`)
        }
    })
}

const getUserInfo = async (tokens) => {
    let oauth2Client = await getOAuthClient()
    oauth2Client.setCredentials(tokens)

    let oauth2 = google.oauth2({
        auth: oauth2Client,
        version: 'v2',
    })

    let info = await oauth2.userinfo.v2.me.get()

    await setUser(info.data)

    return info.data
}

const {ExpressCurrentUser} = require('am-components-backend')

const currentUser = ExpressCurrentUser(config.googleSso.url, config.am_app_key)
const app = express()

app.use(cors())

app.use(currentUser);

app.get('/health', (req, res, next) => {
    res.send('Ok')
})

app.get('/loginUrl', (req, res) => {
    let url = getAuthUrl()
    // console.log('url:',url)
    res.json(url)
})

app.get('/verifyLP', async (req, res) => {
    let response
    try {
        let domain = req.query.domain

        let prefix = 'http'
        if (domain.substr(0, prefix.length) !== prefix) {
            domain = prefix + '://' + domain
        }

        let requestValidate = axios.create({
            baseURL: domain,
            headers: {
                'Content-Type': 'application/json'
            },
            // timeout: 10000
        });
        let params = {
            method: 'get'
        }

        const response = await requestValidate(params)
        res.json(response.status)
    } catch (e) {
        console.log(`\nERROR here \x1b[33m  \x1b[0m details:\n  ${String(e) || ''}\n${e.config && JSON.stringify(e.config) || ''}`)
        console.log(`${e.syscall && e.syscall || ''} ${e.address && e.address || ''} ${e.port && e.port || ''} ${e.code && e.code || ''} ${e.errno && e.errno || ''}`)
        console.log(`${e.response && e.response.status || ''} `)
        console.log(`${e.response && e.response.statusText || ''}`)
    }
    res.json(response)
})


app.get('/verifyToken', (req, res) => {
    let response
    try {
        let tokenInfo = jwt.verify(req.query.token, config.jwt_secret)


        if (tokenInfo && tokenInfo.email) {
            console.log('\ntokenInfoEmail:', tokenInfo.email)
            response = tokenInfo.email
        }
    } catch (e) {
        console.log('*** token is not valid')
        response = false
    }
    res.json(response)
})

app.get('/oauthCallback', async (req, res) => {
    await getTokenSaveSession(req.query.code, res)
})

app.get('/successlogin', async (req, res) => {

    // console.log('successlogin')
    // console.log(req.query)
    let token = jwt.sign({email: req.query.email, id: req.query.id}, config.jwt_secret, {expiresIn: '1h'})
    let bytes = utf8.encode(token);
    let encoded = base64.encode(bytes);

    res.redirect(`${config.googleAuth.redirectToOptiPlatformsuccesslogin}${encoded}`)
})

app.get('/errorlogin', async (req, res) => {
    // console.log(` *** google auth error by this email:${req.query.email}`)
    res.redirect(`${config.googleAuth.redirectToOptiPlatformerrorlogin}${req.query.email}`)
    // await getTokenSaveSession(req.query.code, res)
})

app.use(express.json());

app.get('/salesProcessing', async (req, res) => {

    let archiveRecords = await salesProcessingTest(req)
    res.send(archiveRecords);

})

const checkToken = async (req, res, next) => {
    try {

        let tokenInfo = jwt.verify(req.headers.authorization, config.jwt_secret)
        if (tokenInfo && tokenInfo.email) {
            req.email = tokenInfo.email
            next()
        }

    } catch (err) {
        console.log(err)
    }
}

app.post('/upload', checkToken, async (req, res, next) => {

    let result = {}
    try {
        let typeFile = [
            'First Name',
            'Advertiser ID',
            'Offer ID'
        ]
        let typeFile_ = [
            'managers',
            'advertisers',
            'offers'
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
})

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


server.applyMiddleware({app})

app.listen({port: 4001}, () =>
    console.log(`\n🚀\x1b[35m Server ready at http://localhost:4001${server.graphqlPath}  Using node ${process.version} \x1b[0m \n`)
)


