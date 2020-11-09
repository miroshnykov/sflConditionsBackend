const {
    getSegment,
    getSegmentCountFilters,
    createSegmentCondition,
    createRule,
    deleteRule,
    deleteSegmentCondition,
    deleteSegmentConditions,
    createSegment,
    deleteSegment,
    updateSegment,
    updatePositionSegments,
    updateStatusSegment
} = require('../db/segment')

class Segment {

    static async updatePositionSegments(oldPosition, oldId, event) {
        return await updatePositionSegments(oldPosition, oldId, event)
    }

    static async updateStatusSegment(segmentId, status) {
        return await updateStatusSegment(segmentId, status)
    }

    static async getSegment(id) {
        return await getSegment(id)
    }

    static async getSegmentCountFilters(id) {
        return await getSegmentCountFilters(id)
    }

    static async createSegmentCondition(data) {
        return await createSegmentCondition(data)
    }

    static async createRule(data) {
        return await createRule(data)
    }

    static async deleteRule(ruleId) {
        return await deleteRule(ruleId)
    }

    static async deleteSegmentCondition(segmentId, position) {
        return await deleteSegmentCondition(segmentId, position)
    }

    static async deleteSegmentConditions(segmentId) {
        return await deleteSegmentConditions(segmentId)
    }

    static async createSegment(segmentName,weight, multiplier, user, status) {
        return await createSegment(segmentName, weight, multiplier, user, status)
    }
    static async deleteSegment(segmentId, user) {
        return await deleteSegment(segmentId, user)
    }

    static async updateSegment(segmentId, segmentName, weight, multiplier, user) {
        return await updateSegment(segmentId, segmentName, weight, multiplier, user)
    }
}

module.exports = {
    Segment,
};