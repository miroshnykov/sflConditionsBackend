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
    platformAndroid: Boolean
    platformIos: Boolean
    platformWindows: Boolean
    sourceTypeSweepstakes: Boolean
    sourceTypeVod: Boolean    
    softDelete:Boolean
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
        platformAndroid: Boolean!,
        platformIos: Boolean!,
        platformWindows: Boolean!,
        sourceTypeSweepstakes: Boolean!,
        sourceTypeVod: Boolean!,          
        cpc: Float!, 
        filterTypeId: Int!
     ): addTargeting
     
    deleteTargeting(
        campaignId: Int!
        softDelete: Boolean!
    ): DeleteTargeting
     
    restoreSoftDelete(
        campaignId: Int!
    ): DeleteTargeting
             
  }
  
    type DeleteTargeting {
        id: Int,
        affectedRows:Int  
    }
      
    type addTargeting {
        id: Int
        campaignId: Int 
        position: Int
        geo: String
        platformAndroid: Boolean
        platformIos: Boolean
        platformWindows: Boolean
        sourceTypeSweepstakes: Boolean
        sourceTypeVod: Boolean    
        cpc: Float
        filterTypeId: String
    }
      
`;

module.exports = {
    targeting: targeting,
};