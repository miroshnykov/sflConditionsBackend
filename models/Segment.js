const {
    getSegment,
    getSegmentStatus,
    updateSegmentStatus,
    getSegmentCountFilters,
    createSegment,
    deleteSegment,
    updateLandingPage,
    saveConditions
} = require('../db/segment')

class Segment {

    static async saveConditions(data) {
        return await saveConditions(data)
    }

    static async updateLandingPage(segmentId, landingPageId) {
        return await updateLandingPage(segmentId, landingPageId)
    }

    static async getSegment(id) {
        return await getSegment(id)
    }

    static async getSegmentStatus(id) {
        return await getSegmentStatus(id)
    }

    static async getSegmentCountFilters(id) {
        return await getSegmentCountFilters(id)
    }

    static async createSegment(segmentName, weight, multiplier, user, status) {
        return await createSegment(segmentName, weight, multiplier, user, status)
    }
    static async deleteSegment(segmentId, user) {
        return await deleteSegment(segmentId, user)
    }

    static async updateSegmentStatus(data) {
        return await updateSegmentStatus(data)
    }
}

module.exports = {
    Segment,
};