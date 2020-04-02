const {gql} = require('apollo-server')

const campaigns = gql`
  
  extend type Query{
    campaigns: [Campaigns]
    campaign(id:Int!): [Campaigns]       
  } 
                   
  type Campaigns {
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
  }
  
    type addCampaign {
        name: String, 
        budgetTotal: Float  
        budgetDaily: Float  
        cpc: Float
        landingPage: String
        id: Int
    }
      
`;

module.exports = {
    campaigns: campaigns,
};