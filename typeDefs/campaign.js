const {gql} = require('apollo-server')

const campaign = gql`
  
  extend type Query{
    campaign(id:Int!): [Campaign]       
  } 
                   
  type Campaign {
    id: Int
    name: String    
    user: String
    status: String
    budgetTotal: Float
    budgetDaily: Float
    cpc: Float
    landingPage: String
  }
  
           
  extend type Mutation {
    addCampaign(
        name: String!, 
        budgetTotal: Float!,
        budgetDaily: Float!,
        cpc: Float!,
        landingPage: String!): addCampaign
        
     updateCampaign(
        id: Int!,
        name: String!, 
        budgetTotal: Float!,
        budgetDaily: Float!,
        cpc: Float!,
        landingPage: String!): addCampaign
        
     updateCampaignName(
        id: Int!,
        name: String!): updCampaignName
              
     deleteCampaign(
        campaignId: Int!
     ): DeleteCampaign  
  }
  
    type DeleteCampaign {
        id: Int,
        affectedRows:Int  
    }
    
    type addCampaign {
        name: String, 
        budgetTotal: Float  
        budgetDaily: Float  
        cpc: Float
        landingPage: String
        id: Int
    }
    
    type updCampaignName {
        name: String,
        id: Int
    }    
      
`;

module.exports = {
    campaign: campaign,
};