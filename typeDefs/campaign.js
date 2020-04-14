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
    landingPageValid: Boolean
  }
  
           
  extend type Mutation {
    addCampaign(
        name: String!, 
        budgetTotal: Float!,
        budgetDaily: Float!,
        cpc: Float!,
        landingPage: String!
        status: String
        landingPageValid: Boolean): addCampaign
        
     updateCampaign(
        id: Int!,
        name: String!, 
        budgetTotal: Float!,
        budgetDaily: Float!,
        status: String,
        cpc: Float!,
        landingPage: String!
        landingPageValid: Boolean): addCampaign
        
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
        status: String
        landingPage: String
        landingPageValid: Boolean
        id: Int
    }
    
    type updCampaignName {
        name: String,
        id: Int
    }    
      
`

module.exports = {
    campaign: campaign,
}