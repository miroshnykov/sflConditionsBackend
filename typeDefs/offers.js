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
  }
`;

module.exports = {
    offers,
};