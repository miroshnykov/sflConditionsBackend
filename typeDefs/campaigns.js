const {gql} = require('apollo-server')

const campaigns = gql`
  
  extend type Query{
        getCampaign(affiliateId:Int!): [Campaign]    
        getCampaigns(segmentId:Int!): [Campaigns]  
  } 
  
  type Campaign {
        id: Int
        name: String 
        affiliateId: Int   
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