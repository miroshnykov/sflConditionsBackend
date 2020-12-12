const {gql} = require('apollo-server')

const lp = gql`
  
  extend type Query{
    lp: [Lp]    
  } 
  
  type Lp {
    id: Int
    name: String
  }
  
           
  extend type Mutation {
    createLp(
        segmentId: Int!, 
        lpId: Int!, 
        weight: Int!
     ): CreateLp
     deleteSegmentLp(
        segmentId: Int!, 
        lpId: Int!, 
     ): DeleteSegmentLp    
            
  }
  
    type DeleteSegmentLp {
        segmentId: Int,
        lpId:Int  
    }
      
    type CreateLp {
        segmentId: Int
        lpId: Int 
        weight: Int
    }
`;

module.exports = {
    lp,
}