const {gql} = require('apollo-server')

const segment = gql`
      extend type Query {   
            segment(id:Int!): [Segment]
            
            segmentStatus(id:Int!): [SegmentStatus]
            
            getSegmentCountFilters(id:Int!) : [SegmentCountFilters]
      }
  
      extend type Mutation {
            saveConditions(
                id: Int!,
                name: String!,
                status: String!,
                isOverrideProduct: Int!,
                filters: [FiltersInput]): Filters
              
                updateLandingPage(
                    id: Int!,
                    segmentId: Int!,
                    landingPageId: Int!
                ):UpdateLandingPage


            updateSegmentStatus(
                segmentId: Int!
                name: String!
                status: String!): updateSegmentStatus   
                                                
            
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
      input FiltersInput {
            segmentId:Int
            dimensionId:Int
            value:String
            position:Int
            segmentRuleIndex:Int
            filterTypeId:Int
            matchTypeId:Int
      }
        
      type Filters {
            segmentId:Int
      }        
  
      type SegmentCountFilters{
            segmentRuleCount: Int!
      }

      type updateSegmentStatus{
            segmentId: Int,
            status: String 
            name: String 
      }      
      type SegmentStatus {
            name: String
            status: String
            isOverrideProduct: Int
            dateAdded: String
            dateUpdated: String
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
      
      type UpdateSegment {
            segmentId: Int
            segmentName: String
            weight: Int
            multiplier: Float
      }  
      
      type DeleteSegment1 {
            segmentId: Int
      }
         
      type UpdateLandingPage {
            id: Int
      }              

`;

module.exports = {
    segment,
};