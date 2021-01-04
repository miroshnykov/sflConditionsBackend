const {Segment} = require('../models')
const checkUser = require('../helper/perm')
const {createRuleValidations, segmentValidations} = require('../helper/validations')
const {getDataCache, setDataCache, delDataCache} = require('../redis/redis')

const delSegmentsCache = async () => {
    await delDataCache(`segments-active`)
    await delDataCache(`segments-inactive`)
}

module.exports = {
    Query: {
        segment: async (_, {id}, ctx) => {
            checkUser(ctx.user)
            return await Segment.getSegment(id)
        },
        segmentStatus: async (_, {id}, ctx) => {
            checkUser(ctx.user)
            return await Segment.getSegmentStatus(id)
        },
        getSegmentCountFilters: async (_, {id}, ctx) => {
            checkUser(ctx.user)
            return await Segment.getSegmentCountFilters(id)
        }
    },
    Mutation: {
        saveConditions: async (_, data, ctx) => {
            checkUser(ctx.user)
            data.email = ctx.user.email
            return await Segment.saveConditions(data)
        },
        updateLandingPage: async (_, {segmentId, landingPageId}, ctx) => {
            checkUser(ctx.user)
            return await Segment.updateLandingPage(segmentId, landingPageId)
        },
        updateSegmentStatus: async (_, {segmentId, name, status}, ctx) => {
            checkUser(ctx.user)
            let obj = {}
            obj.segmentId = segmentId
            obj.name = name
            obj.status = status
            console.log('obj:', obj)
            return await Segment.updateSegmentStatus(obj)
        },

    }
}