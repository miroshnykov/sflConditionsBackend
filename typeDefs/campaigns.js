const {gql} = require('apollo-server')

const campaigns = gql`
  
  extend type Query{
    campaigns: [Campaigns]    
  } 
                   
  type Campaigns {
    name: String    
    user: String
    status: String
    budgetTotal: Float
    budgetDaily: Float
    cpc: Float
    landing_page: String
  }
  
           
  extend type Mutation {
    addCampaign(
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
    }
      
`;

module.exports = {
    campaigns: campaigns,
};