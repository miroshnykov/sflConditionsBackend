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
        // segments: async (_, {status}, ctx) => {
        //     checkUser(ctx.user)
        //     let segmentsCache = await getDataCache(`segments-${status}`)
        //     if (segmentsCache) {
        //         return segmentsCache
        //     } else {
        //         let segments = await Segment.getSegments(status)
        //         await setDataCache(`segments-${status}`, segments)
        //         return segments
        //     }
        // },
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
        createSegmentCondition: async (_, {
            segmentId,
            dimensionId,
            value,
            position,
            segmentRuleIndex,
            filterTypeId,
            matchTypeId,
            user,
            dateAdded
        }, ctx) => {
            checkUser(ctx.user)
            let data = {}
            data.segmentId = segmentId
            data.dimensionId = dimensionId
            data.value = value
            data.segmentRuleIndex = segmentRuleIndex
            data.filterTypeId = filterTypeId
            data.matchTypeId = matchTypeId
            data.position = position
            data.user = ctx.user.email
            data.dateAdded = dateAdded
            await delSegmentsCache()
            return await Segment.createSegmentCondition(data)
        },
        createRule: async (_, {
            segmentId,
            dimensionId,
            value,
            orAndCondition,
            filterTypeId
        }, ctx) => {
            checkUser(ctx.user)
            await createRuleValidations(
                segmentId,
                dimensionId,
                value,
                orAndCondition,
                filterTypeId
            )
            let ruleData = {}
            ruleData.segmentId = segmentId
            ruleData.dimensionId = dimensionId
            ruleData.value = value
            ruleData.orAndCondition = orAndCondition
            ruleData.filterTypeId = filterTypeId
            ruleData.user = ctx.user.email
            return await Segment.createRule(ruleData)
        },
        updateLandingPage: async (_, {segmentId, landingPageId}, ctx) => {
            checkUser(ctx.user)
            return await Segment.updateLandingPage(segmentId, landingPageId)
        },
        updatePositionSegments: async (_, {oldPosition, oldId, event}, ctx) => {
            checkUser(ctx.user)
            await delSegmentsCache()
            return await Segment.updatePositionSegments(oldPosition, oldId, event)
        },
        updateStatusSegment: async (_, {segmentId, status}, ctx) => {
            checkUser(ctx.user)
            await delSegmentsCache()
            return await Segment.updateStatusSegment(segmentId, status)
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
        deleteSegmentCondition: async (_, {segmentId, position}, ctx) => {
            checkUser(ctx.user)
            await delSegmentsCache()
            return await Segment.deleteSegmentCondition(segmentId, position)
        },
        deleteRule: async (_, {ruleId}, ctx) => {
            checkUser(ctx.user)
            return await Segment.deleteRule(ruleId)
        },
        deleteSegmentConditions: async (_, {segmentId}, ctx) => {
            checkUser(ctx.user)
            await delSegmentsCache()
            return await Segment.deleteSegmentConditions(segmentId)
        },
        // createSegment: async (_, {segmentName, weight, multiplier, status}, ctx) => {
        //     checkUser(ctx.user)
        //     let statusCache = status || 'inactive'
        //     await delDataCache(`segments-${statusCache}`)
        //     segmentValidations(segmentName, weight, multiplier)
        //     return await Segment.createSegment(segmentName, weight, multiplier, ctx.user.email, status)
        // },
        updateSegment: async (_, {segmentId, segmentName, weight, multiplier}, ctx) => {
            checkUser(ctx.user)
            await delSegmentsCache()
            return await Segment.updateSegment(segmentId, segmentName, weight, multiplier, ctx.user.email)
        },
        // deleteSegment: async (_, {segmentId}, ctx) => {
        //     checkUser(ctx.user)
        //     await delSegmentsCache()
        //     return await Segment.deleteSegment(segmentId, ctx.user.email)
        // }
    }
}