const {Prod} = require('../models')
const checkUser = require('../helper/perm')
const {getDataCache, setDataCache} = require('../redis/redis')

module.exports = {
    Query: {
        prods: async (_, {}, ctx) => {
            checkUser(ctx.user)
            let prodsCache = await getDataCache(`prods`)
            if (prodsCache) {
                return prodsCache
            } else {
                let prods = await Prod.all()
                await setDataCache(`prods`, prods)
                return prods
            }
        }
    }
}