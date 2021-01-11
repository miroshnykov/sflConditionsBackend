const {gql} = require('apollo-server')

const offer = gql`
  
          
  extend type Mutation {
    createOffer(
        name: String!, 
     ): CreateOffer

    saveOffer(
        id: Int!
        name: String!
        advertiser: String!
        conversionType: String!
        geoRules: String!
        payIn: Float!
        payOut: Float!
        status: String!
     ): SaveOffer
          
    delOffer(
        id: Int!
    ): DelOffer
             
  }
  
    type CreateOffer {
        id: Int
    }   
     
    type SaveOffer {
        id: Int
    }
       
    type DelOffer {
        id: Int  
    }
      
`

module.exports = {
    offer,
}