const {gql} = require('apollo-server')

const offers = gql`
  
  extend type Query{
        getOffer(id:Int!): Offer    
        getOffers: [Offers]  
        getOfferHistory(id:Int!): [OfferHistory]  
  } 
  
  type Offer {
        id: Int
        name: String  
        conversionType: String
        status: String  
        payIn: Float
        advertiser: String
        descriptions: String
        verticals: String
        geoRules: String
        defaultLp: Int
        isCpmOptionEnabled: Int
        payoutPercent: Int
        offerIdRedirect: Int
        customLPRules: String
        payOut: Float
        dateAdded: Int
  }
                   
  type OfferHistory {
        id: Int
        sflOfferId: Int
        user: String  
        action: String  
        dateAdded: Int        
        logs: String
  }  
  type Offers {
        id: Int
        name: String 
        status: String  
        payIn: Float
        payOut: Float 
        verticals: String
        advertiser: String
        descriptions: String        
        dateAdded: Int 
        dateUpdated: String 
        defaultLandingPageId: Int 
        isCpmOptionEnabled: Int
        payoutPercent: Int        
        nameLandingPage: String 
        urlLandingPage: String 
        countOfCampaigns: Int
  }
`;

module.exports = {
    offers,
};