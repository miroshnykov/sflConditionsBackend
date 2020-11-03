let env

if (process.env.CI) {
    env = `CI`
}

let config

config = {
    env: process.env.NODE_ENV || env || `production`,
    port: 3000,
    host: '',
    jwt_secret: '',
    mysql: {
        host: '',
        port: 0,
        user: '',
        password: '',
        database: ''
    },
    aws: {
        key: '',
        access_key: '',
        region: ''
    },
    googleSso: {
        url: 'http://localhost:9080/'
    },
    am_app_key: 'hqu89vxp4izs',
    googleAuth: {
        oauthCallback: '',
        redirectToOptiPlatformsuccesslogin: '',
        redirectToOptiPlatformerrorlogin: '',
        redirectToOptiPlatformsuccess: '',
        clientId: '',
        clientSecret: ''
    }
}

module.exports = config
