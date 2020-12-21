const {gql} = require('apollo-server')

const segments = gql`
  
  extend type Query{
    segments(type:String!): [Segments]
  } 

  type Segments {
    id: Int
    name: String    
    status: String
    position: Int
    dateAddedUnixTime: Int
    dateAdded: String
    lp:[LandingPages]
  }  

  type LandingPages {
        id: Int
        segmentId: Int
        lpId: Int
        name: String
        weight: Int
  }
    
  extend type Mutation {
  
    ordering(
        segmentType: String!,
        reordering: [OrderInput]): [Order]
        
    createSegment(
        name: String!
        type: String!
    ): CreateSegment   
    
    deleteSegment(
        id: Int!
        segmentType: String!
    ): SegmentDelete
                 
  }
   
  type CreateSegment {
        name: String
        type: String
        id: Int
  }
   
  type SegmentDelete {
    id: Int  
  }
     
  type Order {
      id:Int
      position:Int
  }
  
  input OrderInput {
    id:Int
    position:Int
  }
  
    
`


module.exports = {
    segments: segments,
}