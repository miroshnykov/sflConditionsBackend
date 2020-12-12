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
    Mutation: {
        createLp: async (_, {
            segmentId,
            lpId,
            weight
        }, ctx) => {
            checkUser(ctx.user)
            let obj = {}
            obj.segmentId = segmentId
            obj.lpId = lpId
            obj.weight = weight
            return await Lp.create(obj)

        },
        deleteSegmentLp: async (_, {segmentId, lpId}, ctx) => {
            checkUser(ctx.user)
            let obj = {}
            obj.segmentId = segmentId
            obj.lpId = lpId
            return await Lp.del(obj)
        },
    }
}