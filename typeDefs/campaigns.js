const {gql} = require('apollo-server')

const campaigns = gql`
  
  extend type Query{
        getCampaign(affiliateId:Int!): [Campaign]    
        getCampaigns: [Campaigns]  
  } 
  
  type Campaign {
        id: Int
        name: String    
  }
  type Campaigns {
        id: Int
        name: String 
        affiliateId: Int   
  }
`;

module.exports = {
    campaigns,
};