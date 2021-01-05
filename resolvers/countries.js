const { Countries } = require('../models')
const checkUser = require('../helper/perm')
const {getDataCache, setDataCache} = require('../redis/redis')

module.exports = {
    Query: {
        countries: async (_, { }, ctx) => {
            checkUser(ctx.user)
            let countriesCache = await getDataCache(`countries`)
            if (countriesCache) {
                return countriesCache
            } else {
                let countries = await Countries.all()
                await setDataCache(`countries`, countries)
                return countries
            }

        },
    },
}
