const jwt = require('jsonwebtoken')
const config = require('plain-config')()

module.exports = {
    Query: {
        login: async (_, {email, password}, ctx) => {
            console.log(`\nlogin email:${email}`)
            let jwtAuthSecret = config.jwt_secret
            let token = ''
            if (email === 'admin@admin.com' && password === 'admin@admin.comadmin@admin.com'){
                token = jwt.sign({email: email}, jwtAuthSecret,{expiresIn : '1h'})
            }
            return {
                accessToken: token,
            }
            // throw new AuthenticationError('Authentication error!')
        },
    }
}