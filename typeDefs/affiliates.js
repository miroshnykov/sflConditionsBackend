const {gql} = require('apollo-server')

const affiliates = gql`
  
  extend type Query{
    affiliates: [Affiliates]    
    getAffiliatesByFilter(filter:String!): [AffiliatesFilter]    
    getAffiliatesBySegmentId(segmentId:Int!): [AffiliatesFilter]    
  } 
  
  type Affiliates {
    id: Int
    name: String    
    countryCode: String
  }
  
  type AffiliatesFilter {
    id: Int
    name: String    
    countryCode: String
  }  
`;

module.exports = {
    affiliates,
};