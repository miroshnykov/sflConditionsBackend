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
    updateLp(
        id: Int!,
        segmentId: Int!, 
        lpId: Int!, 
        weight: Int!
     ): UpdateLp     
     deleteSegmentLp(
        id: Int!, 
     ): DeleteSegmentLp    
            
  }
  
    type DeleteSegmentLp {
        id:Int  
    }
      
    type CreateLp {
        segmentId: Int
        lpId: Int 
        weight: Int
    }
    type UpdateLp {
        id:Int
        segmentId: Int
        lpId: Int 
        weight: Int
    }    
`;

module.exports = {
    lp,
}