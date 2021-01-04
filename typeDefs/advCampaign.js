const {gql} = require('apollo-server')

const advCampaign = gql`
  
  extend type Query{
    campaign(id:Int!): [AdvCampaign]       
  } 
                   
  type AdvCampaign {
    id: Int
    name: String    
    user: String
    status: String
    budgetTotal: Float
    budgetDaily: Float
    cpc: Float
    landingPage: String
    landingPageValid: Boolean
    noLimit: Boolean
    spentDaily: Float
    spentTotal: Float
    countClickTotal: Int
    countClickDaily: Int
  }
  
           
  extend type Mutation {
    addCampaign(
        name: String!, 
        budgetTotal: Float!,
        budgetDaily: Float!,
        cpc: Float!,
        landingPage: String!
        status: String
        noLimit: Boolean
        landingPageValid: Boolean): addCampaign
        
     updateCampaign(
        id: Int!,
        name: String!, 
        budgetTotal: Float!,
        budgetDaily: Float!,
        status: String,
        cpc: Float!,
        landingPage: String!
        noLimit: Boolean
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
        noLimit: Boolean
        id: Int
    }
    
    type updCampaignName {
        name: String,
        id: Int
    }    
      
`

module.exports = {
    advCampaign: advCampaign,
}