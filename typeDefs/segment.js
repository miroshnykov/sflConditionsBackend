const {gql} = require('apollo-server')

const segment = gql`
      extend type Query {   
            segments1(status:String!): [Segments1]
            
            segment(id:Int!): [Segment]
            
            getSegmentCountFilters(id:Int!) : [SegmentCountFilters]
      }
  
      extend type Mutation {
            createSegmentCondition(
                segmentId: Int!, 
                user: String,
                dimensionId: Int!,
                value: String!,
                position: Int!,
                filterTypeId: Int!,
                matchTypeId: Int!,
                dateAdded: Int!,
                segmentRuleIndex:Int!): CreateSegmentCondition

            createRule(
                segmentId: Int!, 
                dimensionId: Int!,
                value: String!,
                filterTypeId: Int!,
                orAndCondition: String): CreateRule

            deleteRule(
                ruleId: Int!): DeleteRule
                                                
            updatePositionSegments(
                oldPosition: Int!, 
                oldId: Int!,
                event: String!): UpdatePositionSegments    

            updateStatusSegment(
                segmentId: Int!
                status: String!): updateStatusSegment   
                                
            deleteSegmentCondition(
                segmentId: Int!,
                position: Int!
            ): SegmentConditionDelete
            
            deleteSegmentConditions(
                segmentId: Int!
            ): SegmentDelete1
            
            createSegment1(
                segmentName: String!,
                weight: Int!,
                multiplier: Float!,
                status: String,
                id: Int
            ): CreateSegment1
            
            updateSegment(
                segmentId: Int!
                segmentName: String!,
                weight: Int!
                multiplier: Float
            ): UpdateSegment
                       
             deleteSegment1(
                segmentId: Int!
            ): DeleteSegment1
      }
      
      type SegmentCountFilters{
            segmentRuleCount: Int!
      }
      type UpdatePositionSegments{
            oldPosition: Int, 
            oldId: Int,
            event: String
      }
      type updateStatusSegment{
            segmentId: Int,
            status: String 
      }      
      type Segment {
            id: Int
            dimensionName: String
            dimensionId: Int  
            user: String
            userName: String
            value: String  
            filterTypeId: Int
            matchTypeId: Int
            position: Int
            segmentRuleIndex: Int
            dateAdded: Int
            ruleId:Int
      }
      
      type CreateSegment1 {
            segmentName: String
            weight: Int
            multiplier: Float,
            status: String,
            id: Int
      }
      
      type UpdateSegment {
            segmentId: Int
            segmentName: String
            weight: Int
            multiplier: Float
      }  
      
      type DeleteSegment1 {
            segmentId: Int
      }
      
      type DeleteRule {
            ruleId: Int
      }
      type Segments1 {
            id: Int
            name: String
            status: String
            userName: String
            existRecords: Int
            countConditions: Int
            countSalesTransferToMonebadger: Int
            countSalesToArhive: Int
            countSales: Int
            position: Int
            weight: Int
            multiplier: Float
            history:[History]
            statsSales:[StatsSales],
            conditions:[Segment]
      }
                  
      type History {
            userName: String
            segmentId: Int
            segmentName: String    
            events: String
            weight: Int
            multiplier: Float
            dateAdded: Int
      }
      
      type StatsSales{
            id: Int
            affiliateId: Int    
            costPerUnit: Float
            multiplier: Float
            totalSum: Float
            programId: Int
            campaignId: Int
            paymentId: Int
            payoutId: Int
            dateAdded: Int
            optiDateAdded: Int
            segmentName: String
            segmentResolveInfo: String
            segmentId: Int
            transferMoneybadger: String
            lid: String
      }
    
      type CreateSegmentCondition {
            user: String
            dimensionName: String
            dimensionId: Int  
            value: String  
            filterTypeId: Int
            matchTypeId: Int
            position: Int
            dateAdded: Int
            segmentRuleIndex: Int
      }
                
      type CreateRule {
            segmentId: Int, 
            dimensionId: Int  
            value: String  
            ruleId: Int
            filterTypeId: Int
            orAndCondition: Int
      }
      
      type SegmentDelete1 {
            segmentId: Int  
      }
     
      type SegmentConditionDelete {
            segmentId: Int,
            position: Int  
      } 

`;

module.exports = {
    segment,
};