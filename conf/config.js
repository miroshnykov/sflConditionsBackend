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
        secret_key: '',
        access_key: '',
        region: '',
        queue_url: ''
    },
    googleSso: {
        url: 'https://am-ssoauth.surge.systems/'
    },
    am_app_key: '',
    googleAuth: {
        oauthCallback: '',
        redirectToOptiPlatformsuccesslogin: '',
        redirectToOptiPlatformerrorlogin: '',
        redirectToOptiPlatformsuccess: '',
        clientId: '',
        clientSecret: ''
    },
    hyunaRandomSites: 'http://admin-wt.jomediainc.com/api/getRandomSites.php'
}

module.exports = config
