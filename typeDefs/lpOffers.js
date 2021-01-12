const {gql} = require('apollo-server')

const lpOffers = gql`
  
  extend type Query{
        getLpOffers: [OffersLp]   
  } 
  
  type OffersLp {
        id: Int
        name: String  
        url: String
        status: String  
        offerId: Int
  }

`;

module.exports = {
    lpOffers,
}