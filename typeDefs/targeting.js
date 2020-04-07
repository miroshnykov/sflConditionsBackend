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
    filterTypeId: Int
    position: Int
    dateAdded: Int
  }
  
           
  extend type Mutation {
    addTargeting(
        campaignId: Int!, 
        position: Int!, 
        geo: String!, 
        platform: String!, 
        sourceType: String!, 
        cpc: Float!, 
        filterTypeId: Int!
     ): addTargeting
        
             
  }
  
    type addTargeting {
        id: Int
        campaignId: Int 
        position: Int
        geo: String
        platform: String 
        sourceType: String 
        cpc: Float
        filterTypeId: String
    }
    
        
      
`;

module.exports = {
    targeting: targeting,
};