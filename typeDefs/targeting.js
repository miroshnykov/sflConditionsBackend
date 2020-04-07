const {gql} = require('apollo-server')

const targeting = gql`
  
  extend type Query{
    targeting(campaignId:Int!): [Targeting]       
  } 

                          
  type Targeting {
    id: Int
    name: String    
    user: String
    campaignId: Int
    geo: String
    platform: String
    sourceType: String
    cpc: Float
    matchTypeId: Float
    position: Int
    dateAdded: Int
  }
  
           
  extend type Mutation {
    addTargeting(
        name: String!, 
        ): addTargeting
        
             
  }
  
    type addTargeting {
        id: Int
    }
    
        
      
`;

module.exports = {
    targeting: targeting,
};