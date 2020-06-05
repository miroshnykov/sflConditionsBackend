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
const axios = require('axios')

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

const app = express()

app.use(cors())

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
            domain = prefix + '://'+ domain
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

server.applyMiddleware({app})

app.listen({port: 4001}, () =>
    console.log(`\n🚀\x1b[35m Server ready at http://localhost:4001${server.graphqlPath} \x1b[0m \n`)
)


