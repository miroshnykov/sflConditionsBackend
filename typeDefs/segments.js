const {gql} = require('apollo-server')

const segments = gql`
  
  extend type Query{
    segments: [Segments]
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
        name: String
        weight: Int
  }
    
  extend type Mutation {
    ordering(reordering: [OrderInput]): [Order]
        
    createSegment(
        name: String!
    ): CreateSegment   
    
    deleteSegment(
        id: Int!
    ): SegmentDelete
                 
  }
   
  type CreateSegment {
        name: String
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