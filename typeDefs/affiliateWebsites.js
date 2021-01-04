const {gql} = require('apollo-server')

const affiliateWebsites = gql`
  
  extend type Query{
  
        getAffiliateWebsites: [AffiliateWebsites]  
  } 
       
  type AffiliateWebsites {
        id: Int
        link: String 
        status: String 
        affiliateId: Int   
  }
`;

module.exports = {
    affiliateWebsites,
};