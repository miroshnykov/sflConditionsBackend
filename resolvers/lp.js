const {Lp} = require('../models')
const checkUser = require('../helper/perm')
const {getDataCache, setDataCache} = require('../redis/redis')

module.exports = {
    Query: {
        lp: async (_, {}, ctx) => {
            checkUser(ctx.user)
            let lpCache = await getDataCache(`lp`)
            if (lpCache) {
                return lpCache
            } else {
                let lp = await Lp.all()
                await setDataCache(`lp`, lp)
                return lp
            }

        },
    },
}