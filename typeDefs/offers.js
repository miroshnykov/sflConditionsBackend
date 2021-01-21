const {gql} = require('apollo-server')

const offers = gql`
  
  extend type Query{
        getOffer(id:Int!): [Offer]    
        getOffers: [Offers]  
  } 
  
  type Offer {
        id: Int
        name: String  
        conversionType: String
        status: String  
        payIn: Float
        advertiser: String
        geoRules: String
        defaultLp: Int
        offerIdRedirect: Int
        customLPRules: String
        payOut: Float
        dateAdded: Int
  }
  type Offers {
        id: Int
        name: String 
        status: String  
        payIn: Float
        payOut: Float 
        dateAdded: Int 
        dateUpdated: String 
        defaultLandingPageId: Int 
        nameLandingPage: String 
        countOfCampaigns: Int
  }
`;

module.exports = {
    offers,
};