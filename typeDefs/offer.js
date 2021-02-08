const {gql} = require('apollo-server')

const offer = gql`
  
  extend type Query{
    getOfferCap(offerId:Int!): [CapOffer]
  }     
  
    type CapOffer {
        offerId: Int
        clickDay: Int  
        clickWeek: Int  
        clickMonth: Int  
        clicksRedirectStatus: String  
        clicksRedirectOfferId: Int  
        salesDay: Int  
        salesWeek: Int  
        salesMonth: Int  
        salesRedirectStatus: String  
        salesRedirectOfferId: Int 
  }
  
  extend type Mutation {
    createOffer(
        name: String!, 
     ): CreateOffer

    saveOffer(
        id: Int!
        name: String!
        advertiser: String!
        verticals: String!
        conversionType: String!
        geoRules: String!
        customLPRules: String!        
        caps: String!
        lp: String!        
        payIn: Float!
        payOut: Float!
        status: String!
        defaultLp: Int!
        offerIdRedirect: Int!
        payoutPercent: Int!
        isCpmOptionEnabled: Int!
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